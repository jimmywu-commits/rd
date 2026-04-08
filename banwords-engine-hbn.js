(function(global){
  'use strict';

  let currentRules = [];

  function normalizeRuleRecord(rule){
    return {
      row: rule && rule.row != null ? rule.row : null,
      scope: rule && rule.scope != null ? rule.scope : '出現',
      keyword: rule && rule.keyword != null ? String(rule.keyword).trim() : '',
      rule: rule && rule.rule != null ? String(rule.rule).trim() : '',
      message: rule && rule.message != null ? String(rule.message).trim() : '',
      exclude: rule && rule.exclude != null ? String(rule.exclude).trim() : ''
    };
  }

  function setRules(nextRules){
    currentRules = Array.isArray(nextRules)
      ? nextRules.map(normalizeRuleRecord).filter(function(r){ return !!r.keyword; })
      : [];
    return currentRules;
  }

  function getRules(){
    return currentRules;
  }

  function splitList(value){
    if (!value) return [];
    return String(value)
      .split(/[\n,，、、\/]+/)
      .map(function(s){ return s.trim(); })
      .filter(Boolean);
  }

  function escapeRegExp(str){
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function isRegexKeyword(keyword){
    if (!keyword) return false;
    if (keyword === '-' || keyword === '~') return false;

    const raw = String(keyword);

    if (raw.length === 1) return false;
    if (/\\[dDsSwWbB]/.test(raw)) return true;
    if (/^\^.*\$/.test(raw)) return true;
    if (/[+*?]{1,}/.test(raw)) return true;
    if (/\[[^\]]+\]/.test(raw)) return true;
    if (/\([^\)]*\)/.test(raw)) return true;
    if (/\|/.test(raw)) return true;
    if (/\\./.test(raw)) return true;

    return false;
  }

  function buildKeywordPattern(keyword){
    const raw = String(keyword || '');
    const flags = /[A-Za-z]/.test(raw) ? 'gi' : 'g';

    if (raw === '-') return /\-/g;
    if (raw === '~') return /\~/g;

    if (isRegexKeyword(raw)) {
      try {
        return new RegExp(raw, flags);
      } catch (err) {
        return new RegExp(escapeRegExp(raw), flags);
      }
    }

    return new RegExp(escapeRegExp(raw), flags);
  }

  function parseReplacement(ruleText){
    const m = String(ruleText || '').match(/^自動改成["「]?([\s\S]+?)["」]?$/);
    return m ? m[1] : '';
  }

  function replaceKeyword(text, keyword, replacement){
    const pattern = buildKeywordPattern(keyword);
    return String(text || '').replace(pattern, replacement);
  }

  function testKeyword(text, keyword){
    const pattern = buildKeywordPattern(keyword);
    pattern.lastIndex = 0;
    return pattern.test(String(text || ''));
  }

  function removeKeyword(text, keyword){
    const pattern = buildKeywordPattern(keyword);
    return String(text || '').replace(pattern, '');
  }

  function getCellByAliases(row, aliases){
    if (!row || typeof row !== 'object') return undefined;
    for (let i = 0; i < aliases.length; i++) {
      const key = aliases[i];
      if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== '') {
        return row[key];
      }
    }
    return undefined;
  }

  function formatExcelValue(value){
    if (value == null) return '';
    if (typeof value === 'number') return String(value);
    return String(value).trim();
  }

  function convertExcelRowsToRules(rows){
    if (!Array.isArray(rows) || !rows.length) return [];

    const firstRow = rows[0] || {};
    const hasObjectHeader = typeof firstRow === 'object' && !Array.isArray(firstRow);

    if (hasObjectHeader) {
      return rows.map(function(row, idx){
        if (!row || typeof row !== 'object') return null;

        const keyword = formatExcelValue(
          getCellByAliases(row, ['禁用語列表', '禁用語', '關鍵字', 'keyword', 'A欄'])
        );
        const replacement = formatExcelValue(
          getCellByAliases(row, ['改字', '替換字', '替換內容', 'replace', 'replacement', 'B欄'])
        );
        const exclude = formatExcelValue(
          getCellByAliases(row, ['排除', '排除禁用語', '排除詞', 'exclude', 'C欄'])
        );
        const message = formatExcelValue(
          getCellByAliases(row, [
            '若符合左B欄的禁字語，在報告中呈現：禁用語列表的內容加上以下內容 (紅字)',
            '若符合左B欄的禁字語，在報告中呈現：\n禁用語列表的內容加上以下內容 (紅字)',
            '提示文案',
            '訊息',
            '說明',
            'message',
            'D欄'
          ])
        );
        const rowNo = formatExcelValue(
          getCellByAliases(row, ['row', '列', '編號'])
        );

        if (!keyword || keyword === '禁用語列表') return null;

        return normalizeRuleRecord({
          row: rowNo || (idx + 1),
          scope: '出現',
          keyword: keyword,
          rule: replacement ? ('自動改成"' + replacement + '"') : '直接無法輸入',
          message: message || '',
          exclude: exclude || ''
        });
      }).filter(Boolean);
    }

    return rows.map(function(row, idx){
      if (!Array.isArray(row)) return null;

      const keyword = formatExcelValue(row[0]);
      const replacement = formatExcelValue(row[1]);
      const exclude = formatExcelValue(row[2]);
      const message = formatExcelValue(row[3]);

      if (!keyword || keyword === '禁用語列表') return null;

      return normalizeRuleRecord({
        row: idx + 1,
        scope: '出現',
        keyword: keyword,
        rule: replacement ? ('自動改成"' + replacement + '"') : '直接無法輸入',
        message: message || '',
        exclude: exclude || ''
      });
    }).filter(Boolean);
  }

  function loadRulesFromExcelArrayBuffer(arrayBuffer){
    if (!global.XLSX) {
      throw new Error('XLSX parser not found');
    }

    const workbook = global.XLSX.read(arrayBuffer, { type: 'array' });
    const targetSheetName = workbook.SheetNames.indexOf('禁用語') !== -1
      ? '禁用語'
      : workbook.SheetNames[0];

    const sheet = workbook.Sheets[targetSheetName];
    const rows = global.XLSX.utils.sheet_to_json(sheet, { defval: '' });
    const rules = convertExcelRowsToRules(rows);

    setRules(rules);
    return rules;
  }

  function getTextFromElement(el){
    if (!el) return '';
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.counter,.audit-tip').forEach(function(node){
      node.remove();
    });
    return (clone.textContent || '').replace(/\u00A0/g, ' ').trim();
  }

  function formatNumericToken(token, keepDollar){
    let digits = String(token || '').replace(/^0+(?=\d)/, '');
    if (!digits) digits = '0';

    const withComma = digits.length >= 4
      ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : digits;

    if (keepDollar) return '$' + withComma;
    if (digits.length >= 2) return '$' + withComma;
    return withComma;
  }

  function applyStandardNumericRules(text){
    let out = String(text || '');

    const slashDateMap = [];
    out = out.replace(/\b0*\d{1,2}\/0*\d{1,2}(?:\s*-\s*0*\d{1,2}\/0*\d{1,2})?\b/g, function(match){
      const normalized = match.replace(/\s*-\s*/g, ' - ');
      const key = '__SLASHDATE_' + slashDateMap.length + '__';
      slashDateMap.push(normalized);
      return key;
    });

    const percentMap = [];
    out = out.replace(/\b(\d{1,2})%/g, function(match){
      const key = '__PERCENT_' + percentMap.length + '__';
      percentMap.push(match);
      return key;
    });

    // 保護「數字+蝦幣」與「蝦幣+數字」，避免自動補 $
    const coinMap = [];
    out = out.replace(/\d+\s*蝦幣|蝦幣\s*\d+/g, function(match){
      const key = '__COIN_' + coinMap.length + '__';
      coinMap.push(match);
      return key;
    });

    out = out.replace(/\$0*\d+\b/g, function(match){
      return formatNumericToken(match.slice(1), true);
    });

    out = out.replace(/(^|[^\d$,%])(0*\d{2,})\b/g, function(match, prefix, digits){
      return prefix + formatNumericToken(digits, false);
    });

    coinMap.forEach(function(val, i){
      out = out.replace('__COIN_' + i + '__', val);
    });

    percentMap.forEach(function(val, i){
      out = out.replace('__PERCENT_' + i + '__', val);
    });

    slashDateMap.forEach(function(val, i){
      out = out.replace('__SLASHDATE_' + i + '__', val);
    });

    return out;
  }

  function normalizeLeadingDateForDateRole(text){
    const out = String(text || '');
    const leadingDatePattern = /^(0*\d{1,2}\/0*\d{1,2}(?:\s*-\s*0*\d{1,2}\/0*\d{1,2})?)(\s*)([\s\S]*)$/;
    const match = out.match(leadingDatePattern);

    if (!match) return out;

    const datePart = match[1].replace(/\s*-\s*/g, ' - ');
    const rest = match[3] || '';

    if (rest) return datePart + ' ' + rest.replace(/^\s+/, '');
    return datePart + ' ';
  }

  function applyNumericRules(text, role){
    let out = String(text || '');
    if (role === 'date') {
      out = normalizeLeadingDateForDateRole(out);
      return applyStandardNumericRules(out);
    }
    return applyStandardNumericRules(out);
  }

  function makeToken(prefix, index){
    return '__' + prefix + '_' + index + '__';
  }

  function protectExcludedSegments(text, excludeText){
    let out = String(text || '');
    const protectedMap = [];

    const excludes = splitList(excludeText);
    excludes.forEach(function(ex){
      if (!ex) return;

      const pattern = new RegExp(escapeRegExp(ex), 'g');
      out = out.replace(pattern, function(match){
        const token = makeToken('EXCLUDE', protectedMap.length);
        protectedMap.push({
          token: token,
          value: match
        });
        return token;
      });
    });

    return {
      text: out,
      protectedMap: protectedMap
    };
  }

  function restoreExcludedSegments(text, protectedMap){
    let out = String(text || '');
    (protectedMap || []).forEach(function(item){
      out = out.replace(item.token, item.value);
    });
    return out;
  }

  function transformText(text, role){
    const original = String(text || '');
    let out = original;
    const messages = [];
    let changed = false;
    let blocked = false;

    getRules().forEach(function(rule){
      if (!rule.keyword) return;

      const protectedResult = protectExcludedSegments(out, rule.exclude);
      let workingText = protectedResult.text;
      const protectedMap = protectedResult.protectedMap;

      if (!testKeyword(workingText, rule.keyword)) {
        out = restoreExcludedSegments(workingText, protectedMap);
        return;
      }

      const replacement = parseReplacement(rule.rule);

      if (String(rule.rule || '').indexOf('自動改成') === 0 && replacement) {
        const next = replaceKeyword(workingText, rule.keyword, replacement);
        if (next !== workingText) {
          workingText = next;
          changed = true;
          if (rule.message) messages.push(rule.message);
        }
      } else if (rule.rule === '直接無法輸入') {
        const next = removeKeyword(workingText, rule.keyword);
        if (next !== workingText) {
          workingText = next;
          changed = true;
          blocked = true;
          if (rule.message) messages.push(rule.message);
        }
      }

      out = restoreExcludedSegments(workingText, protectedMap);
    });

    const adjusted = applyNumericRules(out, role);
    if (adjusted !== out) {
      out = adjusted;
      changed = true;
    }

    out = out.replace(/\s{2,}/g, ' ').trim();

    const uniqueMessages = Array.from(new Set(messages));
    return {
      text: out,
      changed: changed || out !== original,
      blocked: blocked,
      message: uniqueMessages.join('；'),
      messages: uniqueMessages,
      duration: 4000
    };
  }

  function applyToElement(el, options){
    options = options || {};
    const role = options.role || (el && el.dataset ? el.dataset.role : '');
    const getText = options.getText || getTextFromElement;
    const before = getText(el);
    const result = transformText(before, role);

    if (el && result.text !== before) {
      const counter = el.querySelector('.counter');
      el.textContent = result.text;
      if (counter) el.appendChild(counter);
    }

    if (el) {
      if (result.blocked) el.classList.add('audit-error');
      else el.classList.remove('audit-error');
    }

    return result;
  }

  global.banwordEngine = {
    rules: currentRules,
    getRules: getRules,
    setRules: function(rules){
      this.rules = setRules(rules);
      return this.rules;
    },
    convertExcelRowsToRules: convertExcelRowsToRules,
    loadRulesFromExcelArrayBuffer: function(arrayBuffer){
      this.rules = loadRulesFromExcelArrayBuffer(arrayBuffer);
      return this.rules;
    },
    getTextFromElement: getTextFromElement,
    transformText: transformText,
    applyToElement: applyToElement
  };
})(window);
(function(global){
  'use strict';

  const DEFAULT_RULES = [
    {
      "row": 2,
      "scope": "出現",
      "keyword": "撒",
      "rule": "自動改成\"灑\"",
      "message": "\"撒\"請改用\"灑\"",
      "exclude": null
    },
    {
      "row": 3,
      "scope": "出現",
      "keyword": "購物金",
      "rule": "自動改成\"優惠券\"",
      "message": "統一使用\"優惠券\"來溝通",
      "exclude": null
    },
    {
      "row": 4,
      "scope": "出現",
      "keyword": "抵用券",
      "rule": "自動改成\"優惠券\"",
      "message": "統一使用\"優惠券\"來溝通",
      "exclude": null
    },
    {
      "row": 5,
      "scope": "出現",
      "keyword": "折價券",
      "rule": "自動改成\"優惠券\"",
      "message": "統一使用\"優惠券\"來溝通",
      "exclude": null
    },
    {
      "row": 6,
      "scope": "出現",
      "keyword": "蝦皮券",
      "rule": "自動改成\"優惠券\"",
      "message": "統一使用\"優惠券\"來溝通",
      "exclude": null
    },
    {
      "row": 7,
      "scope": "出現",
      "keyword": "蝦幣券",
      "rule": "自動改成\"優惠券\"",
      "message": "統一使用\"優惠券\"來溝通",
      "exclude": null
    },
    {
      "row": 8,
      "scope": "出現",
      "keyword": "折扣券",
      "rule": "自動改成\"優惠券\"",
      "message": "統一使用\"優惠券\"來溝通",
      "exclude": null
    },
    {
      "row": 9,
      "scope": "出現",
      "keyword": "$*蝦幣",
      "rule": "蝦幣前勿放$符號",
      "message": "統一使用\"優惠券\"來溝通",
      "exclude": null
    },
    {
      "row": 10,
      "scope": "出現",
      "keyword": "元",
      "rule": "直接無法輸入",
      "message": "避免使用\"元\"，金額請用\"$\"符號即可",
      "exclude": null
    },
    {
      "row": 11,
      "scope": "出現",
      "keyword": "蝦幣*元",
      "rule": "蝦幣後勿加元",
      "message": null,
      "exclude": null
    },
    {
      "row": 12,
      "scope": "出現",
      "keyword": "*元蝦幣",
      "rule": "勿使用元，金額請使用\"$\"符號取代",
      "message": null,
      "exclude": null
    },
    {
      "row": 13,
      "scope": "出現",
      "keyword": "*倍蝦幣",
      "rule": "蝦幣不用倍數呈現，請改用\"%\"取代",
      "message": null,
      "exclude": null
    },
    {
      "row": 14,
      "scope": "出現",
      "keyword": "賺",
      "rule": "直接無法輸入",
      "message": "避免使用任何可能使蝦幣看起來有金錢價值的用語",
      "exclude": null
    },
    {
      "row": 15,
      "scope": "出現",
      "keyword": "賺取",
      "rule": "直接無法輸入",
      "message": "避免使用任何可能使蝦幣看起來有金錢價值的用語",
      "exclude": null
    },
    {
      "row": 16,
      "scope": "出現",
      "keyword": "賣蝦幣",
      "rule": "直接無法輸入",
      "message": "避免使用任何可能使蝦幣看起來有金錢價值的用語",
      "exclude": null
    },
    {
      "row": 17,
      "scope": "出現",
      "keyword": "up",
      "rule": "自動改成\"起\"",
      "message": "\"up\"請改用\"起\"",
      "exclude": null
    },
    {
      "row": 18,
      "scope": "出現",
      "keyword": "商城狂購節",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 19,
      "scope": "出現",
      "keyword": "蝦皮吃貨節",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 20,
      "scope": "出現",
      "keyword": "蝦皮中元節",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 21,
      "scope": "出現",
      "keyword": "蝦皮時尚週",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 22,
      "scope": "出現",
      "keyword": "18號",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 23,
      "scope": "出現",
      "keyword": "25號",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 24,
      "scope": "出現",
      "keyword": "18節",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 25,
      "scope": "出現",
      "keyword": "25節",
      "rule": "直接無法輸入",
      "message": "避免使用蝦皮站上活動名稱",
      "exclude": null
    },
    {
      "row": 26,
      "scope": "出現",
      "keyword": "最強",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 27,
      "scope": "出現",
      "keyword": "最便宜",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 28,
      "scope": "出現",
      "keyword": "最低價",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 29,
      "scope": "出現",
      "keyword": "最優惠",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 30,
      "scope": "出現",
      "keyword": "最大牌",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 31,
      "scope": "出現",
      "keyword": "最佳",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 32,
      "scope": "出現",
      "keyword": "最大品牌",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 33,
      "scope": "出現",
      "keyword": "效果最好",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 34,
      "scope": "出現",
      "keyword": "年度最強",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 35,
      "scope": "出現",
      "keyword": "競網最便宜",
      "rule": "自動改成\"超\"",
      "message": "避免使用\"最\"字，無法證明最高級，自動改成\"超\"",
      "exclude": null
    },
    {
      "row": 36,
      "scope": "出現",
      "keyword": "獨家",
      "rule": "直接無法輸入",
      "message": "需確認只有蝦皮獨家，非其他網家也有相同/類似活動，避免產生法務及客訴疑慮",
      "exclude": null
    },
    {
      "row": 37,
      "scope": "出現",
      "keyword": "第一",
      "rule": "直接無法輸入",
      "message": "避免使用No1，因蝦皮無法證明第一名，需廠商提供更多資訊證實",
      "exclude": null
    },
    {
      "row": 38,
      "scope": "出現",
      "keyword": "No1",
      "rule": "直接無法輸入",
      "message": "避免使用No2，因蝦皮無法證明第一名，需廠商提供更多資訊證實",
      "exclude": null
    },
    {
      "row": 39,
      "scope": "出現",
      "keyword": "NO.1",
      "rule": "直接無法輸入",
      "message": "避免使用No3，因蝦皮無法證明第一名，需廠商提供更多資訊證實",
      "exclude": null
    },
    {
      "row": 40,
      "scope": "出現",
      "keyword": "N0.1",
      "rule": "直接無法輸入",
      "message": "避免使用No4，因蝦皮無法證明第一名，需廠商提供更多資訊證實",
      "exclude": null
    },
    {
      "row": 41,
      "scope": "出現",
      "keyword": "No.1",
      "rule": "直接無法輸入",
      "message": "避免使用No5，因蝦皮無法證明第一名，需廠商提供更多資訊證實",
      "exclude": null
    },
    {
      "row": 42,
      "scope": "出現",
      "keyword": "專屬",
      "rule": "自動改成\"屬於、限定\"",
      "message": "避免使用專屬，需廠商提供更多資訊證實",
      "exclude": null
    },
    {
      "row": 43,
      "scope": "出現",
      "keyword": "VIP",
      "rule": "自動改成\"屬於、限定\"",
      "message": "避免使用VIP，需廠商提供更多資訊證實",
      "exclude": null
    },
    {
      "row": 44,
      "scope": "出現",
      "keyword": "拚",
      "rule": "自動改成\"拼\"",
      "message": "\"拚\"請改用\"拼\"",
      "exclude": null
    },
    {
      "row": 45,
      "scope": "出現",
      "keyword": "卷",
      "rule": "自動改成\"券\"",
      "message": "\"卷\"請改用\"券\"",
      "exclude": null
    },
    {
      "row": 46,
      "scope": "出現",
      "keyword": "周",
      "rule": "自動改成\"週\"",
      "message": "\"周\"請改用\"週\"",
      "exclude": null
    },
    {
      "row": 47,
      "scope": "出現",
      "keyword": "千",
      "rule": "直接無法輸入",
      "message": "\"千\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 48,
      "scope": "出現",
      "keyword": "仟",
      "rule": "直接無法輸入",
      "message": "\"千\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 49,
      "scope": "出現",
      "keyword": "百",
      "rule": "直接無法輸入",
      "message": "\"百\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 50,
      "scope": "出現",
      "keyword": "-",
      "rule": "自動改成\" - \"",
      "message": "-前後需加空白",
      "exclude": null
    },
    {
      "row": 51,
      "scope": "出現",
      "keyword": "~",
      "rule": "自動改成\"-\"",
      "message": "日期中間避免用用波浪線",
      "exclude": null
    },
    {
      "row": 52,
      "scope": "出現",
      "keyword": "!",
      "rule": "直接無法輸入",
      "message": "請勿使用!符號",
      "exclude": null
    },
    {
      "row": 53,
      "scope": "出現",
      "keyword": "?",
      "rule": "直接無法輸入",
      "message": "請勿使用?符號",
      "exclude": null
    },
    {
      "row": 54,
      "scope": "出現",
      "keyword": "+",
      "rule": "直接無法輸入",
      "message": "請勿使用+符號",
      "exclude": null
    },
    {
      "row": 55,
      "scope": "出現",
      "keyword": ".",
      "rule": "直接無法輸入",
      "message": "請勿使用.符號",
      "exclude": null
    },
    {
      "row": 56,
      "scope": "出現",
      "keyword": "\"",
      "rule": "直接無法輸入",
      "message": "請勿使用\"符號",
      "exclude": null
    },
    {
      "row": 57,
      "scope": "出現",
      "keyword": "一",
      "rule": "直接無法輸入",
      "message": "\"一\"請改用阿拉伯數字呈現",
      "exclude": "一日限定"
    },
    {
      "row": 58,
      "scope": "出現",
      "keyword": "兩",
      "rule": "直接無法輸入",
      "message": "\"兩\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 59,
      "scope": "出現",
      "keyword": "二",
      "rule": "直接無法輸入",
      "message": "\"二\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 60,
      "scope": "出現",
      "keyword": "三",
      "rule": "直接無法輸入",
      "message": "\"三\"請改用阿拉伯數字呈現",
      "exclude": "三星"
    },
    {
      "row": 61,
      "scope": "出現",
      "keyword": "四",
      "rule": "直接無法輸入",
      "message": "\"四\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 62,
      "scope": "出現",
      "keyword": "五",
      "rule": "直接無法輸入",
      "message": "\"五\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 63,
      "scope": "出現",
      "keyword": "六",
      "rule": "直接無法輸入",
      "message": "\"六\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 64,
      "scope": "出現",
      "keyword": "七",
      "rule": "直接無法輸入",
      "message": "\"七\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 65,
      "scope": "出現",
      "keyword": "八",
      "rule": "直接無法輸入",
      "message": "\"八\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 66,
      "scope": "出現",
      "keyword": "九",
      "rule": "直接無法輸入",
      "message": "\"九\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 67,
      "scope": "出現",
      "keyword": "十",
      "rule": "直接無法輸入",
      "message": "\"十\"請改用阿拉伯數字呈現",
      "exclude": null
    },
    {
      "row": 68,
      "scope": "出現",
      "keyword": "超級品牌日",
      "rule": "直接無法輸入",
      "message": "不可使用\"超級品牌日\"",
      "exclude": null
    },
    {
      "row": 69,
      "scope": "出現",
      "keyword": "阿拉伯數字2位字(包含)以上",
      "rule": "直接在數字前面加\"$\"符號",
      "message": null,
      "exclude": null
    },
    {
      "row": 70,
      "scope": "出現",
      "keyword": "2位(包含)以上數阿拉伯數字前面是0開頭的話",
      "rule": "數字前面的0自動消失",
      "message": "日期若為個位數勿在前面加0",
      "exclude": null
    },
    {
      "row": 71,
      "scope": "出現",
      "keyword": "\"/\"、\":\"、\";\"、\".\"、\"?\"、\"!\"、\"|\"",
      "rule": "直接無法輸入",
      "message": "不可使用特殊符號",
      "exclude": null
    }
  ];

  let currentRules = DEFAULT_RULES.slice();

  function cloneRule(rule){
    return {
      row: rule.row ?? null,
      scope: rule.scope ?? '',
      keyword: rule.keyword ?? '',
      rule: rule.rule ?? '',
      message: rule.message ?? '',
      exclude: rule.exclude ?? null
    };
  }

  function normalizeRuleRecord(rule){
    return cloneRule(rule || {});
  }

  function setRules(nextRules){
    currentRules = Array.isArray(nextRules) ? nextRules.map(normalizeRuleRecord) : [];
    return currentRules;
  }

  function getRules(){
    return currentRules;
  }

  function splitExcelList(value){
    if(value == null) return [];
    return String(value)
      .split(/[\n,，、\/]+/)
      .map(function(s){ return s.trim(); })
      .filter(Boolean);
  }

  function mapExcelMessageToRule(keyword, message){
    var msg = String(message || '').trim();
    if (!msg) return '直接無法輸入';

    var autoMatch = msg.match(/^請改成[\"「『]?([\s\S]+?)[\"」』]?$/);
    if (autoMatch) return '自動改成\"' + autoMatch[1] + '\"';

    if (/請勿使用/.test(msg)) return '直接無法輸入';
    if (/避免使用/.test(msg)) return '直接無法輸入';
    if (/請改用阿拉伯數字呈現/.test(msg)) return '直接無法輸入';
    if (/蝦幣前勿放\$符號/.test(msg)) return '蝦幣前勿放$符號';
    if (/蝦幣後勿加元/.test(msg)) return '蝦幣後勿加元';
    if (/勿使用元，金額請使用\"\$\"符號取代/.test(msg)) return '勿使用元，金額請使用\"$\"符號取代';
    if (/蝦幣不用倍數呈現/.test(msg)) return '蝦幣不用倍數呈現，請改用\"%\"取代';
    if (/日期中間避免用用波浪線/.test(msg)) return '自動改成\"-\"';
    if (/up改用中文字/.test(msg) || /\bup\b/i.test(keyword)) return '自動改成\"起\"';

    return '直接無法輸入';
  }

  function mapExcelMessageToDisplayMessage(keyword, message){
    var msg = String(message || '').trim();
    if (!msg) return '';
    if (/^請改成/.test(msg)) return '\"' + keyword + '\"' + msg.replace(/^請改成/, '請改用');
    return msg;
  }

  function getCellByAliases(row, aliases){
    if (!row || typeof row !== 'object') return undefined;
    for (var i = 0; i < aliases.length; i++) {
      var key = aliases[i];
      if (Object.prototype.hasOwnProperty.call(row, key) && row[key] !== '') {
        return row[key];
      }
    }
    return undefined;
  }

  function convertExcelRowsToRules(rows){
    if (!Array.isArray(rows) || !rows.length) return DEFAULT_RULES.slice();

    var firstRow = rows[0] || {};
    var hasObjectHeader = typeof firstRow === 'object' && !Array.isArray(firstRow);

    if (hasObjectHeader) {
      return rows
        .map(function(row, idx){
          if (!row || typeof row !== 'object') return null;

          var keyword = getCellByAliases(row, ['keyword', '禁用語列表', '禁用語', '關鍵字']);
          var rule = getCellByAliases(row, ['rule', '規則']);
          var message = getCellByAliases(row, ['message', '提示文案', '訊息', '說明']);
          var exclude = getCellByAliases(row, ['exclude', '排除禁用語', '排除詞']);
          var scope = getCellByAliases(row, ['scope', '範圍']);
          var rowNo = getCellByAliases(row, ['row', '列', '編號']);

          if (!keyword && !rule && !message) return null;

          keyword = keyword == null ? '' : String(keyword).trim();
          if (!keyword || keyword === '禁用語列表') return null;

          message = message == null ? '' : String(message).trim();
          rule = rule == null || String(rule).trim() === ''
            ? mapExcelMessageToRule(keyword, message)
            : String(rule).trim();

          return normalizeRuleRecord({
            row: rowNo != null && rowNo !== '' ? rowNo : idx + 1,
            scope: scope || '出現',
            keyword: keyword,
            rule: rule,
            message: message ? mapExcelMessageToDisplayMessage(keyword, message) : '',
            exclude: exclude == null || String(exclude).trim() === ''
              ? null
              : splitExcelList(exclude).join(',')
          });
        })
        .filter(Boolean);
    }

    var output = [];
    rows.forEach(function(row, idx){
      var keyword = '';
      var exclude = null;
      var message = '';

      if (Array.isArray(row)) {
        keyword = row[0];
        exclude = row[1];
        message = row[2];
      }

      keyword = keyword == null ? '' : String(keyword).trim();
      exclude = exclude == null ? null : splitExcelList(exclude).join(',');
      message = message == null ? '' : String(message).trim();

      if (!keyword || keyword === '禁用語列表') return;

      output.push({
        row: idx + 1,
        scope: '出現',
        keyword: keyword,
        rule: mapExcelMessageToRule(keyword, message),
        message: mapExcelMessageToDisplayMessage(keyword, message),
        exclude: exclude || null
      });
    });

    return output.length ? output.map(normalizeRuleRecord) : DEFAULT_RULES.slice();
  }

  function loadRulesFromExcelArrayBuffer(arrayBuffer){
    if (!global.XLSX) {
      throw new Error('XLSX parser not found');
    }

    var workbook = global.XLSX.read(arrayBuffer, { type: 'array' });
    var firstSheetName = workbook.SheetNames[0];
    var sheet = workbook.Sheets[firstSheetName];

    var rows = global.XLSX.utils.sheet_to_json(sheet, { defval: '' });
    var rules = convertExcelRowsToRules(rows);

    setRules(rules);
    return rules;
  }

  function getTextFromElement(el){
    if(!el) return '';
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.counter').forEach(function(node){ node.remove(); });
    return (clone.textContent || '').replace(/\u00A0/g, ' ').trim();
  }

  function splitExcludes(value){
    if(!value) return [];
    return String(value).split(/[\n,，、\/]+/).map(function(s){ return s.trim(); }).filter(Boolean);
  }

  function escapeRegExp(str){
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function shouldSkipRule(text, rule){
    const excludes = splitExcludes(rule.exclude);
    for (var i = 0; i < excludes.length; i++) {
      if (excludes[i] && text.indexOf(excludes[i]) !== -1) return true;
    }
    return false;
  }

  function parseReplacement(ruleText){
    var m = String(ruleText || '').match(/^自動改成["「]?([\s\S]+?)["」]?$/);
    return m ? m[1] : '';
  }

  function replaceKeyword(text, keyword, replacement){
    if (keyword === '-') {
      return text.replace(/\s*-\s*/g, ' - ');
    }
    if (keyword === '~') {
      return text.replace(/\s*~\s*/g, ' - ');
    }
    var flags = /[A-Za-z]/.test(keyword) ? 'gi' : 'g';
    var pattern = new RegExp(escapeRegExp(keyword), flags);
    return text.replace(pattern, replacement);
  }

  function testKeyword(text, keyword){
    if (keyword === '-' || keyword === '~') {
      return text.indexOf(keyword) !== -1;
    }
    var flags = /[A-Za-z]/.test(keyword) ? 'gi' : 'g';
    var pattern = new RegExp(escapeRegExp(keyword), flags);
    return pattern.test(text);
  }

  function formatNumericToken(token, keepDollar){
    var digits = String(token || '').replace(/^0+(?=\d)/, '');
    if (!digits) digits = '0';
    var withComma = digits.length >= 4 ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : digits;
    if (keepDollar) return '$' + withComma;
    if (digits.length >= 2) return '$' + withComma;
    return withComma;
  }

  function applyStandardNumericRules(text){
    var out = String(text || '');

    var slashDateMap = [];
    out = out.replace(/\b0*\d{1,2}\/0*\d{1,2}(?:\s*-\s*0*\d{1,2}\/0*\d{1,2})?\b/g, function(match){
      var normalized = match.replace(/\s*-\s*/g, ' - ');
      var key = '__SLASHDATE_' + slashDateMap.length + '__';
      slashDateMap.push(normalized);
      return key;
    });

    var percentMap = [];
    out = out.replace(/\b(\d{1,2})%/g, function(match){
      var key = '__PERCENT_' + percentMap.length + '__';
      percentMap.push(match);
      return key;
    });

    out = out.replace(/\$0*\d+\b/g, function(match){
      return formatNumericToken(match.slice(1), true);
    });

    out = out.replace(/(^|[^\d$,%])(0*\d{2,})\b/g, function(match, prefix, digits){
      return prefix + formatNumericToken(digits, false);
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
    var out = String(text || '');

    var leadingDatePattern = /^(0*\d{1,2}\/0*\d{1,2}(?:\s*-\s*0*\d{1,2}\/0*\d{1,2})?)(\s*)([\s\S]*)$/;
    var match = out.match(leadingDatePattern);

    if (!match) return out;

    var datePart = match[1].replace(/\s*-\s*/g, ' - ');
    var rest = match[3] || '';

    if (rest) {
      return datePart + ' ' + rest.replace(/^\s+/, '');
    }

    return datePart + ' ';
  }

  function applyNumericRules(text, role){
    var out = String(text || '');

    if (role === 'date') {
      out = normalizeLeadingDateForDateRole(out);
      return applyStandardNumericRules(out);
    }

    return applyStandardNumericRules(out);
  }

  function buildSpecialSymbolPattern(role){
    var chars = role === 'date' ? ':;".!?|' : '/:;".!?|';
    return new RegExp('[' + chars.replace(/[\]\\^-]/g, '\\$&') + ']', 'g');
  }

  function applyReplacementPass(text, messages){
    var out = String(text || '');
    var passChanged = false;

    getRules().forEach(function(rule){
      if (String(rule.rule || '').indexOf('自動改成') !== 0) return;
      if (!rule.keyword || rule.keyword.indexOf('阿拉伯數字') !== -1) return;
      if (shouldSkipRule(out, rule)) return;

      var replacement = parseReplacement(rule.rule);
      if (!replacement) return;

      if (testKeyword(out, rule.keyword)) {
        var next = replaceKeyword(out, rule.keyword, replacement);
        if (next !== out) {
          out = next;
          passChanged = true;
          if (rule.message) messages.push(rule.message);
        }
      }
    });

    return { text: out, changed: passChanged };
  }

  function transformText(text, role){
    var original = String(text || '');
    var out = original;
    var messages = [];
    var changed = false;

    for (var i = 0; i < 3; i++) {
      var pass = applyReplacementPass(out, messages);
      out = pass.text;
      if (!pass.changed) break;
      changed = true;
    }

    var numericallyAdjusted = applyNumericRules(out, role);
    if (numericallyAdjusted !== out) changed = true;
    out = numericallyAdjusted;

    getRules().forEach(function(rule){
      if (rule.rule !== '直接無法輸入') return;
      if (!rule.keyword) return;
      if (shouldSkipRule(out, rule)) return;
      if (rule.keyword.indexOf('"/"') !== -1) return;

      var flags = /[A-Za-z]/.test(rule.keyword) ? 'gi' : 'g';
      var pattern = new RegExp(escapeRegExp(rule.keyword), flags);

      if (pattern.test(out)) {
        out = out.replace(pattern, '');
        changed = true;
        if (rule.message) messages.push(rule.message);
      }
    });

    var specialRule = getRules().find(function(rule){
      return rule.keyword && rule.keyword.indexOf('"/"') !== -1;
    });

    if (specialRule) {
      var sp = buildSpecialSymbolPattern(role);
      if (sp.test(out)) {
        out = out.replace(sp, '');
        changed = true;
        if (specialRule.message) messages.push(specialRule.message);
      }
    }

    out = out.replace(/\s{2,}/g, ' ').trim();

    var uniqueMessages = Array.from(new Set(messages));
    return {
      text: out,
      changed: changed || out !== original,
      message: uniqueMessages.join('；'),
      messages: uniqueMessages
    };
  }

  function applyToElement(el, options){
    options = options || {};
    var role = options.role || (el && el.dataset ? el.dataset.role : '');
    var getText = options.getText || getTextFromElement;
    var before = getText(el);
    var result = transformText(before, role);

    if (el && result.text !== before) {
      el.textContent = result.text;
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
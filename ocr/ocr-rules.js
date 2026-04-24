(function(global){
  'use strict';

  let excelRules = [];

  function markLoaded(){
    global.ocrAuditRulesLoaded = true;
  }

  function esc(str){
    return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normalizeForCompare(text){
    return String(text || '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, '')
      .replace(/[，]/g, ',')
      .replace(/[％]/g, '%')
      .trim();
  }

  function fuzzyLiteralPattern(text){
    const chars = Array.from(String(text || '').replace(/\s+/g, ''));
    if (!chars.length) return null;
    return new RegExp(chars.map(esc).join('\\s*'), 'g');
  }

  function getCell(row, aliases){
    for (const k of aliases) {
      if (row && Object.prototype.hasOwnProperty.call(row, k) && row[k] !== '') return row[k];
    }
    return '';
  }

  function parseExcelRows(rows){
    return (rows || []).map((row, idx) => {
      const keyword = String(getCell(row, ['禁用語列表','禁用語','關鍵字','keyword','A欄']) || '').trim();
      const replacement = String(getCell(row, ['改字','替換字','替換內容','replace','replacement','B欄']) || '').trim();
      const exclude = String(getCell(row, ['排除','排除禁用語','排除詞','exclude','C欄']) || '').trim();
      const note = String(getCell(row, [
        '若符合左B欄的禁字語，在報告中呈現：禁用語列表的內容加上以下內容 (紅字)',
        '若符合左B欄的禁字語，在報告中呈現：\n禁用語列表的內容加上以下內容 (紅字)',
        '提示文案','訊息','說明','message','D欄'
      ]) || '').trim();

      if (!keyword || keyword === '禁用語列表') return null;
      return { row: idx + 1, keyword, replacement, exclude, note };
    }).filter(Boolean);
  }

  function loadRulesFromExcelArrayBuffer(arrayBuffer){
    if (!global.XLSX) throw new Error('XLSX parser not found');
    const workbook = global.XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames.includes('禁用語') ? '禁用語' : workbook.SheetNames[0];
    const rows = global.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });
    excelRules = parseExcelRows(rows);
    return excelRules;
  }

  function splitExclude(value){
    return String(value || '').split(/[\n,，、]+/).map(s => s.trim()).filter(Boolean);
  }

  function isExcluded(text, exclude){
    const compactText = normalizeForCompare(text);
    return splitExclude(exclude).some(ex => {
      const compactEx = normalizeForCompare(ex);
      return compactEx && compactText.includes(compactEx);
    });
  }

  function findKeywordHits(text, keyword){
    const pattern = fuzzyLiteralPattern(keyword);
    if (!pattern) return [];
    const hits = [];
    let m;
    while ((m = pattern.exec(text)) !== null) {
      hits.push({ original: m[0], index: m.index });
      if (m.index === pattern.lastIndex) pattern.lastIndex++;
    }
    return hits;
  }

  const cnNumMap = {
    '零':'0','〇':'0','一':'1','二':'2','兩':'2','三':'3','四':'4','五':'5',
    '六':'6','七':'7','八':'8','九':'9','十':'10'
  };

  function cnNumToArabic(s){
    const raw = String(s || '');
    if (raw === '十') return '10';
    if (/^十[一二三四五六七八九]$/.test(raw)) return '1' + cnNumMap[raw[1]];
    if (/^[一二兩三四五六七八九]十$/.test(raw)) return cnNumMap[raw[0]] + '0';
    if (/^[一二兩三四五六七八九]十[一二三四五六七八九]$/.test(raw)) return cnNumMap[raw[0]] + cnNumMap[raw[2]];
    return Array.from(raw).map(ch => cnNumMap[ch] || ch).join('');
  }

  function addViolation(list, original, fixed, note, type){
    if (!original) return;
    const key = [type || '', original, fixed || '', note || ''].join('|');
    if (list.some(v => v.key === key)) return;
    list.push({ key, original, fixed: fixed || '', note: note || '', type: type || 'rule' });
  }

  function auditContextChineseNumbers(text, violations){
    const patterns = [
      {
        re: /買\s*([一二兩三四五六七八九十]+)\s*送\s*([一二兩三四五六七八九十]+)/g,
        note: '買/送組合的數字請使用阿拉伯數字。',
        fix: (m,a,b) => m.replace(a, cnNumToArabic(a)).replace(b, cnNumToArabic(b))
      },
      {
        re: /買\s*([一二兩三四五六七八九十]+)\s*(件|個|組|入|盒|包|瓶|張|份)/g,
        note: '買/件數量請使用阿拉伯數字。',
        fix: (m,a,unit) => m.replace(a, cnNumToArabic(a))
      },
      {
        re: /([一二兩三四五六七八九十]+)\s*折/g,
        note: '折扣數字請使用阿拉伯數字。',
        fix: (m,a) => m.replace(a, cnNumToArabic(a))
      }
    ];

    patterns.forEach(p => {
      let m;
      while ((m = p.re.exec(text)) !== null) {
        addViolation(violations, m[0], p.fix(...m), p.note, 'context-cn-number');
      }
    });
  }

  function protectQuantitySegments(text){
    const protectedItems = [];
    let out = String(text || '');
    const patterns = [
      /買\s*\d+\s*送\s*\d+/g,
      /買\s*\d+\s*(件|個|組|入|盒|包|瓶|張|份)/g,
      /\d+\s*(件|個|組|入|盒|包|瓶|張|份|折)/g
    ];
    patterns.forEach(re => {
      out = out.replace(re, match => {
        const token = `__QTY_${protectedItems.length}__`;
        protectedItems.push({ token, value: match });
        return token;
      });
    });
    return { text: out, protectedItems };
  }

  function auditAmountRules(text, violations){
    let working = String(text || '');

    // 蝦幣前後不得有 $，這是審核規則。
    const coinPatterns = [
      /\$\s*(\d[\d,]*)\s*(蝦幣回饋|蝦幣)/g,
      /(蝦幣回饋|蝦幣)\s*\$\s*(\d[\d,]*)/g
    ];
    coinPatterns.forEach(re => {
      let m;
      while ((m = re.exec(working)) !== null) {
        const fixed = m[0].replace(/\$/g, '').replace(/\s+/g, '');
        addViolation(violations, m[0], fixed, '蝦幣前後的數字不需加 $ 符號。', 'coin-dollar');
      }
    });

    const protectedResult = protectQuantitySegments(working);
    working = protectedResult.text;

    // 有 $ 但四位以上未加千分位。
    let m;
    const dollarRe = /\$(\d{4,}|\d{1,3}(?:\d{3})+)(?![\d,])/g;
    while ((m = dollarRe.exec(working)) !== null) {
      const digits = m[1].replace(/,/g, '');
      const fixed = '$' + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (m[0] !== fixed) {
        addViolation(violations, m[0], fixed, '金額四位數以上請加千分位。', 'thousands');
      }
    }

    // 四位以上純數字若不是數量語境，視為金額缺 $。
    const bareRe = /(^|[^\d$,])(\d{4,})(?![\d,])/g;
    while ((m = bareRe.exec(working)) !== null) {
      const original = m[2];
      const fixed = '$' + original.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      addViolation(violations, original, fixed, '金額請加上 $ 符號與千分位。', 'missing-dollar');
    }
  }

  function auditExcelRules(text, violations){
    excelRules.forEach(rule => {
      if (!rule.keyword) return;

      // C欄排除採 OCR 空格容錯；符合排除就整筆規則跳過。
      if (rule.exclude && isExcluded(text, rule.exclude)) return;

      const hits = findKeywordHits(text, rule.keyword);
      hits.forEach(hit => {
        const fixed = rule.replacement || '';
        const note = rule.note || (fixed ? '請依規則改為建議文字。' : '此文字不符合規範。');
        addViolation(violations, hit.original, fixed, note, 'excel');
      });
    });
  }

  function auditText(text, options){
    const violations = [];
    const input = String(text || '');

    auditExcelRules(input, violations);
    auditContextChineseNumbers(input, violations);
    auditAmountRules(input, violations);

    // 清掉內部 key
    return { violations: violations.map(v => ({ original: v.original, fixed: v.fixed, note: v.note, type: v.type })) };
  }

  global.ocrAuditRules = {
    loadRulesFromExcelArrayBuffer,
    auditText,
    normalizeForCompare
  };
  markLoaded();
})(window);

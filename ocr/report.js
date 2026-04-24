function renderReport(violations){

  if(!violations.length){
    return "無違規";
  }

  let main = "";
  let notes = new Set();

  violations.forEach(v=>{
    main += `<div class="red">${v.original} → ${v.fixed}</div>`;
    if(v.note) notes.add(v.note);
  });

  let noteHtml = "";
  if(notes.size){
    noteHtml = "<div class='note'><b>說明：</b><br>" + 
      Array.from(notes).join("<br>") +
      "</div>";
  }

  return main + noteHtml;
}


// 模擬資料
const violations = [
  {
    original: "買三送二",
    fixed: "買3送2",
    note: "買/送組合的數字請改成阿拉伯數字"
  },
  {
    original: "1111",
    fixed: "$1,111",
    note: "金額請加上$符號與千分位"
  }
];

document.getElementById("report").innerHTML = renderReport(violations);

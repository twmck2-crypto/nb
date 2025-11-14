// Google Script URL，記得換成你的 exec URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwW8wW0SAWOOffHHOecQ2y-MiprFakxrmDWVYbxKHOd7nxr9qaK426HBmjLkUXOBj1E/exec";

let currentNumber = 0;
let currentName = "";

// 讀取今日取號數
async function loadTodayCount() {
  try {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();
    document.getElementById("todayCount").innerText = data.count;
  } catch (e) {
    document.getElementById("todayCount").innerText = "讀取失敗";
  }
}

// 取號
async function getNextNumber(name){
  currentName = name;
  let lastNumber = localStorage.getItem("lastNumber");
  currentNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;

  // 先存 localStorage
  localStorage.setItem("lastNumber", currentNumber);
  localStorage.setItem("currentName", currentName);
  localStorage.setItem("currentNumber", currentNumber);

  // POST 到 Google Sheet
  try {
    await fetch(SCRIPT_URL, {
      method:"POST",
      body: JSON.stringify({name:currentName, number:currentNumber, seeds:0})
    });
  } catch(e){
    console.warn("POST 失敗，但仍跳轉 show.html");
  }

  // 立即跳轉
  window.location.href = "show.html";
}

// show.html 種子卡頁面
function loadShowPage(){
  const number = localStorage.getItem("currentNumber");
  const name = localStorage.getItem("currentName");

  document.getElementById("displayNumber").innerText = number || "0";
  document.getElementById("displayName").innerText = name || "";

  const seedBtns = document.querySelectorAll(".seed-btn");
  let collected = 0;

  seedBtns.forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      if(btn.disabled) return;
      btn.disabled = true;
      collected++;
      if(collected === 5){
        document.getElementById("finishSection").style.display="block";
        try{
          await fetch(SCRIPT_URL,{
            method:"POST",
            body: JSON.stringify({name:name, number:number, seeds:5})
          });
        }catch(e){
          console.warn("更新種子卡失敗");
        }
      }
    });
  });

  document.getElementById("backBtn").addEventListener("click", ()=>{
    window.location.href="index.html";
  });
}

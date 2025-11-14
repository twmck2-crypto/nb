// Google Script URL，記得換成你的 exec URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwW8wW0SAWOOffHHOecQ2y-MiprFakxrmDWVYbxKHOd7nxr9qaK426HBmjLkUXOBj1E/exec";

let currentNumber = 0;
let currentName = "";

async function loadTodayCount() {
  try {
    const res = await fetch(SCRIPT_URL);
    const data = await res.json();
    document.getElementById("todayCount").innerText = data.count;
  } catch (e) {
    document.getElementById("todayCount").innerText = "讀取失敗";
  }
}

async function getNextNumber(name){
  currentName = name;
  let lastNumber = localStorage.getItem("lastNumber");
  currentNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
  localStorage.setItem("lastNumber", currentNumber);

  localStorage.setItem("currentName", currentName);
  localStorage.setItem("currentNumber", currentNumber);

  await fetch(SCRIPT_URL, {
    method:"POST",
    body: JSON.stringify({name:currentName, number:currentNumber, seeds:0})
  });

  window.location.href = "show.html";
}

function loadShowPage(){
  const number = localStorage.getItem("currentNumber");
  const name = localStorage.getItem("currentName");

  document.getElementById("displayNumber").innerText = number;
  document.getElementById("displayName").innerText = name;

  const seedBtns = document.querySelectorAll(".seed-btn");
  let collected = 0;

  seedBtns.forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      if(btn.disabled) return;
      btn.disabled = true;
      collected++;
      if(collected === 5){
        document.getElementById("finishSection").style.display="block";
        await fetch(SCRIPT_URL, {
          method:"POST",
          body: JSON.stringify({name:name, number:number, seeds:5})
        });
      }
    });
  });

  document.getElementById("backBtn").addEventListener("click", ()=>{
    window.location.href="index.html";
  });
}

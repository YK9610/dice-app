let currentDice = null;
let editId = null;

function rollDice() {
  const cube = document.getElementById("dice");
  const sound = document.getElementById("diceSound");

  const result = Math.floor(Math.random() * 6) + 1;
  currentDice = result;

  if (sound) sound.play();
  if (navigator.vibrate) navigator.vibrate(100);

  const randX = 360 * (Math.floor(Math.random() * 3) + 2);
  const randY = 360 * (Math.floor(Math.random() * 3) + 2);
  const randZ = 360 * (Math.floor(Math.random() * 3) + 2);

  let finalX = 0, finalY = 0;

  switch(result){
    case 2: finalY = -90; break;
    case 3: finalY = 180; break;
    case 4: finalY = 90; break;
    case 5: finalX = -90; break;
    case 6: finalX = 90; break;
  }

  cube.style.transform =
    `rotateX(${randX + finalX}deg)
     rotateY(${randY + finalY}deg)
     rotateZ(${randZ}deg)`;
}

function saveEntry() {
  const station = document.getElementById("station");
  const memo = document.getElementById("memo");

  if (!currentDice) {
    alert("サイコロ振って");
    return;
  }

  let data = JSON.parse(localStorage.getItem("diceTrip") || "[]");

  if (editId) {
    data = data.map(e =>
      e.id === editId
        ? { ...e, station: station.value, memo: memo.value, dice: currentDice }
        : e
    );
  } else {
    data.push({
      id: Date.now(),
      dice: currentDice,
      station: station.value,
      memo: memo.value
    });
  }

  localStorage.setItem("diceTrip", JSON.stringify(data));

  editId = null;

  station.value = "";
  memo.value = "";

  resetEditUI();
  updateDeleteBtn(false);

  loadHistory();
}

function loadHistory() {
  const history = document.getElementById("history");
  history.innerHTML = "";

  const data = JSON.parse(localStorage.getItem("diceTrip") || "[]");

  [...data].reverse().forEach(e => {
    const div = document.createElement("div");
    div.className = "entry";

    if (editId === e.id) {
      div.classList.add("editing");
    }

    div.innerHTML = `
      🎲 ${e.dice}<br>
      🚉 ${e.station}<br>
      📝 ${e.memo}<br>
      <button onclick="editEntry(${e.id})">編集</button>
    `;

    history.appendChild(div);
  });
}

function editEntry(id){
  const data = JSON.parse(localStorage.getItem("diceTrip") || "[]");
  const e = data.find(x => x.id === id);

  if (!e) return;

  editId = id;

  const station = document.getElementById("station");
  const memo = document.getElementById("memo");

  station.value = e.station;
  memo.value = e.memo;
  currentDice = e.dice;

  station.style.border = "2px solid orange";
  memo.style.border = "2px solid orange";

  station.placeholder = "編集中（駅名）";
  memo.placeholder = "編集中（寄った場所）";

  updateDeleteBtn(true);

  loadHistory();
}

function deleteEntry(){
  if (!editId) return;

  let data = JSON.parse(localStorage.getItem("diceTrip") || "[]");

  data = data.filter(e => e.id !== editId);

  localStorage.setItem("diceTrip", JSON.stringify(data));

  editId = null;

  document.getElementById("station").value = "";
  document.getElementById("memo").value = "";

  resetEditUI();
  updateDeleteBtn(false);

  loadHistory();
}

function resetEditUI(){
  const station = document.getElementById("station");
  const memo = document.getElementById("memo");

  station.style.border = "";
  memo.style.border = "";

  station.placeholder = "🚉 駅名";
  memo.placeholder = "📝 メモ";
}

function updateDeleteBtn(show){
  const btn = document.getElementById("deleteBtn");
  btn.style.display = show ? "block" : "none";
}

window.onload = () => {
  loadHistory();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
};

function checkSave(){
  const station = document.getElementById("station").value.trim();
  const memo = document.getElementById("memo").value.trim();

  const btn = document.getElementById("saveBtn");
  btn.disabled = !(station && memo);
}

window.onload = () => {
  loadHistory();

  document.getElementById("station").addEventListener("input", checkSave);
  document.getElementById("memo").addEventListener("input", checkSave);

  checkSave();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
};
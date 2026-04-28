let currentDice = null;

// 🎲 サイコロ
function rollDice() {
  const cube = document.getElementById("dice");

  const result = Math.floor(Math.random() * 6) + 1;
  currentDice = result;

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

// 💰 出目→金額
function getMoneyValue(dice){
  switch(dice){
    case 1: return 500;
    case 2: return 500;
    case 3: return 1000;
    case 4: return 1000;
    case 5: return 1500;
    case 6: return 2000;
  }
}

// 💰 確定（加算）
function confirmMoney(){
  if (!currentDice) return;

  let total = parseInt(localStorage.getItem("totalMoney") || "0");
  total += getMoneyValue(currentDice);

  localStorage.setItem("totalMoney", total);
  updateTotal();
}

// 💸 支出
function spendMoney(){
  const input = document.getElementById("spendInput");
  const memo = document.getElementById("spendMemo");

  let total = parseInt(localStorage.getItem("totalMoney") || "0");
  const spend = parseInt(input.value);

  if (!spend || spend <= 0) return;

  if (spend > total) {
    alert("お金足りない");
    return;
  }

  total -= spend;

  localStorage.setItem("totalMoney", total);

  addHistory(spend, memo.value || "支出");

  updateTotal();

  input.value = "";
  memo.value = "";
}

// 🧾 履歴追加
function addHistory(amount, memo){
  let history = JSON.parse(localStorage.getItem("moneyHistory") || "[]");

  history.push({
    id: Date.now(),
    amount,
    memo
  });

  localStorage.setItem("moneyHistory", JSON.stringify(history));

  loadHistory();
}

// 🧾 履歴表示
function loadHistory(){
  const container = document.getElementById("moneyHistory");
  container.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("moneyHistory") || "[]");

  [...history].reverse().forEach(h => {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <span style="color:red;">- ${h.amount}円</span><br>
      📝 ${h.memo}<br>
      <button onclick="deleteHistory(${h.id})">削除</button>
    `;

    container.appendChild(div);
  });
}

// 🗑 削除（＝お金戻す）
function deleteHistory(id){
  if (!confirm("削除する？")) return;

  let history = JSON.parse(localStorage.getItem("moneyHistory") || "[]");
  let total = parseInt(localStorage.getItem("totalMoney") || "0");

  const target = history.find(h => h.id === id);
  if (!target) return;

  total += target.amount;

  history = history.filter(h => h.id !== id);

  localStorage.setItem("moneyHistory", JSON.stringify(history));
  localStorage.setItem("totalMoney", total);

  updateTotal();
  loadHistory();
}

// 💰 合計更新
function updateTotal(){
  const total = localStorage.getItem("totalMoney") || 0;
  document.getElementById("total").textContent = total + "円";
}

// 🔄 初期化
function resetTotal(){
  localStorage.removeItem("totalMoney");
  localStorage.removeItem("moneyHistory");

  updateTotal();
  loadHistory();
}

// 🚀 起動時
window.onload = () => {
  updateTotal();
  loadHistory();
};

function checkSpend(){
  const amount = document.getElementById("spendInput").value.trim();
  const memo = document.getElementById("spendMemo").value.trim();

  const btn = document.getElementById("spendBtn");
  btn.disabled = !(amount && memo);
}

window.onload = () => {
  updateTotal();
  loadHistory();

  document.getElementById("spendInput").addEventListener("input", checkSpend);
  document.getElementById("spendMemo").addEventListener("input", checkSpend);

  checkSpend();
};
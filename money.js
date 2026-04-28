let currentValue = 0;

const values = {
  1: 500,
  2: 500,
  3: 1000,
  4: 1000,
  5: 1500,
  6: 2000
};

// 初期表示
window.onload = function () {
  const total = localStorage.getItem("moneyTotal") || 0;
  document.getElementById("total").textContent = total + "円";
};

function rollDice() {
  const cube = document.getElementById("dice");
  const sound = document.getElementById("diceSound");

  const result = Math.floor(Math.random() * 6) + 1;
  currentValue = values[result];

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
   `rotateX(${randX+finalX}deg)
    rotateY(${randY+finalY}deg)
    rotateZ(${randZ}deg)`;
}

function confirmMoney() {
  if (!currentValue) return;

  let total = Number(localStorage.getItem("moneyTotal") || 0);
  total += currentValue;

  localStorage.setItem("moneyTotal", total);

  document.getElementById("total").textContent = total + "円";
}

function resetTotal() {
  localStorage.removeItem("moneyTotal");
  document.getElementById("total").textContent = "0円";
  currentValue = 0;
}
// Load scores from localStorage
const sanaseikkailu = Number(localStorage.getItem("sanaseikkailuScore")) || 0;
const yhdista = Number(localStorage.getItem("yhdistaScore")) || 0;
const sanaluokkapeli = Number(localStorage.getItem("sanaluokkapeliScore")) || 0;
const sanaristikko = Number(localStorage.getItem("sanaristikkoScore")) || 0;
const muistipeli = Number(localStorage.getItem("muistipeliScore")) || 0;
const lajittelesanat = Number(localStorage.getItem("lajittelesanatScore")) || 0;

// Show scores on score page
document.getElementById("sanaseikkailu-score").textContent = sanaseikkailu;
document.getElementById("yhdista-score").textContent = yhdista;
document.getElementById("sanaluokkapeli-score").textContent = sanaluokkapeli;
document.getElementById("sanaristikko-score").textContent = sanaristikko;
document.getElementById("muistipeli-score").textContent = muistipeli;
document.getElementById("lajittelesanat-score").textContent = lajittelesanat;

// Calculate total
const total =
  sanaseikkailu +
  yhdista +
  sanaluokkapeli +
  sanaristikko +
  muistipeli +
  lajittelesanat;

document.getElementById("total-score").textContent = total;

// Reset button
document.getElementById("reset-btn").addEventListener("click", function () {
  localStorage.removeItem("sanaseikkailuScore");
  localStorage.removeItem("yhdistaScore");
  localStorage.removeItem("sanaluokkapeliScore");
  localStorage.removeItem("sanaristikkoScore");
  localStorage.removeItem("muistipeliScore");
  localStorage.removeItem("lajittelesanatScore");
  location.reload();
});
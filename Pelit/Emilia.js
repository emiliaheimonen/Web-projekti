const sanat = [
  { sana: "kissa", luokka: "substantiivi" },
  { sana: "auto", luokka: "substantiivi" },
  { sana: "juosta", luokka: "verbi" },
  { sana: "syödä", luokka: "verbi" },
  { sana: "punainen", luokka: "adjektiivi" },
  { sana: "iso", luokka: "adjektiivi" }
];

let pisteet = 0;
let nykyinen;


function uusiSana() {
  nykyinen = sanat[Math.floor(Math.random() * sanat.length)];
  document.getElementById("sana").textContent = nykyinen.sana;
}


document.querySelectorAll(".valinta").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.luokka === nykyinen.luokka) {
      pisteet++;
      document.getElementById("palaute").textContent = "Oikein!";
    } else {
      document.getElementById("palaute").textContent = "Väärin!";
    }

    document.getElementById("pisteet").textContent = "Pisteet: " + pisteet;
    uusiSana();
  });
});


uusiSana();
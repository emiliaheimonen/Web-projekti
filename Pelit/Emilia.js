const sanat = [
  { sana: "kissa", luokka: "substantiivi" },
  { sana: "auto", luokka: "substantiivi" },
  { sana: "juosta", luokka: "verbi" },
  { sana: "syödä", luokka: "verbi" },
  { sana: "punainen", luokka: "adjektiivi" },
  { sana: "iso", luokka: "adjektiivi" },
  { sana: "aurinko", luokka: "substantiivi" },
  { sana: "lentää", luokka: "verbi" },
  { sana: "aurinkoinen", luokka: "adjektiivi" },
  { sana: "lyijykynä", luokka: "substantiivi" }
];

let pisteet = 0;

let sekoitetutSanat = [...sanat].sort(() => Math.random() - 0.5);

let index = 0;
let nykyinen;

function uusiSana() {

  if (index >= sekoitetutSanat.length) {
    document.getElementById("sana").textContent = "Peli päättyi!";
    document.getElementById("palaute").textContent = "";
    return;
  }

  nykyinen = sekoitetutSanat[index];
  document.getElementById("sana").textContent = nykyinen.sana;
}


document.querySelectorAll(".valinta").forEach(btn => {
  btn.addEventListener("click", () => {

    if (index >= sekoitetutSanat.length) return; 

    if (btn.dataset.luokka === nykyinen.luokka) {
      pisteet++;
      document.getElementById("palaute").textContent = "Oikein!";
    } else {
      document.getElementById("palaute").textContent = "Väärin!";
    }

    document.getElementById("pisteet").textContent = "Pisteet: " + pisteet;

    index++;      
    uusiSana();  
  });
});


uusiSana();
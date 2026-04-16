const puzzles = [
  {
    title: "Ristikko 1 – Kesä ja arki",
    size: 11,
    words: [
      { number: 1, direction: "down", row: 1, col: 5, answer: "KESALOMA", clue: "Kesän vapaa-aika" },
      { number: 2, direction: "across", row: 1, col: 3, answer: "AIKA", clue: "Tunti tai hetki" },
      { number: 3, direction: "across", row: 2, col: 4, answer: "MERI", clue: "Iso vesialue" },
      { number: 4, direction: "across", row: 3, col: 3, answer: "KISSA", clue: "Lemmikki, joka naukuu" },
      { number: 5, direction: "across", row: 4, col: 4, answer: "SANA", clue: "Kielen pieni osa" },
      { number: 6, direction: "across", row: 5, col: 3, answer: "PILVI", clue: "Se näkyy taivaalla" },
      { number: 7, direction: "across", row: 6, col: 5, answer: "OMENA", clue: "Punainen tai vihreä hedelmä" },
      { number: 8, direction: "across", row: 7, col: 5, answer: "MAITO", clue: "Valkoinen juoma" },
      { number: 9, direction: "across", row: 8, col: 4, answer: "RANTA", clue: "Meren tai järven reuna" }
    ]
  },
  {
    title: "Ristikko 2 – Koulu",
    size: 11,
    words: [
      { number: 1, direction: "down", row: 1, col: 5, answer: "OPETTAJA", clue: "Hän opettaa koulussa" },
      { number: 2, direction: "across", row: 1, col: 4, answer: "KOTI", clue: "Paikka, jossa asut" },
      { number: 3, direction: "across", row: 2, col: 4, answer: "APINA", clue: "Eläin, joka kiipeilee" },
      { number: 4, direction: "across", row: 3, col: 4, answer: "VESI", clue: "Sitä juodaan" },
      { number: 5, direction: "across", row: 4, col: 3, answer: "AUTO", clue: "Ajoneuvo tiellä" },
      { number: 6, direction: "across", row: 5, col: 3, answer: "KATTO", clue: "Se on talon yläosassa" },
      { number: 7, direction: "across", row: 6, col: 4, answer: "SATAA", clue: "Mitä sade tekee" },
      { number: 8, direction: "across", row: 7, col: 5, answer: "JUNA", clue: "Kulkee raiteilla" },
      { number: 9, direction: "across", row: 8, col: 4, answer: "MAA", clue: "Suomi on yksi tällainen" }
    ]
  },
  {
    title: "Ristikko 3 – Ruoka ja koti",
    size: 11,
    words: [
      { number: 1, direction: "down", row: 1, col: 5, answer: "RUOKAILU", clue: "Aterian syöminen" },
      { number: 2, direction: "across", row: 1, col: 3, answer: "MERI", clue: "Sininen vesialue" },
      { number: 3, direction: "across", row: 2, col: 4, answer: "SUMU", clue: "Sitä on joskus aamulla" },
      { number: 4, direction: "across", row: 3, col: 4, answer: "KOTI", clue: "Paikka, jossa asutaan" },
      { number: 5, direction: "across", row: 4, col: 5, answer: "KUKKA", clue: "Kasvaa puutarhassa" },
      { number: 6, direction: "across", row: 5, col: 4, answer: "TALO", clue: "Rakennus, jossa voi asua" },
      { number: 7, direction: "across", row: 6, col: 4, answer: "PIHA", clue: "Alue talon ympärillä" },
      { number: 8, direction: "across", row: 7, col: 3, answer: "PILVI", clue: "Sateen merkki taivaalla" },
      { number: 9, direction: "across", row: 8, col: 5, answer: "UUNI", clue: "Siinä paistetaan ruokaa" }
    ]
  },
  {
    title: "Ristikko 4 – Yleissanat",
    size: 11,
    words: [
      { number: 1, direction: "down", row: 1, col: 5, answer: "KIRJASTO", clue: "Paikka, josta voi lainata kirjoja" },
      { number: 2, direction: "across", row: 1, col: 3, answer: "AIKA", clue: "Sekunnit ja minuutit" },
      { number: 3, direction: "across", row: 2, col: 4, answer: "PIHA", clue: "Talon ulkopuolinen alue" },
      { number: 4, direction: "across", row: 3, col: 3, answer: "MERI", clue: "Suolainen vesialue" },
      { number: 5, direction: "across", row: 4, col: 5, answer: "JUNA", clue: "Kulkee asemalta asemalle" },
      { number: 6, direction: "across", row: 5, col: 4, answer: "SANA", clue: "Kirjoitettu tai puhuttu yksikkö" },
      { number: 7, direction: "across", row: 6, col: 3, answer: "KISSA", clue: "Kotieläin, joka kehrää" },
      { number: 8, direction: "across", row: 7, col: 3, answer: "AUTO", clue: "Sillä ajetaan" },
      { number: 9, direction: "across", row: 8, col: 5, answer: "OMENA", clue: "Hedelmä puusta" }
    ]
  }
];

let currentPuzzleIndex = 0;
let currentPuzzle = null;
let solutionGrid = [];
let pisteet = 0;

function luoTyhjaRuudukko(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );
}

function rakennaRatkaisuGrid(puzzle) {
  const grid = luoTyhjaRuudukko(puzzle.size);

  puzzle.words.forEach(word => {
    for (let i = 0; i < word.answer.length; i++) {
      let row = word.row;
      let col = word.col;

      if (word.direction === "across") {
        col += i;
      } else {
        row += i;
      }

      if (!grid[row][col]) {
        grid[row][col] = {
          letter: word.answer[i],
          number: null
        };
      } else {
        grid[row][col].letter = word.answer[i];
      }
    }

    grid[word.row][word.col].number = word.number;
  });

  return grid;
}

function renderClues(puzzle) {
  const acrossContainer = document.getElementById("across-clues");
  const downContainer = document.getElementById("down-clues");

  acrossContainer.innerHTML = "";
  downContainer.innerHTML = "";

  const acrossWords = puzzle.words.filter(word => word.direction === "across");
  const downWords = puzzle.words.filter(word => word.direction === "down");

  acrossWords.forEach(word => {
    const clue = document.createElement("div");
    clue.className = "clue-item";
    clue.innerHTML = `<strong>${word.number}.</strong> ${word.clue}`;
    acrossContainer.appendChild(clue);
  });

  downWords.forEach(word => {
    const clue = document.createElement("div");
    clue.className = "clue-item";
    clue.innerHTML = `<strong>${word.number}.</strong> ${word.clue}`;
    downContainer.appendChild(clue);
  });
}

function piirraRuudukko() {
  const gridElement = document.getElementById("crossword-grid");
  const titleElement = document.getElementById("puzzle-title");

  currentPuzzle = puzzles[currentPuzzleIndex];
  solutionGrid = rakennaRatkaisuGrid(currentPuzzle);

  gridElement.innerHTML = "";
  titleElement.textContent = currentPuzzle.title;

  gridElement.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 46px)`;
  gridElement.style.gridTemplateRows = `repeat(${currentPuzzle.size}, 46px)`;

  for (let row = 0; row < currentPuzzle.size; row++) {
    for (let col = 0; col < currentPuzzle.size; col++) {
      const cell = document.createElement("div");
      cell.classList.add("ruutu");

      if (solutionGrid[row][col]) {
        cell.classList.add("valkoinen");

        const input = document.createElement("input");
        input.maxLength = 1;
        input.dataset.row = row;
        input.dataset.col = col;
        input.dataset.answer = solutionGrid[row][col].letter;

        input.addEventListener("input", (e) => {
          e.target.value = e.target.value.toUpperCase().replace(/[^A-ZÅÄÖ]/g, "");
        });

        if (solutionGrid[row][col].number) {
          const num = document.createElement("span");
          num.classList.add("ruutu-numero");
          num.textContent = solutionGrid[row][col].number;
          cell.appendChild(num);
        }

        cell.appendChild(input);
      }

      gridElement.appendChild(cell);
    }
  }

  renderClues(currentPuzzle);
  document.getElementById("palaute").textContent = "";
  document.getElementById("pisteet").textContent = "Pisteet: 0";
  pisteet = 0;
}

function tarkistaVastaukset() {
  const inputs = document.querySelectorAll(".ruutu input");
  let oikeinMaara = 0;
  let taytetyt = 0;

  inputs.forEach(input => {
    const userValue = input.value.trim().toUpperCase();
    const correctValue = input.dataset.answer.toUpperCase();

    input.parentElement.classList.remove("oikein", "vaarin");

    if (userValue !== "") {
      taytetyt++;
    }

    if (userValue === correctValue) {
      input.parentElement.classList.add("oikein");
      oikeinMaara++;
    } else if (userValue !== "") {
      input.parentElement.classList.add("vaarin");
    }
  });

  pisteet = oikeinMaara;
  document.getElementById("pisteet").textContent = "Pisteet: " + pisteet;

  if (taytetyt === 0) {
    document.getElementById("palaute").textContent = "Kirjoita ensin vastauksia.";
  } else if (oikeinMaara === inputs.length) {
    document.getElementById("palaute").textContent = "Hienoa! Kaikki oikein!";
  } else {
    document.getElementById("palaute").textContent = "Tarkistettu. Osa vastauksista on vielä väärin.";
  }
}

function naytaVastaukset() {
  const inputs = document.querySelectorAll(".ruutu input");

  inputs.forEach(input => {
    input.value = input.dataset.answer;
    input.parentElement.classList.remove("vaarin");
    input.parentElement.classList.add("oikein");
  });

  pisteet = inputs.length;
  document.getElementById("pisteet").textContent = "Pisteet: " + pisteet;
  document.getElementById("palaute").textContent = "Vastaukset näytetty.";
}

function tyhjennaRuudukko() {
  const inputs = document.querySelectorAll(".ruutu input");

  inputs.forEach(input => {
    input.value = "";
    input.parentElement.classList.remove("oikein", "vaarin");
  });

  pisteet = 0;
  document.getElementById("pisteet").textContent = "Pisteet: 0";
  document.getElementById("palaute").textContent = "";
}

function uusiPeli() {
  currentPuzzleIndex++;

  if (currentPuzzleIndex >= puzzles.length) {
    currentPuzzleIndex = 0;
  }

  piirraRuudukko();
}

document.getElementById("new-game-btn").addEventListener("click", uusiPeli);
document.getElementById("check-btn").addEventListener("click", tarkistaVastaukset);
document.getElementById("show-btn").addEventListener("click", naytaVastaukset);
document.getElementById("clear-btn").addEventListener("click", tyhjennaRuudukko);

piirraRuudukko();
const puzzles = [
  {
    title: "Ristikko 1",
    size: 10,
    words: [
      { number: 1, word: "KESÄ", clue: "Vuodenaika, jolloin on usein lämmintä", row: 1, col: 3, dir: "across" },
      { number: 2, word: "SÄÄ", clue: "Voi olla aurinkoinen tai sateinen", row: 1, col: 5, dir: "down" },
      { number: 3, word: "ÄITI", clue: "Vanhempi", row: 3, col: 2, dir: "across" },
      { number: 4, word: "TALO", clue: "Paikka, jossa voi asua", row: 0, col: 7, dir: "down" },
      { number: 5, word: "OMA", clue: "Ei toisen", row: 5, col: 3, dir: "across" },
      { number: 6, word: "KOIRA", clue: "Lemmikki, joka haukkuu", row: 5, col: 1, dir: "down" },
      { number: 7, word: "AAMU", clue: "Päivän alku", row: 7, col: 4, dir: "across" },
      { number: 8, word: "MUNA", clue: "Sitä voi syödä aamiaisella", row: 6, col: 8, dir: "down" }
    ]
  },
  {
    title: "Ristikko 2",
    size: 10,
    words: [
      { number: 1, word: "KALA", clue: "Eläin, joka elää vedessä", row: 1, col: 2, dir: "across" },
      { number: 2, word: "LAUKKU", clue: "Siinä voi kantaa tavaroita", row: 1, col: 4, dir: "down" },
      { number: 3, word: "KUKKA", clue: "Kasvi, joka voi olla maljakossa", row: 3, col: 0, dir: "across" },
      { number: 4, word: "AUTO", clue: "Sillä voi ajaa", row: 0, col: 7, dir: "down" },
      { number: 5, word: "TIE", clue: "Auto kulkee sitä pitkin", row: 5, col: 3, dir: "across" },
      { number: 6, word: "ILTA", clue: "Päivän loppupuoli", row: 4, col: 6, dir: "down" },
      { number: 7, word: "KIRJA", clue: "Siinä on sivuja", row: 7, col: 2, dir: "across" },
      { number: 8, word: "JUNA", clue: "Kulkee raiteilla", row: 6, col: 8, dir: "down" }
    ]
  },
  {
    title: "Ristikko 3",
    size: 10,
    words: [
      { number: 1, word: "KOULU", clue: "Paikka, jossa opiskellaan", row: 1, col: 2, dir: "across" },
      { number: 2, word: "ULOS", clue: "Ei sisälle", row: 1, col: 5, dir: "down" },
      { number: 3, word: "SANA", clue: "Kielen osa", row: 3, col: 4, dir: "across" },
      { number: 4, word: "AURINKO", clue: "Se näkyy taivaalla päivällä", row: 0, col: 7, dir: "down" },
      { number: 5, word: "KOTI", clue: "Paikka, jossa asutaan", row: 5, col: 2, dir: "across" },
      { number: 6, word: "ISÄ", clue: "Vanhempi", row: 5, col: 4, dir: "down" },
      { number: 7, word: "VESI", clue: "Sitä juodaan", row: 7, col: 3, dir: "across" },
      { number: 8, word: "SILTA", clue: "Sen kautta pääsee joen yli", row: 4, col: 9, dir: "down" }
    ]
  }
];

let currentPuzzleIndex = 0;
let currentPuzzle = puzzles[currentPuzzleIndex];
let score = 0;

const gridElement = document.getElementById("crossword-grid");
const titleElement = document.getElementById("puzzle-title");
const acrossCluesElement = document.getElementById("across-clues");
const downCluesElement = document.getElementById("down-clues");
const feedbackElement = document.getElementById("palaute");
const scoreElement = document.getElementById("pisteet");

const newGameButton = document.getElementById("new-game-btn");
const checkButton = document.getElementById("check-btn");
const showButton = document.getElementById("show-btn");
const clearButton = document.getElementById("clear-btn");

function createEmptyBoard(size) {
  const board = [];

  for (let row = 0; row < size; row++) {
    board[row] = [];

    for (let col = 0; col < size; col++) {
      board[row][col] = {
        letter: "",
        number: "",
        active: false
      };
    }
  }

  return board;
}

function placeWordsOnBoard(puzzle) {
  const board = createEmptyBoard(puzzle.size);

  puzzle.words.forEach((item) => {
    const letters = item.word.split("");

    letters.forEach((letter, index) => {
      const row = item.dir === "across" ? item.row : item.row + index;
      const col = item.dir === "across" ? item.col + index : item.col;

      board[row][col].letter = letter;
      board[row][col].active = true;

      if (index === 0) {
        board[row][col].number = item.number;
      }
    });
  });

  return board;
}

function renderPuzzle() {
  currentPuzzle = puzzles[currentPuzzleIndex];
  score = 0;

  const board = placeWordsOnBoard(currentPuzzle);

  gridElement.innerHTML = "";
  acrossCluesElement.innerHTML = "";
  downCluesElement.innerHTML = "";
  feedbackElement.textContent = "";
  titleElement.textContent = currentPuzzle.title;
  scoreElement.textContent = `Pisteet: ${score} / ${currentPuzzle.words.length}`;

  gridElement.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 42px)`;
  gridElement.style.gridTemplateRows = `repeat(${currentPuzzle.size}, 42px)`;

  for (let row = 0; row < currentPuzzle.size; row++) {
    for (let col = 0; col < currentPuzzle.size; col++) {
      const cellData = board[row][col];
      const cell = document.createElement("div");
      cell.classList.add("ruutu");

      if (cellData.active) {
        cell.classList.add("valkoinen");

        if (cellData.number) {
          const number = document.createElement("span");
          number.classList.add("ruutu-numero");
          number.textContent = cellData.number;
          cell.appendChild(number);
        }

        const input = document.createElement("input");
        input.maxLength = 1;
        input.dataset.answer = cellData.letter;
        input.dataset.row = row;
        input.dataset.col = col;

        input.addEventListener("input", () => {
          input.value = input.value.toUpperCase();
          cell.classList.remove("oikein", "vaarin");
          feedbackElement.textContent = "";

          const nextInput = findNextInput(row, col);
          if (input.value && nextInput) {
            nextInput.focus();
          }
        });

        cell.appendChild(input);
      }

      gridElement.appendChild(cell);
    }
  }

  renderClues();
}

function renderClues() {
  const acrossWords = currentPuzzle.words.filter((item) => item.dir === "across");
  const downWords = currentPuzzle.words.filter((item) => item.dir === "down");

  acrossWords.forEach((item) => {
    const clue = document.createElement("p");
    clue.classList.add("clue-item");
    clue.innerHTML = `<strong>${item.number}.</strong> ${item.clue}`;
    acrossCluesElement.appendChild(clue);
  });

  downWords.forEach((item) => {
    const clue = document.createElement("p");
    clue.classList.add("clue-item");
    clue.innerHTML = `<strong>${item.number}.</strong> ${item.clue}`;
    downCluesElement.appendChild(clue);
  });
}

function findNextInput(row, col) {
  const inputs = Array.from(gridElement.querySelectorAll("input"));

  return inputs.find((input) => {
    const inputRow = Number(input.dataset.row);
    const inputCol = Number(input.dataset.col);

    return inputRow > row || (inputRow === row && inputCol > col);
  });
}

function checkAnswers() {
  const inputs = gridElement.querySelectorAll("input");
  let correctLetters = 0;

  inputs.forEach((input) => {
    const parentCell = input.parentElement;
    const answer = input.dataset.answer;
    const value = input.value.toUpperCase();

    parentCell.classList.remove("oikein", "vaarin");

    if (value === answer) {
      parentCell.classList.add("oikein");
      correctLetters++;
    } else {
      parentCell.classList.add("vaarin");
    }
  });

  const totalLetters = inputs.length;
  const result = Math.round((correctLetters / totalLetters) * currentPuzzle.words.length);
  score = result;

  scoreElement.textContent = `Pisteet: ${score} / ${currentPuzzle.words.length}`;

  if (correctLetters === totalLetters) {
    feedbackElement.textContent = "Kaikki oikein!";
  } else {
    feedbackElement.textContent = "Tarkista vielä osa vastauksista.";
  }
}

function showAnswers() {
  const inputs = gridElement.querySelectorAll("input");

  inputs.forEach((input) => {
    input.value = input.dataset.answer;
    input.parentElement.classList.remove("vaarin");
    input.parentElement.classList.add("oikein");
  });

  score = currentPuzzle.words.length;
  scoreElement.textContent = `Pisteet: ${score} / ${currentPuzzle.words.length}`;
  feedbackElement.textContent = "Vastaukset näytetty.";
}

function clearPuzzle() {
  const inputs = gridElement.querySelectorAll("input");

  inputs.forEach((input) => {
    input.value = "";
    input.parentElement.classList.remove("oikein", "vaarin");
  });

  score = 0;
  scoreElement.textContent = `Pisteet: ${score} / ${currentPuzzle.words.length}`;
  feedbackElement.textContent = "";
}

function startNewGame() {
  currentPuzzleIndex++;

  if (currentPuzzleIndex >= puzzles.length) {
    currentPuzzleIndex = 0;
  }

  renderPuzzle();
}

newGameButton.addEventListener("click", startNewGame);
checkButton.addEventListener("click", checkAnswers);
showButton.addEventListener("click", showAnswers);
clearButton.addEventListener("click", clearPuzzle);

renderPuzzle();
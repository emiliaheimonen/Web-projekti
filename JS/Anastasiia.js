cat > JS/Anastasiia.js <<'EOF'
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "sanaristikkoScore";

  const puzzles = [
    {
      title: "Ristikko 1",
      size: 10,
      words: [
        { number: 1, word: "KOTI", clue: "Paikka, jossa asutaan", row: 0, col: 3, direction: "across" },
        { number: 2, word: "KALA", clue: "Eläin, joka elää vedessä", row: 0, col: 3, direction: "down" },
        { number: 3, word: "AUTO", clue: "Sillä voi ajaa", row: 1, col: 3, direction: "across" },
        { number: 4, word: "TALO", clue: "Rakennus, jossa voi asua", row: 1, col: 5, direction: "down" },
        { number: 5, word: "KALA", clue: "Elää vedessä", row: 3, col: 3, direction: "across" },
        { number: 6, word: "OMA", clue: "Ei toisen", row: 4, col: 5, direction: "down" },
        { number: 7, word: "AAMU", clue: "Päivän alku", row: 5, col: 3, direction: "across" }
      ]
    },
    {
      title: "Ristikko 2",
      size: 10,
      words: [
        { number: 1, word: "SANA", clue: "Kielen osa", row: 0, col: 2, direction: "across" },
        { number: 2, word: "AAMU", clue: "Päivän alku", row: 0, col: 3, direction: "down" },
        { number: 3, word: "LOMA", clue: "Vapaa-aika koulusta tai työstä", row: 2, col: 0, direction: "across" },
        { number: 4, word: "AUTO", clue: "Sillä voi ajaa", row: 2, col: 3, direction: "down" },
        { number: 5, word: "TIE", clue: "Auto kulkee sitä pitkin", row: 4, col: 3, direction: "across" },
        { number: 6, word: "KIRJA", clue: "Siinä on sivuja", row: 6, col: 2, direction: "across" },
        { number: 7, word: "JUNA", clue: "Kulkee raiteilla", row: 6, col: 5, direction: "down" },
        { number: 8, word: "ALA", clue: "Opiskelun tai työn alue", row: 9, col: 5, direction: "across" }
      ]
    }
  ];

  let currentPuzzleIndex = 0;
  let puzzle = puzzles[currentPuzzleIndex];
  let board = [];
  let activeDirection = "across";

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

  function createBoard(size) {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        letter: "",
        number: "",
        active: false
      }))
    );
  }

  function buildBoard() {
    board = createBoard(puzzle.size);

    puzzle.words.forEach((item) => {
      const word = item.word.toUpperCase();

      for (let i = 0; i < word.length; i++) {
        const row = item.direction === "down" ? item.row + i : item.row;
        const col = item.direction === "across" ? item.col + i : item.col;
        const letter = word[i];

        if (row >= puzzle.size || col >= puzzle.size) {
          return;
        }

        if (board[row][col].letter && board[row][col].letter !== letter) {
          return;
        }

        board[row][col].letter = letter;
        board[row][col].active = true;

        if (i === 0) {
          board[row][col].number = item.number;
        }
      }
    });
  }

  function renderPuzzle() {
    puzzle = puzzles[currentPuzzleIndex];
    buildBoard();

    gridElement.innerHTML = "";
    acrossCluesElement.innerHTML = "";
    downCluesElement.innerHTML = "";
    feedbackElement.textContent = "";

    titleElement.textContent = puzzle.title;
    scoreElement.textContent = `Pisteet: 0 / ${puzzle.words.length}`;

    gridElement.style.gridTemplateColumns = `repeat(${puzzle.size}, 40px)`;
    gridElement.style.gridTemplateRows = `repeat(${puzzle.size}, 40px)`;

    for (let row = 0; row < puzzle.size; row++) {
      for (let col = 0; col < puzzle.size; col++) {
        const cellData = board[row][col];
        const cell = document.createElement("div");
        cell.className = "ruutu";

        if (cellData.active) {
          cell.classList.add("valkoinen");

          if (cellData.number) {
            const number = document.createElement("span");
            number.className = "ruutu-numero";
            number.textContent = cellData.number;
            cell.appendChild(number);
          }

          const input = document.createElement("input");
          input.maxLength = 1;
          input.dataset.row = row;
          input.dataset.col = col;
          input.dataset.answer = cellData.letter;

          input.addEventListener("input", () => {
            input.value = input.value.toUpperCase().replace(/[^A-ZÅÄÖ]/g, "");
            cell.classList.remove("oikein", "vaarin");
            feedbackElement.textContent = "";

            if (input.value) {
              const nextInput = getNextInput(input);
              if (nextInput) nextInput.focus();
            }
          });

          input.addEventListener("keydown", (event) => handleKeys(event, input));
          cell.appendChild(input);
        }

        gridElement.appendChild(cell);
      }
    }

    renderClues();
  }

  function renderClues() {
    puzzle.words.forEach((item) => {
      const clue = document.createElement("p");
      clue.className = "clue-item";
      clue.innerHTML = `<strong>${item.number}.</strong> ${item.clue}`;

      if (item.direction === "across") {
        acrossCluesElement.appendChild(clue);
      } else {
        downCluesElement.appendChild(clue);
      }
    });
  }

  function getInput(row, col) {
    return gridElement.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
  }

  function getNextInput(input) {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    if (activeDirection === "down") {
      return getInput(row + 1, col);
    }

    return getInput(row, col + 1);
  }

  function getPreviousInput(input) {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    if (activeDirection === "down") {
      return getInput(row - 1, col);
    }

    return getInput(row, col - 1);
  }

  function handleKeys(event, input) {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    if (event.key === "ArrowRight") {
      event.preventDefault();
      activeDirection = "across";
      const next = getInput(row, col + 1);
      if (next) next.focus();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      activeDirection = "across";
      const previous = getInput(row, col - 1);
      if (previous) previous.focus();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeDirection = "down";
      const next = getInput(row + 1, col);
      if (next) next.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      activeDirection = "down";
      const previous = getInput(row - 1, col);
      if (previous) previous.focus();
    }

    if (event.key === "Backspace" && input.value === "") {
      const previous = getPreviousInput(input);
      if (previous) previous.focus();
    }
  }

  function isWordCorrect(item) {
    const word = item.word.toUpperCase();

    for (let i = 0; i < word.length; i++) {
      const row = item.direction === "down" ? item.row + i : item.row;
      const col = item.direction === "across" ? item.col + i : item.col;
      const input = getInput(row, col);

      if (!input || input.value.toUpperCase() !== word[i]) {
        return false;
      }
    }

    return true;
  }

  function markWord(item, isCorrect) {
    const word = item.word.toUpperCase();

    for (let i = 0; i < word.length; i++) {
      const row = item.direction === "down" ? item.row + i : item.row;
      const col = item.direction === "across" ? item.col + i : item.col;
      const input = getInput(row, col);

      if (input) {
        input.parentElement.classList.remove("oikein", "vaarin");
        input.parentElement.classList.add(isCorrect ? "oikein" : "vaarin");
      }
    }
  }

  function checkAnswers() {
    let correctWords = 0;

    puzzle.words.forEach((item) => {
      const correct = isWordCorrect(item);

      if (correct) {
        correctWords++;
      }

      markWord(item, correct);
    });

    scoreElement.textContent = `Pisteet: ${correctWords} / ${puzzle.words.length}`;

    if (correctWords === puzzle.words.length) {
      feedbackElement.textContent = "Kaikki oikein!";
    } else {
      feedbackElement.textContent = "Tarkista vielä vastaukset.";
    }

    saveScore(correctWords);
  }

  function showAnswers() {
    const inputs = gridElement.querySelectorAll("input");

    inputs.forEach((input) => {
      input.value = input.dataset.answer;
      input.parentElement.classList.remove("vaarin");
      input.parentElement.classList.add("oikein");
    });

    feedbackElement.textContent = "Vastaukset näytetty.";
  }

  function clearPuzzle() {
    const inputs = gridElement.querySelectorAll("input");

    inputs.forEach((input) => {
      input.value = "";
      input.parentElement.classList.remove("oikein", "vaarin");
    });

    scoreElement.textContent = `Pisteet: 0 / ${puzzle.words.length}`;
    feedbackElement.textContent = "";
  }

  function saveScore(score) {
    const oldScore = Number(localStorage.getItem(STORAGE_KEY)) || 0;
    const bestScore = Math.max(oldScore, score);

    localStorage.setItem(STORAGE_KEY, bestScore);
    localStorage.setItem("sanaristikko-score", bestScore);
    localStorage.setItem("sanaristikko", bestScore);
  }

  newGameButton.addEventListener("click", () => {
    currentPuzzleIndex++;

    if (currentPuzzleIndex >= puzzles.length) {
      currentPuzzleIndex = 0;
    }

    renderPuzzle();
  });

  checkButton.addEventListener("click", checkAnswers);
  showButton.addEventListener("click", showAnswers);
  clearButton.addEventListener("click", clearPuzzle);

  renderPuzzle();
});
EOF
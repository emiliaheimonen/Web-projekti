document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "sanaristikkoScore";

  const puzzles = [
    {
      title: "Ristikko 1",
      size: 10,
      words: [
        { number: 1, word: "KESÄ", clue: "Lämmin vuodenaika", row: 1, col: 2, direction: "across" },
        { number: 2, word: "KOTI", clue: "Paikka, jossa asutaan", row: 1, col: 2, direction: "down" },
        { number: 3, word: "TALO", clue: "Rakennus, jossa voi asua", row: 3, col: 2, direction: "across" },
        { number: 4, word: "LOMA", clue: "Vapaa-aika koulusta tai työstä", row: 3, col: 4, direction: "down" },
        { number: 5, word: "OMA", clue: "Ei toisen", row: 4, col: 4, direction: "across" },
        { number: 6, word: "AAMU", clue: "Päivän alku", row: 6, col: 4, direction: "across" },
        { number: 7, word: "MUKI", clue: "Siitä voi juoda", row: 6, col: 6, direction: "down" },
        { number: 8, word: "KALA", clue: "Eläin, joka elää vedessä", row: 8, col: 6, direction: "across" }
      ]
    },
    {
      title: "Ristikko 2",
      size: 10,
      words: [
        { number: 1, word: "KOULU", clue: "Paikka, jossa opiskellaan", row: 1, col: 2, direction: "across" },
        { number: 2, word: "ULOS", clue: "Ei sisälle", row: 1, col: 4, direction: "down" },
        { number: 3, word: "LOMA", clue: "Vapaa-aika koulusta", row: 2, col: 4, direction: "across" },
        { number: 4, word: "AUTO", clue: "Sillä voi ajaa", row: 2, col: 7, direction: "down" },
        { number: 5, word: "SIVU", clue: "Kirjassa on monta tällaista", row: 3, col: 1, direction: "across" },
        { number: 6, word: "SATO", clue: "Pellolta saadaan tämä", row: 4, col: 4, direction: "across" },
        { number: 7, word: "TIE", clue: "Auto kulkee sitä pitkin", row: 4, col: 6, direction: "down" }
      ]
    },
    {
      title: "Ristikko 3",
      size: 11,
      words: [
        { number: 1, word: "KIRJA", clue: "Siinä on sivuja", row: 1, col: 2, direction: "across" },
        { number: 2, word: "ILTA", clue: "Päivän loppupuoli", row: 1, col: 3, direction: "down" },
        { number: 3, word: "TALO", clue: "Rakennus, jossa voi asua", row: 3, col: 3, direction: "across" },
        { number: 4, word: "AAMU", clue: "Päivän alku", row: 3, col: 4, direction: "down" },
        { number: 5, word: "MAITO", clue: "Valkoinen juoma", row: 5, col: 4, direction: "across" },
        { number: 6, word: "OMA", clue: "Ei toisen", row: 5, col: 8, direction: "down" },
        { number: 7, word: "SANA", clue: "Kielen osa", row: 7, col: 5, direction: "across" },
        { number: 8, word: "NENÄ", clue: "Se on kasvoissa", row: 7, col: 7, direction: "down" }
      ]
    }
  ];

  let currentPuzzleIndex = 0;
  let currentPuzzle = puzzles[currentPuzzleIndex];
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

  function createEmptyBoard(size) {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        letter: "",
        number: "",
        active: false,
        words: []
      }))
    );
  }

  function validatePuzzle(puzzle) {
    puzzle.words.forEach((item) => {
      const cleanWord = item.word.toUpperCase();
      const endRow = item.direction === "down" ? item.row + cleanWord.length - 1 : item.row;
      const endCol = item.direction === "across" ? item.col + cleanWord.length - 1 : item.col;

      if (item.row < 0 || item.col < 0 || endRow >= puzzle.size || endCol >= puzzle.size) {
        throw new Error(`Sana "${item.word}" ei mahdu ruudukkoon.`);
      }
    });
  }

  function buildBoard(puzzle) {
    validatePuzzle(puzzle);

    const newBoard = createEmptyBoard(puzzle.size);

    puzzle.words.forEach((item) => {
      const cleanWord = item.word.toUpperCase();

      for (let i = 0; i < cleanWord.length; i++) {
        const row = item.direction === "down" ? item.row + i : item.row;
        const col = item.direction === "across" ? item.col + i : item.col;
        const letter = cleanWord[i];

        if (newBoard[row][col].letter && newBoard[row][col].letter !== letter) {
          throw new Error(`Ristikossa on kirjainristiriita sanassa "${item.word}".`);
        }

        newBoard[row][col].letter = letter;
        newBoard[row][col].active = true;
        newBoard[row][col].words.push(item.number);

        if (i === 0) {
          newBoard[row][col].number = item.number;
        }
      }
    });

    return newBoard;
  }

  function renderPuzzle() {
    currentPuzzle = puzzles[currentPuzzleIndex];
    board = buildBoard(currentPuzzle);

    gridElement.innerHTML = "";
    acrossCluesElement.innerHTML = "";
    downCluesElement.innerHTML = "";
    feedbackElement.textContent = "";

    titleElement.textContent = currentPuzzle.title;
    scoreElement.textContent = `Pisteet: 0 / ${currentPuzzle.words.length}`;

    gridElement.style.gridTemplateColumns = `repeat(${currentPuzzle.size}, 42px)`;
    gridElement.style.gridTemplateRows = `repeat(${currentPuzzle.size}, 42px)`;

    for (let row = 0; row < currentPuzzle.size; row++) {
      for (let col = 0; col < currentPuzzle.size; col++) {
        const cellData = board[row][col];
        const cell = document.createElement("div");
        cell.className = "ruutu";

        if (cellData.active) {
          cell.classList.add("valkoinen");

          if (cellData.number) {
            const numberElement = document.createElement("span");
            numberElement.className = "ruutu-numero";
            numberElement.textContent = cellData.number;
            cell.appendChild(numberElement);
          }

          const input = document.createElement("input");
          input.maxLength = 1;
          input.dataset.row = row;
          input.dataset.col = col;
          input.dataset.answer = cellData.letter;

          input.addEventListener("input", () => handleInput(input));
          input.addEventListener("keydown", (event) => handleKeydown(event, input));
          input.addEventListener("focus", () => {
            cell.classList.remove("oikein", "vaarin");
          });

          cell.appendChild(input);
        }

        gridElement.appendChild(cell);
      }
    }

    renderClues();
  }

  function renderClues() {
    const acrossWords = currentPuzzle.words.filter((item) => item.direction === "across");
    const downWords = currentPuzzle.words.filter((item) => item.direction === "down");

    acrossWords.forEach((item) => {
      const clue = document.createElement("p");
      clue.className = "clue-item";
      clue.innerHTML = `<strong>${item.number}.</strong> ${item.clue}`;
      acrossCluesElement.appendChild(clue);
    });

    downWords.forEach((item) => {
      const clue = document.createElement("p");
      clue.className = "clue-item";
      clue.innerHTML = `<strong>${item.number}.</strong> ${item.clue}`;
      downCluesElement.appendChild(clue);
    });
  }

  function handleInput(input) {
    input.value = input.value.toUpperCase().replace(/[^A-ZÅÄÖ]/g, "");

    const cell = input.parentElement;
    cell.classList.remove("oikein", "vaarin");
    feedbackElement.textContent = "";

    if (input.value) {
      const nextInput = getNextInput(input, activeDirection);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  function handleKeydown(event, input) {
    const key = event.key;

    if (key === "ArrowRight") {
      event.preventDefault();
      activeDirection = "across";
      focusInput(input, 0, 1);
    }

    if (key === "ArrowLeft") {
      event.preventDefault();
      activeDirection = "across";
      focusInput(input, 0, -1);
    }

    if (key === "ArrowDown") {
      event.preventDefault();
      activeDirection = "down";
      focusInput(input, 1, 0);
    }

    if (key === "ArrowUp") {
      event.preventDefault();
      activeDirection = "down";
      focusInput(input, -1, 0);
    }

    if (key === "Backspace" && input.value === "") {
      const previousInput = getPreviousInput(input, activeDirection);
      if (previousInput) {
        previousInput.focus();
      }
    }
  }

  function getInput(row, col) {
    return gridElement.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
  }

  function focusInput(input, rowChange, colChange) {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    const next = getInput(row + rowChange, col + colChange);

    if (next) {
      next.focus();
    }
  }

  function getNextInput(input, direction) {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    if (direction === "down") {
      return getInput(row + 1, col);
    }

    return getInput(row, col + 1);
  }

  function getPreviousInput(input, direction) {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);

    if (direction === "down") {
      return getInput(row - 1, col);
    }

    return getInput(row, col - 1);
  }

  function isWordCorrect(wordItem) {
    const cleanWord = wordItem.word.toUpperCase();

    for (let i = 0; i < cleanWord.length; i++) {
      const row = wordItem.direction === "down" ? wordItem.row + i : wordItem.row;
      const col = wordItem.direction === "across" ? wordItem.col + i : wordItem.col;
      const input = getInput(row, col);

      if (!input || input.value.toUpperCase() !== cleanWord[i]) {
        return false;
      }
    }

    return true;
  }

  function markWord(wordItem, isCorrect) {
    const cleanWord = wordItem.word.toUpperCase();

    for (let i = 0; i < cleanWord.length; i++) {
      const row = wordItem.direction === "down" ? wordItem.row + i : wordItem.row;
      const col = wordItem.direction === "across" ? wordItem.col + i : wordItem.col;
      const input = getInput(row, col);

      if (input) {
        input.parentElement.classList.remove("oikein", "vaarin");
        input.parentElement.classList.add(isCorrect ? "oikein" : "vaarin");
      }
    }
  }

  function checkAnswers() {
    let correctWords = 0;
    let filledLetters = 0;
    const inputs = gridElement.querySelectorAll("input");

    inputs.forEach((input) => {
      if (input.value.trim() !== "") {
        filledLetters++;
      }
      input.parentElement.classList.remove("oikein", "vaarin");
    });

    if (filledLetters === 0) {
      feedbackElement.textContent = "Kirjoita ensin vastauksia.";
      scoreElement.textContent = `Pisteet: 0 / ${currentPuzzle.words.length}`;
      return;
    }

    currentPuzzle.words.forEach((wordItem) => {
      const correct = isWordCorrect(wordItem);

      if (correct) {
        correctWords++;
      }

      markWord(wordItem, correct);
    });

    scoreElement.textContent = `Pisteet: ${correctWords} / ${currentPuzzle.words.length}`;
    saveScore(correctWords);

    if (correctWords === currentPuzzle.words.length) {
      feedbackElement.textContent = "Kaikki oikein!";
    } else {
      feedbackElement.textContent = "Tarkista vielä vastaukset.";
    }
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

    feedbackElement.textContent = "";
    scoreElement.textContent = `Pisteet: 0 / ${currentPuzzle.words.length}`;
  }

  function startNewGame() {
    currentPuzzleIndex++;

    if (currentPuzzleIndex >= puzzles.length) {
      currentPuzzleIndex = 0;
    }

    renderPuzzle();
  }

  function saveScore(score) {
    const oldScore = Number(localStorage.getItem(STORAGE_KEY)) || 0;
    const bestScore = Math.max(oldScore, score);

    localStorage.setItem(STORAGE_KEY, bestScore);

    localStorage.setItem("sanaristikko-score", bestScore);
    localStorage.setItem("sanaristikko", bestScore);
  }

  newGameButton.addEventListener("click", startNewGame);
  checkButton.addEventListener("click", checkAnswers);
  showButton.addEventListener("click", showAnswers);
  clearButton.addEventListener("click", clearPuzzle);

  renderPuzzle();
});
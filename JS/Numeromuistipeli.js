const gridContainer = document.querySelector(".grid-container");
let allCards = [];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let matchedPairs = 0;
let wrongGuesses = 0;
let currentLevel = "hard";

document.querySelector(".score").textContent = score;

fetch("../JSON/NumeromuistipeliDATA.json")
    .then((res) => res.json())
    .then((data) => {
        allCards = data;
        startGame();
    });

function startGame() {
    const difficultySelect = document.getElementById("difficulty");
    currentLevel = difficultySelect ? difficultySelect.value : "hard";

    resetGameState();
    cards = getCardsByLevel(currentLevel);
    shuffleCards();

    gridContainer.classList.remove("grid-easy", "grid-medium", "grid-hard");
    gridContainer.classList.add(`grid-${currentLevel}`);

    generateCards();

    if (currentLevel === "hard") {
        showCardsAtStart();
    }
}

function getCardsByLevel(level) {
    if (level === "easy") {
        return allCards.filter(card => ["1", "2", "3", "4"].includes(card.name));
    }
    if (level === "medium") {
        return allCards.filter(card => ["5", "6", "7", "8", "9"].includes(card.name));
    }

    return [...allCards];
}

function resetGameState() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    score = 0;
    matchedPairs = 0;
    wrongGuesses = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";

    const panel = document.getElementById("result-panel");
    if (panel) {
        panel.classList.remove("visible");
    }
}

function shuffleCards() {
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    gridContainer.innerHTML = "";

    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <p>${card.text}</p>
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function showCardsAtStart() {
    const allCardElements = document.querySelectorAll(".card");
    lockBoard = true;
    allCardElements.forEach(card => card.classList.add("flipped"));

    setTimeout(() => {
        allCardElements.forEach(card => card.classList.remove("flipped"));
        lockBoard = false;
    }, 2500);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        score++;
        matchedPairs++;
        document.querySelector(".score").textContent = score;
        const totalPairs = cards.length / 2;

        if (matchedPairs == totalPairs) {
            showResult(score);
        }
        disableCards();
    } else {
        handleWrongGuess();
        unflipCards();
    }
}    

function handleWrongGuess() {
    if (currentLevel === "easy") {
        return;
    }

    if (currentLevel === "medium") {
        wrongGuesses++;

        if (wrongGuesses % 2 === 0 && score > 0) {
            score--;
            document.querySelector(".score").textContent = score;
        }
        return;
    }

    if (currentLevel === "hard") {
        if (score > 0) {
            score--;
            document.querySelector(".score").textContent = score;
        }
    }
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function showResult(score) {
    const panel = document.getElementById("result-panel");
    const msgEl = document.getElementById("result-message");
    const totalPairs = cards.length / 2;

    const finalScore = Math.floor((score / totalPairs) * 10);

    if (score === totalPairs) {
        msgEl.textContent = "Löysit kaikki parit, hienoa!";
    } else if (score < Math.ceil(totalPairs / 2)) {
        msgEl.textContent = "Jatka harjoittelua pelaamalla uudestaan!";
    } else {
        msgEl.textContent = "Hienosti pelattu!";
    }

    panel.classList.add("visible");
}

function restart() {
    startGame();
}

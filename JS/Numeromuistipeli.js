const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let matchedPairs = 0;

document.querySelector(".score").textContent = score;

fetch("../JSON/NumeromuistipeliDATA.json")
    .then((res) => res.json())
    .then((data) => {
        cards = data;
        shuffleCards();
        generateCards();
    });

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
        if (score > 0) {
            score--;
        }
        document.querySelector(".score").textContent = score;
        unflipCards();
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

function showResult(score, totalPairs) {
    const panel = document.getElementById("result-panel");
    const msgEl = document.getElementById("result-message");

    if (score === 10) {
        msgEl.textContent = "Löysit kaikki parit, hienoa!";
    } else if (score < 5) {
        msgEl.textContent = "Voi ei, yritä uudelleen!";
    } else {
        msgEl.textContent = "Hienosti, olit lähellä!";
    }

    panel.classList.add("visible");
}

function restart () {
    resetBoard();
    shuffleCards();
    score = 0;
    matchedPairs = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";

    const panel = document.getElementById("result-panel");
    if (panel) {
        panel.classList.remove("visible")
    }
    generateCards();
}

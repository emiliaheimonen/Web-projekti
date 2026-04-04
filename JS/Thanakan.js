const cards = [
  { en: "school", fi: "koulu", img: "../Kuvat/Thanakan_kuvat/school.jpg" },
  { en: "hospital", fi: "sairaala", img: "../Kuvat/Thanakan_kuvat/hospital.PNG" },
  { en: "book", fi: "kirja", img: "../Kuvat/Thanakan_kuvat/book.PNG" },
  { en: "cheese", fi: "juusto", img: "../Kuvat/Thanakan_kuvat/cheese.jpg" },
  { en: "computer", fi: "tietokone", img: "../Kuvat/Thanakan_kuvat/computer.jpg" },
  { en: "Good morning", fi: "Hyvää huomenta", img: "../Kuvat/Thanakan_kuvat/good morning.jpg" },
  { en: "How are you?", fi: "Mitä kuuluu?", img: "../Kuvat/Thanakan_kuvat/how are you.jpg" },
  { en: "Where do you live?", fi: "Missä asut?", img: "../Kuvat/Thanakan_kuvat/where do you live.png" },
  { en: "Where are you from?", fi: "Mistä olet kotoisin?", img: "../Kuvat/Thanakan_kuvat/where are you from.jpg" },
  { en: "Where are you going?", fi: "Minne olet menossa?", img: "../Kuvat/Thanakan_kuvat/where are you going.png" }
];

let currentIndex = 0;
let score = 0;
let answered = false;
let isAnimating = false;

const englishWord = document.getElementById("englishWord");
const finnishWord = document.getElementById("finnishWord");
const cardImage = document.getElementById("cardImage");
const answerInput = document.getElementById("answerInput");
const message = document.getElementById("message");
const scoreDisplay = document.getElementById("score");
const flipCard = document.getElementById("flipCard");
const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");

function showCard() {
  const card = cards[currentIndex];

  englishWord.textContent = card.en;
  finnishWord.textContent = card.fi;

  cardImage.src = card.img;
  cardImage.alt = card.en;
  cardImage.style.display = "block";

  answerInput.value = "";
  answerInput.style.display = "block";

  message.textContent = "";
  message.className = "message";

  answered = false;
}

function normalize(text) {
  return text.trim().toLowerCase();
}

function checkAnswer() {
  if (answered || isAnimating) return;

  const userAnswer = normalize(answerInput.value);
  const correctAnswer = normalize(cards[currentIndex].fi);

  if (userAnswer === correctAnswer) {
    score++;
    scoreDisplay.textContent = score;
    message.textContent = "Correct!";
    message.className = "message correct";
  } else {
    message.textContent = "Wrong! See the correct answer on the card.";
    message.className = "message wrong";
  }

  flipCard.classList.add("flipped");
  answered = true;
}

function nextCard() {
  if (isAnimating || !answered) return;

  isAnimating = true;
  flipCard.classList.remove("flipped");

  setTimeout(() => {
    currentIndex++;

    if (currentIndex >= cards.length) {
      englishWord.textContent = "";
      finnishWord.innerHTML = `Final score:<br>${score}/${cards.length}`;

      cardImage.style.display = "none";
      answerInput.style.display = "none";
      message.textContent = "";
      message.className = "message";

      flipCard.classList.add("flipped");

      checkBtn.textContent = "Play Again";
      nextBtn.textContent = "Done!";

      checkBtn.onclick = restartGame;
      nextBtn.onclick = nextGame;

      isAnimating = false;
      return;
    }

    showCard();
    isAnimating = false;
  }, 700);
}

function restartGame() {
  currentIndex = 0;
  score = 0;
  answered = false;
  isAnimating = false;

  scoreDisplay.textContent = score;

  cardImage.style.display = "block";
  answerInput.style.display = "block";

  checkBtn.textContent = "Check";
  nextBtn.textContent = "Next";

  checkBtn.onclick = checkAnswer;
  nextBtn.onclick = nextCard;

  flipCard.classList.remove("flipped");
  showCard();
}

function nextGame() {
  window.location.href = "../HTML/pisteet.html";
}

answerInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (!answered) {
      checkAnswer();
    } else {
      nextCard();
    }
  }
});


showCard();
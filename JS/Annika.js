const questions = [
  {
    question: "Missä on omena?",
    answers: [
      { image: "../Kuvat/Annika_kuvat/omena1.jpg", correct: true },
      { image: "../Kuvat/Annika_kuvat/appelsiini1.jpg", correct: false },
      { image: "../Kuvat/Annika_kuvat/banaani1.jpg", correct: false }
    ]
  }, 
  {
    question: "Missä on kissa?",
    answers: [
      { image: "../Kuvat/Annika_kuvat/koira1.jpg", correct: false },
      { image: "../Kuvat/Annika_kuvat/kala.jpg", correct: false },
      { image: "../Kuvat/Annika_kuvat/cat.jpg", correct: true }
    ]
  }, 
  {
    question: "Missä on violetti kukka?",
    answers: [
      { image: "../Kuvat/Annika_kuvat/punainen.jpg", correct: false },
      { image: "../Kuvat/Annika_kuvat/pinkki.jpg", correct: false },
      { image: "../Kuvat/Annika_kuvat/violetti.jpg", correct: true }
    ]
  } 
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");

function showQuestion() {
  resultEl.textContent = "";
  nextBtn.style.display = "none";
  answersEl.innerHTML = "";

  const q = questions[currentQuestion];
  questionEl.textContent = q.question;

  q.answers.forEach(answer => {
    const button = document.createElement("button");
    button.classList.add("image-button");

    const img = document.createElement("img");
    img.src = answer.image;
    img.alt = "vastauskuva";

    button.appendChild(img);

    button.onclick = () => checkAnswer(answer, button);

    answersEl.appendChild(button);
  });
}

function checkAnswer(answer, clickedButton) {
  const buttons = answersEl.querySelectorAll(".image-button");
  const currentAnswers = questions[currentQuestion].answers;

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (currentAnswers[index].correct) {
      button.classList.add("correct");
    }
  });

  if (answer.correct) {
    resultEl.textContent = "Hienoa! Oikein!";
    score++;
  } else {
    clickedButton.classList.add("wrong");
    resultEl.textContent = "Väärin!";
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    questionEl.textContent = "Peli loppui!";
    answersEl.innerHTML = "";
    resultEl.textContent = `Sait ${score} / ${questions.length} oikein.`;
    nextBtn.style.display = "none";
  }
});

showQuestion();

// pisteiden tallennus
setInterval(() => {
  const text = resultEl?.textContent;
  const match = text?.match(/\d+/);
  const number = match ? parseInt(match[0]) : NaN;

  if (!isNaN(number)) {
    localStorage.setItem("yhdistaScore", number);
  }
}, 500);

const VOCABULARY = {
  "eläimet": [
    "koira", "kissa", "hevonen", "lehmä", "sika",
    "lammas", "kana", "ankka", "sammakko", "karhu",
    "susi", "kettu", "jänis", "hirvi", "orava"
  ],
  "hedelmät": [
    "omena", "banaani", "appelsiini", "mansikka", "vadelma",
    "päärynä", "kirsikka", "viinimarja", "vesimeloni", "mango",
    "ananas", "luumu", "persikka", "greippi", "lime"
  ],
  "värit": [
    "punainen", "sininen", "vihreä", "keltainen", "oranssi",
    "violetti", "ruskea", "harmaa", "valkoinen", "musta",
    "pinkki", "turkoosi", "beige", "hopea", "kulta"
  ],
  "ajoneuvot": [
    "auto", "bussi", "juna", "laiva", "lentokone",
    "polkupyörä", "moottoripyörä", "taksi", "rekka", "helikopteri",
    "metro", "raitiovaunu", "pakettiauto", "traktori", "vene"
  ],
  "huonekalut": [
    "tuoli", "pöytä", "sänky", "sohva", "kaappi",
    "hylly", "lipasto", "nojatuoli", "penkki", "kirjahylly"
  ],
  "ruoka": [
    "leipä", "juusto", "muna", "maito", "peruna",
    "riisi", "pasta", "keitto", "pizza", "hampurilainen",
    "salaatti", "jogurtti", "keksi", "suklaata", "kakku"
  ]
};

const WORDS_PER_CATEGORY = 5;


let totalWords = 0;
let gameActive = false;

let roundCategories = [];



function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom(array, n) {
  return shuffle(array).slice(0, n);
}

function pickRandomCategories(count) {
  const keys = Object.keys(VOCABULARY);
  return pickRandom(keys, count);
}


function buildDropZones() {
  const container = document.getElementById("drop-zones");
  container.innerHTML = "";

  roundCategories.forEach((cat, index) => {
    const zone = document.createElement("div");
    zone.classList.add("drop-zone");
    zone.id = "zone-" + index;
    zone.dataset.category = cat.label;

    const label = document.createElement("div");
    label.classList.add("drop-zone-label");
    label.textContent = cat.label;

    zone.appendChild(label);

    zone.addEventListener("dragover", onDragOver);
    zone.addEventListener("dragleave", onDragLeave);
    zone.addEventListener("drop", onDrop);

    container.appendChild(zone);
  });
}

function buildWordCards() {
  const pool = document.getElementById("word-pool");
  pool.innerHTML = "";

  let allWords = [];
  roundCategories.forEach(cat => {
    cat.words.forEach(word => {
      allWords.push({ word, category: cat.label });
    });
  });
  allWords = shuffle(allWords);

  totalWords = allWords.length;

  allWords.forEach(item => {
    const card = createWordCard(item.word, item.category);
    pool.appendChild(card);
  });
}

function createWordCard(word, category) {
  const card = document.createElement("div");
  card.classList.add("word-card");
  card.textContent = word;
  card.draggable = true;
  card.dataset.word = word;
  card.dataset.category = category;
  card.id = "card-" + word.replace(/\s+/g, "-");

  card.addEventListener("dragstart", onDragStart);
  card.addEventListener("dragend", onDragEnd);

  return card;
}


let draggedCard = null;

function onDragStart(event) {
  if (!gameActive) { event.preventDefault(); return; }

  draggedCard = event.currentTarget;
  draggedCard.classList.add("dragging");

  event.dataTransfer.setData("text/plain", draggedCard.id);
  event.dataTransfer.effectAllowed = "move";
}

function onDragEnd(event) {
  if (draggedCard) {
    draggedCard.classList.remove("dragging");
    draggedCard = null;
  }
}

function onDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  event.currentTarget.classList.add("drag-over");
}

function onDragLeave(event) {
  event.currentTarget.classList.remove("drag-over");
}


function onDropPool(event) {
  event.preventDefault();
  const pool = document.getElementById("word-pool");
  pool.classList.remove("drag-over");

  if (!gameActive) return;

  const cardId = event.dataTransfer.getData("text/plain");
  const card = document.getElementById(cardId);
  if (!card) return;

  pool.appendChild(card);
  updateCheckButton();
}

function onDropPoolOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  document.getElementById("word-pool").classList.add("drag-over");
}

function onDropPoolLeave(event) {
  document.getElementById("word-pool").classList.remove("drag-over");
}

function onDrop(event) {
  event.preventDefault();
  const zone = event.currentTarget;
  zone.classList.remove("drag-over");

  if (!gameActive) return;

  const cardId = event.dataTransfer.getData("text/plain");
  const card = document.getElementById(cardId);
  if (!card) return;

  
  zone.appendChild(card);

  updateCheckButton();
}


function updateCheckButton() {
  const pool = document.getElementById("word-pool");
  const cardsInPool = pool.querySelectorAll(".word-card").length;
  const btn = document.getElementById("check-btn");

  if (cardsInPool === 0) {
    btn.disabled = false;
    btn.classList.add("ready");
  } else {
    btn.disabled = true;
    btn.classList.remove("ready");
  }
}



function checkAnswers() {
  if (!gameActive) return;
  gameActive = false;

  
  document.querySelectorAll(".word-card").forEach(card => {
    card.draggable = false;
    card.classList.add("locked");
  });

  let score = 0;


  document.querySelectorAll(".drop-zone").forEach(zone => {
    const zoneCategory = zone.dataset.category;
    zone.querySelectorAll(".word-card").forEach(card => {
      if (card.dataset.category === zoneCategory) {
        card.classList.add("correct");
        score++;
      } else {
        card.classList.add("wrong-final");
      }
    });
  });

  
  const panel = document.getElementById("result-panel");
  const scoreEl = document.getElementById("result-score");
  const msgEl = document.getElementById("result-message");

  scoreEl.textContent = score + " / " + totalWords;

  if (score === totalWords) {
    msgEl.textContent = "Loistavaa! Kaikki oikein!";
  } else if (score === 0) {
    msgEl.textContent = "Ei osunut – yritä uudelleen!";
  } else {
    msgEl.textContent = "Hyvä yritys! Väarin menneet on merkitty punaisella.";
  }

  panel.classList.add("visible");

  
  document.getElementById("check-btn").disabled = true;
  document.getElementById("check-btn").classList.remove("ready");
}




function startGame() {
  gameActive = true;

  const panel = document.getElementById("result-panel");
  panel.classList.remove("visible");


  
  const checkBtn = document.getElementById("check-btn");
  checkBtn.disabled = true;
  checkBtn.classList.remove("ready");

  
  const chosenKeys = pickRandomCategories(2);
  roundCategories = chosenKeys.map(key => ({
    label: key,
    words: pickRandom(VOCABULARY[key], WORDS_PER_CATEGORY)
  }));

  
  buildDropZones();
  buildWordCards();

  
  const pool = document.getElementById("word-pool");
  pool.addEventListener("dragover", onDropPoolOver);
  pool.addEventListener("dragleave", onDropPoolLeave);
  pool.addEventListener("drop", onDropPool);
}


document.addEventListener("DOMContentLoaded", startGame);

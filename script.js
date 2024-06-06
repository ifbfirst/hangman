//create button Play and name, wrappers for game

const nameGame = document.createElement("h1");
nameGame.className = "name-game";
nameGame.textContent = "Game Hangman";
document.body.append(nameGame);

const buttonPlay = document.createElement("button");
buttonPlay.className = "btn-play";
buttonPlay.textContent = "Play";
document.body.append(buttonPlay);

const gameWrapper = document.createElement("div");
gameWrapper.className = "game-wrapper";
document.body.append(gameWrapper);

const quizeWrapper = document.createElement("div");
quizeWrapper.className = "quize-wrapper";
gameWrapper.append(quizeWrapper);

//create hangman

let bodyArr = [];
const hangmanWrapper = document.createElement("div");

function createHangman() {
  hangmanWrapper.className = "hangman-wrapper";
  gameWrapper.append(hangmanWrapper);

  const bodyAllParts = document.createElement("div");
  bodyAllParts.className = "body-all-parts";
  hangmanWrapper.appendChild(bodyAllParts);

  bodyHead = document.createElement("div");
  bodyHead.className = "body-head";
  bodyAllParts.appendChild(bodyHead);
  bodyHead.textContent = "O";
  const bodyMiddle = document.createElement("div");
  bodyMiddle.className = "body-middle";
  bodyAllParts.appendChild(bodyMiddle);
  const leftHand = document.createElement("span");
  const rightHand = document.createElement("span");
  const bodyCenter = document.createElement("span");
  leftHand.className = "left-hand";
  rightHand.className = "right-hand";
  bodyCenter.className = "body-center";
  bodyMiddle.appendChild(leftHand);
  bodyMiddle.appendChild(bodyCenter);
  bodyMiddle.appendChild(rightHand);
  bodyCenter.textContent = "|";
  leftHand.textContent = "/";
  rightHand.textContent = "\\";
  const bodyBottom = document.createElement("div");
  bodyBottom.className = "body-bottom";
  bodyAllParts.appendChild(bodyBottom);
  const rightLeg = document.createElement("span");
  const leftLeg = document.createElement("span");
  bodyBottom.appendChild(leftLeg);
  bodyBottom.appendChild(rightLeg);
  leftLeg.className = "left-leg";
  rightLeg.className = "right-leg";
  leftLeg.textContent = "/";
  rightLeg.textContent = "\\";

  bodyArr = [bodyHead, bodyCenter, leftHand, rightHand, leftLeg, rightLeg];
}

//create elements of keyboard, points

const wordKeyboard = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
];

const wrapperKeyboard = document.createElement("div");
wrapperKeyboard.className = "key-board";
quizeWrapper.appendChild(wrapperKeyboard);
let btnKeyboard;
let btnKeyboardArr = [];
function createKeyBoard() {
  for (let i = 0; i < wordKeyboard.length; i = i + 1) {
    btnKeyboard = document.createElement("button");
    wrapperKeyboard.appendChild(btnKeyboard);
    btnKeyboard.id = wordKeyboard[i];
    btnKeyboard.className = "btn-letter";
    btnKeyboard.textContent = `${wordKeyboard[i]}`;
    btnKeyboardArr.push(btnKeyboard);

    // wrapperKeyboard.innerHTML += `<button class="c" id=${wordKeyboard[i]}>${wordKeyboard[i]}</button>`;
  }
}
createKeyBoard();

// Create block guesses

let guesses = document.createElement("div");
let incorrectGuesses = 0;
let correctGuesses = 0;

function createGuesses() {
  guesses.className = "guesses";
  guesses.textContent = `Incorrect guesses: ${incorrectGuesses}/6`;
  quizeWrapper.appendChild(guesses);
}

//listen to letter

let incorrectGuessesBool;
let resultGame;
let idLetter;
let idSecretLetter;
let bu;

// using physical keyboard

function listenToKeyboard(event) {
  idLetter = event.key.toUpperCase();
  startGuessing(idLetter);
}

// using virtual keyboard

wrapperKeyboard.onclick = function (event) {
  let button = event.target.closest("button");
  idLetter = button.id;
  startGuessing(idLetter);
};

// function guessing

function startGuessing(idLetter) {
  let button = [];
  let btnPressed;
  let buttonElement;
  button = btnKeyboardArr.filter((letter) => letter.id === idLetter);
  buttonElement = button[0];
  if (buttonElement.classList.contains("inactive")) {
    btnPressed = true;
  } else {
    btnPressed = false;
  }

  incorrectGuessesBool = !false;

  button[0].className = "btn-letter inactive";

  let i;
  for (i = 0; i < secretWord.length; i = i + 1) {
    if (
      idLetter === secretWord[i] &&
      btnPressed === false &&
      incorrectGuesses !== 6
    ) {
      idSecretLetter = document.querySelector(`#id${i}`);
      idSecretLetter.textContent = `${secretWord[i]}`;
      incorrectGuessesBool = false;
      correctGuesses = correctGuesses + 1;
      idSecretLetter.style.border = "none";
    }
  }
  if (correctGuesses === secretWord.length) {
    resultGame = "win";
    setTimeout(function () {
      stopGame(resultGame, secretWord);
    }, 300);
  }

  if (
    incorrectGuessesBool !== false &&
    btnPressed === false &&
    incorrectGuesses !== 6 &&
    correctGuesses !== secretWord.length
  ) {
    incorrectGuesses = incorrectGuesses + 1;
    guesses.textContent = `Incorrect guesses: ${incorrectGuesses}/6`;
    bodyArr[incorrectGuesses - 1].style.opacity = "1";
  } else {
    incorrectGuesses = incorrectGuesses;
  }
  if (incorrectGuesses === 6) {
    guesses.textContent = `Incorrect guesses: 6/6`;
    resultGame = "lost";
    setTimeout(function () {
      stopGame(resultGame, secretWord);
    }, 300);
  }
}

// secret word

const questionWrapper = document.createElement("div");
const secretWordWrapper = document.createElement("div");
let secretWord;
let secretWordQuestion;

function addSecretWord() {
  secretWordQuestion = '';
  secretWord = '';
  
  const secretWordArr = {
    "Russian: oранжевый, English:": "orange",
    "Russian: красный, English:": "red",
    "Russian: зеленый, English:": "green",
    "Russian: серый, English:": "grey",
    "Russian: черный, English:": "black",
    "Russian: голубой, English:": "blue",
    "Russian: розовый, English:": "pink",
    "Russian: белый, English:": "white",
    "Russian: желтый, English:": "yellow",
    "Russian: коричневый, English:": "brown",
    "Russian: фиолетовый, English:": "purple",
  };

  secretWordQuestion =
    Object.keys(secretWordArr)[
      Math.floor(Math.random() * Object.keys(secretWordArr).length)
    ];
  secretWord = secretWordArr[secretWordQuestion].toUpperCase();

  // check on repeating

  if (secretWordQuestion === localStorage.getItem('sWord')) {
    addSecretWord();
} else {

  localStorage.setItem('sWord', secretWordQuestion);

//

  questionWrapper.className = "question";
  quizeWrapper.appendChild(questionWrapper);
  questionWrapper.textContent = `${secretWordQuestion}`;

  secretWordWrapper.className = "secret-word";
  quizeWrapper.appendChild(secretWordWrapper);

  let secretLetter;
  for (let i = 0; i < secretWord.length; i = i + 1) {
    secretLetter = document.createElement("span");
    secretLetter.className = "secret-letter";
    secretLetter.id = `id${i}`;
    secretWordWrapper.appendChild(secretLetter);
  }
  window.addEventListener("keyup", listenToKeyboard);
}
}

// stopGame

const modalBg = document.createElement("div");
document.body.append(modalBg);
modalBg.className = "modal-bg";
const modal = document.createElement("div");
modalBg.appendChild(modal);
modal.className = "modal";

function stopGame(resultGame, secretWord) {
  window.removeEventListener("keyup", listenToKeyboard);
  var audio = new Audio();
  audio.autoplay = true;
  audio.volume = 0.3;
  if (resultGame === "lost") {
    modal.textContent = `You LOST! Secret word: ${secretWord}. Want to play again? `;
    audio.src = "lost.mp3";
  }
  if (resultGame === "win") {
    modal.textContent = `You WON! Secret word: ${secretWord}. Want to play again? `;
    audio.src = "win.mp3";
  }

  modal.appendChild(buttonPlay);
  buttonPlay.textContent = "Play again";
  modalBg.style.display = "block";
  modal.style.display = "block";
  buttonPlay.style.display = "block";
  
  

}

//listen to buttonPlay

buttonPlay.addEventListener("click", function () {

 // Reset elements of game

  while (questionWrapper.firstChild) {
    questionWrapper.removeChild(questionWrapper.firstChild);
  }
  while (secretWordWrapper.firstChild) {
    secretWordWrapper.removeChild(secretWordWrapper.firstChild);
  }
  incorrectGuesses = 0;
  correctGuesses = 0;

  while (hangmanWrapper.firstChild) {
    hangmanWrapper.removeChild(hangmanWrapper.firstChild);
  }
  const buttonLetter = document.querySelectorAll(".inactive");
  for (let i = 0; i < buttonLetter.length; i++) {
    buttonLetter[i].classList.remove("inactive");
  }
  // redesign elements of game

  gameWrapper.style.display = "flex";
  createHangman();
  addSecretWord();
  createGuesses();
  buttonPlay.style.display = "none";
  modal.style.display = "none";
  modalBg.style.display = "none";
});

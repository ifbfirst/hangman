(() => {
  "use strict";

  const MAX_MISSES = 6;
  const STORAGE_KEY = "hangman:lastWord";
  const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  const WORDS = [
    { hint: "оранжевый", word: "ORANGE" },
    { hint: "красный", word: "RED" },
    { hint: "зелёный", word: "GREEN" },
    { hint: "серый", word: "GREY" },
    { hint: "чёрный", word: "BLACK" },
    { hint: "голубой", word: "BLUE" },
    { hint: "розовый", word: "PINK" },
    { hint: "белый", word: "WHITE" },
    { hint: "жёлтый", word: "YELLOW" },
    { hint: "коричневый", word: "BROWN" },
    { hint: "фиолетовый", word: "PURPLE" },
  ];

  const els = {
    hint: document.querySelector("[data-hint]"),
    word: document.querySelector("[data-word]"),
    missCount: document.querySelector("[data-miss-count]"),
    pips: [...document.querySelectorAll("[data-pips] span")],
    parts: [...document.querySelectorAll("[data-part]")],
    keyboard: document.querySelector("[data-keyboard]"),
    modal: document.querySelector("[data-modal]"),
    resultKicker: document.querySelector("[data-result-kicker]"),
    resultTitle: document.querySelector("[data-result-title]"),
    resultWord: document.querySelector("[data-result-word]"),
    restartBtn: document.querySelector('[data-action="restart"]'),
  };

  const state = {
    word: "",
    revealed: [],
    used: new Set(),
    misses: 0,
    locked: true,
  };

  const keys = new Map();

  function pickWord() {
    const last = localStorage.getItem(STORAGE_KEY);
    const pool = WORDS.filter((item) => item.word !== last);
    const list = pool.length ? pool : WORDS;
    return list[Math.floor(Math.random() * list.length)];
  }

  function renderKeyboard() {
    els.keyboard.replaceChildren();
    keys.clear();

    KEY_ROWS.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = `keyboard__row keyboard__row--${row.length}`;

      [...row].forEach((letter) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "key";
        button.dataset.letter = letter;
        button.textContent = letter;
        button.setAttribute("aria-label", `Letter ${letter}`);
        rowEl.append(button);
        keys.set(letter, button);
      });

      els.keyboard.append(rowEl);
    });
  }

  function renderWord(revealMissed = false) {
    els.word.replaceChildren(
      ...state.word.split("").map((letter, index) => {
        const slot = document.createElement("span");
        slot.className = "slot";
        const open = state.revealed[index];
        slot.textContent = open || revealMissed ? letter : "";
        if (open) slot.classList.add("is-open");
        if (!open && revealMissed) slot.classList.add("is-reveal");
        return slot;
      })
    );
  }

  function renderLives() {
    els.missCount.textContent = String(state.misses);
    els.pips.forEach((pip, index) => {
      pip.classList.toggle("is-lost", index < state.misses);
    });
    els.parts.forEach((part, index) => {
      part.classList.toggle("is-on", index < state.misses);
    });
  }

  function resetKeys() {
    keys.forEach((button) => {
      button.disabled = false;
      button.classList.remove("is-hit", "is-miss");
    });
  }

  function playSound(file) {
    const audio = new Audio(file);
    audio.volume = 0.35;
    audio.play().catch(() => {});
  }

  function startRound() {
    const next = pickWord();
    state.word = next.word;
    state.revealed = Array(next.word.length).fill(false);
    state.used = new Set();
    state.misses = 0;
    state.locked = false;

    localStorage.setItem(STORAGE_KEY, next.word);
    els.hint.textContent = next.hint;
    els.modal.hidden = true;

    resetKeys();
    renderWord();
    renderLives();
  }

  function isWon() {
    return state.revealed.every(Boolean);
  }

  function endRound(didWin) {
    state.locked = true;
    keys.forEach((button) => {
      button.disabled = true;
    });

    if (!didWin) renderWord(true);

    window.setTimeout(() => {
      const wordEl = document.createElement("strong");
      wordEl.textContent = state.word;
      els.resultKicker.textContent = didWin ? "Well played" : "Round over";
      els.resultTitle.textContent = didWin ? "You won" : "You lost";
      els.resultWord.replaceChildren("The word was ", wordEl);
      els.modal.hidden = false;
      els.restartBtn.focus();
      playSound(didWin ? "win.mp3" : "lost.mp3");
    }, 280);
  }

  function guess(letter) {
    if (state.locked || !keys.has(letter) || state.used.has(letter)) return;

    state.used.add(letter);
    const button = keys.get(letter);
    const hit = state.word.includes(letter);

    button.disabled = true;
    button.classList.add(hit ? "is-hit" : "is-miss");

    if (hit) {
      state.word.split("").forEach((char, index) => {
        if (char === letter) state.revealed[index] = true;
      });
      renderWord();
      if (isWon()) endRound(true);
      return;
    }

    state.misses += 1;
    renderLives();
    if (state.misses >= MAX_MISSES) endRound(false);
  }

  function onPhysicalKey(event) {
    if (event.repeat || state.locked) return;
    const letter = event.key.toUpperCase();
    if (!/^[A-Z]$/.test(letter)) return;
    event.preventDefault();
    guess(letter);
  }

  renderKeyboard();
  startRound();

  els.restartBtn.addEventListener("click", startRound);

  els.keyboard.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-letter]");
    if (!button) return;
    guess(button.dataset.letter);
  });

  window.addEventListener("keydown", onPhysicalKey);
})();

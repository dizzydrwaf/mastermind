// JAG MISSADE BUSSEN! SKRIV TILL MIG PÅ DISCORD. KAN VARA MED OCH FÖRKLARA FORTFARANDE

// Efter variablerna och initGame() så är det mycket kod som sätter styles. Själva logiken för spelet kommer senare

const COLORS = ["red", "green", "blue", "yellow", "white", "black"];
const COLOR_MAP = {
  red: "var(--color-red)",
  green: "var(--color-green)",
  blue: "var(--color-blue)",
  yellow: "var(--color-yellow)",
  white: "var(--color-white)",
  black: "var(--color-black)"
};

let secretCode = [];
let currentRowIndex = 0;
let currentGuess = [null, null, null, null, null]; // 5 slots
let isGameOver = false;
let selectedSlot = null;

const rowElements = Array.from(document.querySelectorAll(".guess-row")).reverse();
const submitBtn = document.getElementById("btn-submit");
const newGameBtn = document.getElementById("btn-new-game");
const secretContainer = document.getElementById("secret-code-container");
const clearPegBtn = document.getElementById("clear-peg");
const clearRowBtn = document.getElementById("clear-row");

// Placeholder elements for future logic
const btnPvp = document.getElementById("btn-pvp");
const btnPvai = document.getElementById("btn-pvai");

function initGame() {
  // Reset Variables
  secretCode = generateSecretCode();
  currentRowIndex = 0;
  currentGuess = [null, null, null, null, null];
  isGameOver = false;
  selectedSlot = null;

  // Reset UI
  rowElements.forEach((row, index) => {
    // Clear styles
    row.classList.remove("active-row");
    const slots = row.querySelectorAll(".peg-slot");
    slots.forEach(slot => {
      slot.style.background = "";
      slot.style.boxShadow = "";
      slot.classList.remove("selected");
    });

    // Clear feedback
    const feedbackSlots = row.querySelectorAll(".feedback-slot");
    feedbackSlots.forEach(slot => {
      slot.style.background = "";
      slot.style.boxShadow = "";
      slot.classList.remove("black", "white");
    });
  });

  // Activate first row
  rowElements[0].classList.add("active-row");

  // Reset Secret Code Display
  secretContainer.innerHTML = `
    <div class="code-slot">?</div>
    <div class="code-slot">?</div>
    <div class="code-slot">?</div>
    <div class="code-slot">?</div>
    <div class="code-slot">?</div>
  `;

  console.log("Secret Code (for debug):", secretCode);
  submitBtn.disabled = false;
}

function generateSecretCode() {
  const code = [];
  for (let i = 0; i < 5; i++) {
    code.push(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }
  return code;
}


document.querySelectorAll(".peg-slot").forEach(slot => {
  slot.addEventListener("click", function () {
    if (isGameOver) return;

    // Identify which row this slot belongs to
    const parentRow = this.closest(".guess-row");

    if (!parentRow.classList.contains("active-row")) return;

    if (selectedSlot) selectedSlot.classList.remove("selected");

    selectedSlot = this;
    this.classList.add("selected");
  });
});

document.querySelectorAll(".color-switch").forEach(btn => {
  btn.addEventListener("click", function () {
    if (!selectedSlot || isGameOver) return;

    const colorName = this.dataset.color;

    selectedSlot.style.backgroundColor = COLOR_MAP[colorName];
    selectedSlot.style.boxShadow = ""; // let css handle glass effect

    const parentRow = selectedSlot.closest(".guess-row");
    const slotIndex = Array.from(parentRow.querySelectorAll(".peg-slot")).indexOf(selectedSlot);
    currentGuess[slotIndex] = colorName;

    selectedSlot.classList.remove("selected");
    const nextSlot = parentRow.querySelectorAll(".peg-slot")[slotIndex + 1];
    if (nextSlot) {
      selectedSlot = nextSlot;
      nextSlot.classList.add("selected");
    } else {
      selectedSlot = null;
    }
  });
});

clearPegBtn.addEventListener("click", () => {
  if (selectedSlot && !isGameOver) {
    const parentRow = selectedSlot.closest(".guess-row");
    const slotIndex = Array.from(parentRow.querySelectorAll(".peg-slot")).indexOf(selectedSlot);

    selectedSlot.style.background = "";
    currentGuess[slotIndex] = null;
    selectedSlot.classList.remove("selected");
    selectedSlot = null;
  }
});

clearRowBtn.addEventListener("click", () => {
  if (isGameOver) return;
  const activeRow = rowElements[currentRowIndex];
  const slots = activeRow.querySelectorAll(".peg-slot");

  slots.forEach(slot => slot.style.background = "");
  currentGuess = [null, null, null, null, null];
  if (selectedSlot) {
    selectedSlot.classList.remove("selected");
    selectedSlot = null;
  }
});



submitBtn.addEventListener("click", () => {
  if (isGameOver) return;

  if (currentGuess.includes(null)) {
    alert("Please fill all 5 slots before submitting!");
    return;
  }

  const result = calculateFeedback(currentGuess, secretCode);

  renderFeedback(result);

  if (result.blackPegs === 5) {
    endGame(true);
    return;
  }

  if (currentRowIndex >= 9) {
    endGame(false);
    return;
  }

  currentRowIndex++;
  currentGuess = [null, null, null, null, null];

  rowElements.forEach(r => r.classList.remove("active-row"));
  rowElements[currentRowIndex].classList.add("active-row");
});

function calculateFeedback(guess, code) {
  let blackPegs = 0;
  let whitePegs = 0;

  let guessCopy = [...guess];
  let codeCopy = [...code];

  // 1. Check for Exact Matches (Black)
  for (let i = 0; i < 5; i++) {
    if (guessCopy[i] === codeCopy[i]) {
      blackPegs++;
      guessCopy[i] = null; // Mark as used
      codeCopy[i] = null;  // Mark as used
    }
  }

  // 2. Check for Color Matches (White)
  for (let i = 0; i < 5; i++) {
    if (guessCopy[i] !== null) {
      const foundIndex = codeCopy.indexOf(guessCopy[i]);
      if (foundIndex > -1) {
        whitePegs++;
        codeCopy[foundIndex] = null; // Mark as used
      }
    }
  }

  return { blackPegs, whitePegs };
}

function renderFeedback(result) {
  const activeRow = rowElements[currentRowIndex];
  const feedbackSlots = activeRow.querySelectorAll(".feedback-slot");
  let slotIndex = 0;

  for (let i = 0; i < result.blackPegs; i++) {
    feedbackSlots[slotIndex].style.backgroundColor = "var(--feedback-black)";
    feedbackSlots[slotIndex].style.border = "none";
    slotIndex++;
  }

  for (let i = 0; i < result.whitePegs; i++) {
    feedbackSlots[slotIndex].style.backgroundColor = "var(--feedback-white)";
    feedbackSlots[slotIndex].style.border = "none";
    slotIndex++;
  }
}

function endGame(isWin) {
  isGameOver = true;
  submitBtn.disabled = true;

  secretContainer.innerHTML = "";
  secretCode.forEach(color => {
    const peg = document.createElement("div");
    peg.className = "code-slot";
    peg.style.backgroundColor = COLOR_MAP[color];
    secretContainer.appendChild(peg);
  });

  setTimeout(() => {
    if (isWin) {
      alert("Congratulations! You broke the code!");
    } else {
      alert("Game Over! Better luck next time.");
    }
  }, 100);
}

newGameBtn.addEventListener("click", initGame);

initGame();

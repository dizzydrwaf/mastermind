// variable sharing

const rootStyles = getComputedStyle(document.documentElement);
const resetColor = rootStyles.getPropertyValue('').trim();

// what player is touching
let selectedSlot = null;

// Select all peg slots
const pegSlots = document.querySelectorAll(".peg-slot");
pegSlots.forEach(slot => {
  slot.addEventListener("click", () => {
    // Clear previous selection highlighting
    if (selectedSlot) selectedSlot.classList.remove("selected");

    // Select new slot
    selectedSlot = slot;
    slot.classList.add("selected");
  });
});

// Select all color switches
const switches = document.querySelectorAll(".color-switch");
switches.forEach(btn => {
  btn.addEventListener("click", () => {
    if (!selectedSlot) return; // No slot selected

    // Apply the color visually
    const color = btn.dataset.color;
    selectedSlot.style.background = color;
    console.log(selectedSlot.style.background)

    // Optional: remove selection after placing
    selectedSlot.classList.remove("selected");
    selectedSlot = null;
  });
});

const main_game = document.getElementById("main-game-board");

// main_game.style.display = "none"

// clear game field

const clearFieldBtn = document.getElementById("clear-all");
const clearPegBtn = document.getElementById("clear");

clearFieldBtn.addEventListener("click", () => {
  pegSlots.forEach(slot => {
    slot.style.background = resetColor;
  });
});

// clear single peg

clearPegBtn.addEventListener("click", () => {
  pegSlots.forEach(slot => {
    if (!selectedSlot) return;

    slot.style.background = resetColor;
  })
})


// GAME VARIABLES
const colors = ["green", "yellow", "black", "white", "blue", "red"];
let difficulty = 5; // när man byter till easy-mode, ändra värdet till 4

// PLAYER VS AI
let pvAiCode = ["green", "white", "green", "black", "red"];

const autoCode = () => {
  pvAiCode = [];
  for (let i = 0; i < difficulty; i++) {
    pvAiCode.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  console.log(pvAiCode);
}

let guess = ["red", "black", "green", "yellow", "yellow"];

const finishAttempt = () => {
  let guessCopy = [...guess];
  let codeCopy = [...pvAiCode];
  let blackPegs = 0;
  let whitePegs = 0;

  // kolla för svart
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] == codeCopy[i]) {
      blackPegs++;
      guessCopy[i] = null;
      codeCopy[i] = null;
    }
  }

  // kolla för vit
  for (let i = 0; i < guessCopy.length; i++) {
    if (guessCopy[i] != null) {
      let foundIndex = codeCopy.indexOf(guessCopy[i]);
      if (foundIndex > -1) {
        whitePegs++;
        codeCopy[foundIndex] = null;
      }
    }
  }
  return { blackPegs: blackPegs, whitePegs: whitePegs };
}

const submitGuess = () => {
  const pegs = finishAttempt();

  console.log("Black Pegs:", pegs.blackPegs);
  console.log("White Pegs:", pegs.whitePegs);

  if (pegs.blackPegs === difficulty) {
    winGame();
    guess = [];
    pvAiCode = [];
  } // else, visa pegs på skärmen
}


submitGuess()

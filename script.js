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

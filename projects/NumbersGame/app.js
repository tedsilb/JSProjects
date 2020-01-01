// Numbers game app logic.
// By Ted Silbernagel

// Declare variables so they're global
let startGameButton, saveTargetNumberButton, saveUpperLimitButton, saveguessNumberButton;
let targetRow, upperLimitRow, guessNumberRow, highLowRow;
let targetNumberInput, upperLimitInput, guessNumberInput;
let resultText, highResultText, lowResultText;
let targetNo = 0;
let upperNo = 0;
let lowerNo = 1;

// Check if not a number
const notOk = (num) => {
  return (!num || isNaN(num));
}

// Set high and low numbers in results table
const setHighAndLow = () => {
  highResultText.innerHTML = upperNo;
  lowResultText.innerHTML = lowerNo;
}

// Save target number (step 1)
const saveTargetNumber = () => {
  targetNo = parseInt(targetNumberInput.value);
  targetNumberInput.value = '';
  if (notOk(targetNo)) return;
  targetRow.style.display = 'none';
  upperLimitRow.style.display = 'block';
}

// Save upper limit (step 2)
const saveUpperLimit = () => {
  upperNo = parseInt(upperLimitInput.value);
  upperLimitInput.value = '';
  if (notOk(upperNo)) return;
  upperLimitRow.style.display = 'none';
  guessNumberRow.style.display = 'block';
  highLowRow.style.display = 'block';
  resultText.innerHTML = '';
  setHighAndLow();
}

// Handle new guess (step 3+)
const handleNewGuess = () => {
  // Outside constraints
  if (upperNo < guessNumberInput.value) {
    resultText.innerHTML = `${guessNumberInput.value} is above the upper limit.`;
    return;
  } else if (guessNumberInput.value < lowerNo) {
    resultText.innerHTML = `${guessNumberInput.value} is below the lower limit.`;
    return;

  // Within constraints
  } else if (targetNo < guessNumberInput.value) {
    resultText.innerHTML = `${guessNumberInput.value} is High!`;
    upperNo = targetNo;
    highResultText.innerHTML = guessNumberInput.value;
  } else if (guessNumberInput.value < targetNo) {
    resultText.innerHTML = `${guessNumberInput.value} is Low!`;
    lowerNo = targetNo;
    lowResultText.innerHTML = guessNumberInput.value;

  // Win!
  } else {
    resultText.innerHTML = `${guessNumberInput.value} is it!`;
    guessNumberRow.style.display = 'none';
    startGameButton.innerHTML = 'Start new game';
    startGameButton.classList.add('button-primary');
    return;
  }
  guessNumberInput.value = '';
}

// Hide all main rows
const hideMainRows = () => {
  targetRow.style.display = 'none';
  upperLimitRow.style.display = 'none';
  guessNumberRow.style.display = 'none';
  highLowRow.style.display = 'none';
}

// Reset game
const resetGame = () => {
  // Set start game button to defaults
  startGameButton.innerHTML = 'Restart game';
  startGameButton.classList.remove('button-primary');

  // Show 'your number' row, hide others
  targetRow.style.display = 'block';
  upperLimitRow.style.display = 'none';
  guessNumberRow.style.display = 'none';
  highLowRow.style.display = 'none';

  // Reset target, upper, and lower numbers
  targetNo = 0;
  upperNo = 0;
  lowerNo = 1;
}

// Set up variables to hold DOM elements
const initialiseDomVariables = () => {
  startGameButton = document.getElementById('startGameButton');
  targetRow = document.getElementById('targetRow');
  targetNumberInput = document.getElementById('targetNumber');
  saveTargetNumberButton = document.getElementById('saveTargetNumberButton');
  upperLimitRow = document.getElementById('upperLimitRow');
  upperLimitInput = document.getElementById('upperLimit');
  saveUpperLimitButton = document.getElementById('saveUpperLimitButton');
  guessNumberRow = document.getElementById('guessNumberRow');
  guessNumberInput = document.getElementById('guessNumber');
  saveguessNumberButton = document.getElementById('saveguessNumberButton');
  highLowRow = document.getElementById('highLowRow');
  resultText = document.getElementById('resultText');
  highResultText = document.getElementById('highResultText');
  lowResultText = document.getElementById('lowResultText');
}

// Set up listeners for buttons
const setUpButtonListeners = () => {
  startGameButton.onclick = () => { resetGame(); };
  saveTargetNumberButton.onclick = () => { saveTargetNumber(); };
  saveUpperLimitButton.onclick = () => { saveUpperLimit(); };
  saveguessNumberButton.onclick = () => { handleNewGuess(); };
}

// Start script once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initialiseDomVariables();
  setUpButtonListeners();
  hideMainRows();
})

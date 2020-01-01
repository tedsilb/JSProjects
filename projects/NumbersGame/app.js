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

// Async sleep function
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
  // Get input, validate
  targetNo = parseInt(targetNumberInput.value);
  targetNumberInput.value = '';
  if (notOk(targetNo)) return;

  // If ok, hide current row, show next
  targetRow.style.display = 'none';
  upperLimitRow.style.display = 'block';

  // Set focus to next input
  upperLimitInput.focus();
}

// Save upper limit (step 2)
const saveUpperLimit = () => {
  // Get input, validate
  upperNo = parseInt(upperLimitInput.value);
  upperLimitInput.value = '';
  if (notOk(upperNo)) return;

  // If ok, hide current row, show next
  upperLimitRow.style.display = 'none';
  guessNumberRow.style.display = 'block';
  highLowRow.style.display = 'block';

  // Reset previous field, update upper/lower limits
  resultText.innerHTML = '';
  setHighAndLow();

  // Set focus to next input
  guessNumberInput.focus();
}

// Handle new guess (step 3+)
const handleNewGuess = () => {
  // Outside constraints
  if (upperNo < guessNumberInput.value) {
    resultText.innerHTML = `${guessNumberInput.value} is above the upper limit.`;
  } else if (guessNumberInput.value < lowerNo) {
    resultText.innerHTML = `${guessNumberInput.value} is below the lower limit.`;

  // At constraints
  } else if (guessNumberInput.value === upperNo.toString()) {
    resultText.innerHTML = `${guessNumberInput.value} is already the upper limit.`;
  } else if (guessNumberInput.value === lowerNo.toString()) {
    resultText.innerHTML = `${guessNumberInput.value} is already the lower limit.`;

  // Within constraints
  // ex: If lower is 44, target 45, and guess 46, it's a win, not high.
  } else if (targetNo < guessNumberInput.value
             && (guessNumberInput.value - targetNo !== 1
                 || guessNumberInput.value - lowerNo !== 2)) {
    resultText.innerHTML = `${guessNumberInput.value} is High!`;
    upperNo = guessNumberInput.value;
    highResultText.innerHTML = guessNumberInput.value;
  // ex: If upper is 46, target 45, and guess 44, it's a win, not low.
  } else if (guessNumberInput.value < targetNo
             && (targetNo - guessNumberInput.value !== 1
                 || upperNo - guessNumberInput.value !== 2)) {
    resultText.innerHTML = `${guessNumberInput.value} is Low!`;
    lowerNo = guessNumberInput.value;
    lowResultText.innerHTML = guessNumberInput.value;

  // Win!
  } else {
    // Implicit wins
    if (targetNo < guessNumberInput.value) {
      highResultText.innerHTML = guessNumberInput.value;
      resultText.innerHTML = `${parseInt(guessNumberInput.value) - 1} is it!`;
    } else if (guessNumberInput.value < targetNo) {
      lowResultText.innerHTML = guessNumberInput.value;
      resultText.innerHTML = `${parseInt(guessNumberInput.value) + 1} is it!`;
    // Explicit win
    } else {
      resultText.innerHTML = `${guessNumberInput.value} is it!`;
    }
    guessNumberRow.style.display = 'none';
    startGameButton.innerHTML = 'Start new game';
    startGameButton.classList.add('button-primary');
  }

  // Reset value and focus
  guessNumberInput.value = '';
  guessNumberInput.focus();

  // Make sure we have focus (sometimes takes a couple tries on iOS Safari)
  while (document.activeElement !== guessNumberInput) {
    sleep(100).then(() => {
      guessNumberInput.focus();
    })
  }
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

  // Set focus to target number input
  targetNumberInput.focus();

  // Reset target, upper, and lower numbers
  targetNo = 0;
  upperNo = 0;
  lowerNo = 1;
}

// Set up variables to hold DOM elements
const initialiseDomVariables = () => {
  // Start game button
  startGameButton = document.getElementById('startGameButton');

  // Target number
  targetRow = document.getElementById('targetRow');
  targetNumberInput = document.getElementById('targetNumber');
  saveTargetNumberButton = document.getElementById('saveTargetNumberButton');

  // Upper limit
  upperLimitRow = document.getElementById('upperLimitRow');
  upperLimitInput = document.getElementById('upperLimit');
  saveUpperLimitButton = document.getElementById('saveUpperLimitButton');

  // Guess number
  guessNumberRow = document.getElementById('guessNumberRow');
  guessNumberInput = document.getElementById('guessNumber');
  saveguessNumberButton = document.getElementById('saveguessNumberButton');

  // Results display
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

// Set up enter key handlers for inputs
const setUpEnterKeyHandlers = () => {
  targetNumberInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {  // 13 == enter key
      event.preventDefault();  // Cancel the default action, if needed
      saveTargetNumberButton.click();
    }
  });
  upperLimitInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {  // 13 == enter key
      event.preventDefault();  // Cancel the default action, if needed
      saveUpperLimitButton.click();
    }
  });
  guessNumberInput.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {  // 13 == enter key
      event.preventDefault();  // Cancel the default action, if needed
      saveguessNumberButton.click();
    }
  });
}

// Start script once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initialiseDomVariables();
  setUpButtonListeners();
  setUpEnterKeyHandlers();
  hideMainRows();
})

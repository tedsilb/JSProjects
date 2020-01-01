// Numbers game app logic.
// By Ted Silbernagel

// Declare variables so they're global
let startGameButton: HTMLElement, saveTargetNumberButton: HTMLElement;
let saveUpperLimitButton: HTMLElement, saveguessNumberButton: HTMLElement;
let targetRow: HTMLElement, upperLimitRow: HTMLElement;
let guessNumberRow: HTMLElement, highLowRow: HTMLElement;
let targetNumberInput: HTMLInputElement, upperLimitInput: HTMLInputElement, guessNumberInput: HTMLInputElement;
let resultText: HTMLElement, highResultText: HTMLElement, lowResultText: HTMLElement;
let targetNo = 0;
let upperNo = 0;
let lowerNo = 1;
let guessNo = 0;

// Async sleep function
const sleep = (milliseconds: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Check if not a number
const notOk = (num: any): boolean => {
  return (!num || isNaN(num));
}

// Set high and low numbers in results table
const setHighAndLow = () => {
  highResultText.innerHTML = upperNo.toString();
  lowResultText.innerHTML = lowerNo.toString();
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
  if (notOk(upperNo) || upperNo < targetNo) return;

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
  guessNo = parseInt(guessNumberInput.value);
  // Outside constraints
  if (upperNo < guessNo) {
    resultText.innerHTML = `${guessNo} is above the upper limit.`;
  } else if (guessNo < lowerNo) {
    resultText.innerHTML = `${guessNo} is below the lower limit.`;

  // At constraints
  } else if (guessNo === upperNo) {
    resultText.innerHTML = `${guessNo} is already the upper limit.`;
  } else if (guessNo === lowerNo) {
    resultText.innerHTML = `${guessNo} is already the lower limit.`;

  // Within constraints
  // ex: If lower is 44, target 45, and guess 46, it's a win, not high.
  } else if (targetNo < guessNo
             && (guessNo - targetNo !== 1 || guessNo - lowerNo !== 2)) {
    resultText.innerHTML = `${guessNo} is High!`;
    upperNo = guessNo;
    highResultText.innerHTML = guessNo.toString();
  // ex: If upper is 46, target 45, and guess 44, it's a win, not low.
  } else if (guessNo < targetNo
             && (targetNo - guessNo !== 1 || upperNo - guessNo !== 2)) {
    resultText.innerHTML = `${guessNo} is Low!`;
    lowerNo = guessNo;
    lowResultText.innerHTML = guessNo.toString();

  // Win!
  } else {
    // Implicit wins
    if (targetNo < guessNo) {
      highResultText.innerHTML = guessNo.toString();
      resultText.innerHTML = `${guessNo - 1} is it!`;
    } else if (guessNo < targetNo) {
      lowResultText.innerHTML = guessNo.toString();
      resultText.innerHTML = `${guessNo + 1} is it!`;
    // Explicit win
    } else {
      resultText.innerHTML = `${guessNo} is it!`;
    }
    guessNumberRow.style.display = 'none';
    startGameButton.innerHTML = 'Start new game';
    startGameButton.classList.add('button-primary');
    return;
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
  targetNumberInput = <HTMLInputElement>document.getElementById('targetNumber');
  saveTargetNumberButton = document.getElementById('saveTargetNumberButton');

  // Upper limit
  upperLimitRow = document.getElementById('upperLimitRow');
  upperLimitInput = <HTMLInputElement>document.getElementById('upperLimit');
  saveUpperLimitButton = document.getElementById('saveUpperLimitButton');

  // Guess number
  guessNumberRow = document.getElementById('guessNumberRow');
  guessNumberInput = <HTMLInputElement>document.getElementById('guessNumber');
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

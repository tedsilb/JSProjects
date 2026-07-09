"use strict";
// Numbers game app logic.
// By Ted Silbernagel
// Declare variables so they're global.
let startGameButton = null;
let saveTargetNumberButton = null;
let saveUpperLimitButton = null;
let saveGuessNumberButton = null;
let targetRow = null;
let upperLimitRow = null;
let guessNumberRow = null;
let highLowRow = null;
let targetNumberInput = null;
let upperLimitInput = null;
let guessNumberInput = null;
let resultText = null;
let highResultText = null;
let lowResultText = null;
let targetNo = 0;
let upperNo = 0;
let lowerNo = 1;
let guessNo = 0;
/** Async sleep function. */
function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
/** Check if not a number. */
function notOk(num) {
    return !num || Number.isNaN(num);
}
/** Set high and low numbers in results table. */
function setHighAndLow() {
    if (highResultText) {
        highResultText.innerHTML = upperNo.toString();
    }
    if (lowResultText) {
        lowResultText.innerHTML = lowerNo.toString();
    }
}
/** Save target number (step 1). */
function saveTargetNumber() {
    // Get input, validate
    targetNo = parseInt(targetNumberInput?.value ?? "", 10);
    if (!targetNumberInput) {
        return;
    }
    targetNumberInput.value = "";
    if (notOk(targetNo)) {
        return;
    }
    // If ok, hide current row, show next
    if (targetRow) {
        targetRow.style.display = "none";
    }
    if (upperLimitRow) {
        upperLimitRow.style.display = "block";
    }
    // Set focus to next input
    upperLimitInput?.focus();
}
/** Save upper limit (step 2). */
function saveUpperLimit() {
    // Get input, validate
    upperNo = parseInt(upperLimitInput?.value ?? "", 10);
    if (upperLimitInput) {
        upperLimitInput.value = "";
    }
    if (notOk(upperNo) || upperNo < targetNo) {
        return;
    }
    // If ok, hide current row, show next
    if (upperLimitRow) {
        upperLimitRow.style.display = "none";
    }
    if (guessNumberRow) {
        guessNumberRow.style.display = "block";
    }
    if (highLowRow) {
        highLowRow.style.display = "block";
    }
    // Reset previous field, update upper/lower limits
    if (resultText) {
        resultText.innerHTML = "";
    }
    setHighAndLow();
    // Set focus to next input
    guessNumberInput?.focus();
}
/** Handle new guess (step 3+). */
function handleNewGuess() {
    guessNo = parseInt(guessNumberInput?.value ?? "", 10);
    if (!resultText) {
        return;
    }
    if (upperNo < guessNo) {
        // Outside constraints
        resultText.innerHTML = `${guessNo} is above a previous guess.`;
    }
    else if (guessNo < lowerNo) {
        resultText.innerHTML = `${guessNo} is below a previous guess.`;
    }
    else if (guessNo === upperNo) {
        // At constraints
        resultText.innerHTML = `${guessNo} is already the highest guess.`;
    }
    else if (guessNo === lowerNo) {
        resultText.innerHTML = `${guessNo} is already the lowest guess.`;
    }
    else if (targetNo < guessNo && (guessNo - targetNo !== 1 || guessNo - lowerNo !== 2)) {
        // Within constraints
        // ex: If lower is 44, target 45, and guess 46, it's a win, not high.
        resultText.innerHTML = `${guessNo} is high!`;
        upperNo = guessNo;
        if (highResultText) {
            highResultText.innerHTML = guessNo.toString();
        }
    }
    else if (guessNo < targetNo && (targetNo - guessNo !== 1 || upperNo - guessNo !== 2)) {
        // ex: If upper is 46, target 45, and guess 44, it's a win, not low.
        resultText.innerHTML = `${guessNo} is low!`;
        lowerNo = guessNo;
        if (lowResultText) {
            lowResultText.innerHTML = guessNo.toString();
        }
    }
    else {
        // Win!
        // Implicit wins
        if (targetNo < guessNo) {
            if (highResultText) {
                highResultText.innerHTML = guessNo.toString();
            }
            resultText.innerHTML = `${guessNo - 1} is it!`;
        }
        else if (guessNo < targetNo) {
            if (lowResultText) {
                lowResultText.innerHTML = guessNo.toString();
            }
            resultText.innerHTML = `${guessNo + 1} is it!`;
        }
        else {
            // Explicit win
            resultText.innerHTML = `${guessNo} is it!`;
        }
        if (guessNumberRow) {
            guessNumberRow.style.display = "none";
        }
        if (startGameButton) {
            startGameButton.innerHTML = "Start new game";
        }
        if (startGameButton) {
            startGameButton.classList.add("button-primary");
        }
        if (guessNumberInput) {
            guessNumberInput.value = "";
        }
        return;
    }
    // Reset value and focus
    const guessInput = guessNumberInput;
    if (guessInput) {
        guessInput.value = "";
        guessInput.focus();
        // Make sure we have focus (sometimes takes a couple tries on iOS Safari)
        while (document.activeElement !== guessInput) {
            sleep(100).then(() => {
                guessInput.focus();
            });
        }
    }
}
/** Hide all main rows. */
function hideMainRows() {
    if (targetRow) {
        targetRow.style.display = "none";
    }
    if (upperLimitRow) {
        upperLimitRow.style.display = "none";
    }
    if (guessNumberRow) {
        guessNumberRow.style.display = "none";
    }
    if (highLowRow) {
        highLowRow.style.display = "none";
    }
}
/** Reset game. */
function resetGame() {
    // Set start game button to defaults
    if (startGameButton) {
        startGameButton.innerHTML = "Restart game";
    }
    if (startGameButton) {
        startGameButton.classList.remove("button-primary");
    }
    // Show 'your number' row, hide others
    if (targetRow) {
        targetRow.style.display = "block";
    }
    if (upperLimitRow) {
        upperLimitRow.style.display = "none";
    }
    if (guessNumberRow) {
        guessNumberRow.style.display = "none";
    }
    if (highLowRow) {
        highLowRow.style.display = "none";
    }
    // Set focus to target number input
    targetNumberInput?.focus();
    // Reset target, upper, and lower numbers
    targetNo = 0;
    upperNo = 0;
    lowerNo = 1;
}
/** Set up variables to hold DOM elements. */
function initialiseNumbersGameDomVariables() {
    // Start game button
    startGameButton = document.getElementById("startGameButton");
    // Target number
    targetRow = document.getElementById("targetRow");
    targetNumberInput = document.getElementById("targetNumber");
    saveTargetNumberButton = document.getElementById("saveTargetNumberButton");
    // Upper limit
    upperLimitRow = document.getElementById("upperLimitRow");
    upperLimitInput = document.getElementById("upperLimit");
    saveUpperLimitButton = document.getElementById("saveUpperLimitButton");
    // Guess number
    guessNumberRow = document.getElementById("guessNumberRow");
    guessNumberInput = document.getElementById("guessNumber");
    saveGuessNumberButton = document.getElementById("saveguessNumberButton");
    // Results display
    highLowRow = document.getElementById("highLowRow");
    resultText = document.getElementById("resultText");
    highResultText = document.getElementById("highResultText");
    lowResultText = document.getElementById("lowResultText");
}
/** Set up listeners for buttons. */
function setUpNumbersGameButtonListeners() {
    if (startGameButton) {
        startGameButton.onclick = () => {
            resetGame();
        };
    }
    if (saveTargetNumberButton) {
        saveTargetNumberButton.onclick = () => {
            saveTargetNumber();
        };
    }
    if (saveUpperLimitButton) {
        saveUpperLimitButton.onclick = () => {
            saveUpperLimit();
        };
    }
    if (saveGuessNumberButton) {
        saveGuessNumberButton.onclick = () => {
            handleNewGuess();
        };
    }
}
/** Set up enter key handlers for inputs. */
function setUpEnterKeyHandlers() {
    targetNumberInput?.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Cancel the default action, if needed
            saveTargetNumberButton?.click();
        }
    });
    upperLimitInput?.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Cancel the default action, if needed
            saveUpperLimitButton?.click();
        }
    });
    guessNumberInput?.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Cancel the default action, if needed
            saveGuessNumberButton?.click();
        }
    });
}
// Start script once DOM is loaded.
document.addEventListener("DOMContentLoaded", () => {
    initialiseNumbersGameDomVariables();
    setUpNumbersGameButtonListeners();
    setUpEnterKeyHandlers();
    hideMainRows();
});

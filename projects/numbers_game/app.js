let startGameButton;
let saveTargetNumberButton;
let saveUpperLimitButton;
let saveguessNumberButton;
let targetRow;
let upperLimitRow;
let guessNumberRow;
let highLowRow;
let targetNumberInput;
let upperLimitInput;
let guessNumberInput;
let resultText;
let highResultText;
let lowResultText;
let targetNo = 0;
let upperNo = 0;
let lowerNo = 1;
let guessNo = 0;
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
const notOk = (num) => {
    return !num || isNaN(num);
};
const setHighAndLow = () => {
    highResultText.innerHTML = upperNo.toString();
    lowResultText.innerHTML = lowerNo.toString();
};
const saveTargetNumber = () => {
    targetNo = parseInt(targetNumberInput.value, 10);
    targetNumberInput.value = '';
    if (notOk(targetNo))
        return;
    targetRow.style.display = 'none';
    upperLimitRow.style.display = 'block';
    upperLimitInput.focus();
};
const saveUpperLimit = () => {
    upperNo = parseInt(upperLimitInput.value, 10);
    upperLimitInput.value = '';
    if (notOk(upperNo) || upperNo < targetNo)
        return;
    upperLimitRow.style.display = 'none';
    guessNumberRow.style.display = 'block';
    highLowRow.style.display = 'block';
    resultText.innerHTML = '';
    setHighAndLow();
    guessNumberInput.focus();
};
const handleNewGuess = () => {
    guessNo = parseInt(guessNumberInput.value, 10);
    if (upperNo < guessNo) {
        resultText.innerHTML = `${guessNo} is above a previous guess.`;
    }
    else if (guessNo < lowerNo) {
        resultText.innerHTML = `${guessNo} is below a previous guess.`;
    }
    else if (guessNo === upperNo) {
        resultText.innerHTML = `${guessNo} is already the highest guess.`;
    }
    else if (guessNo === lowerNo) {
        resultText.innerHTML = `${guessNo} is already the lowest guess.`;
    }
    else if (targetNo < guessNo &&
        (guessNo - targetNo !== 1 || guessNo - lowerNo !== 2)) {
        resultText.innerHTML = `${guessNo} is high!`;
        upperNo = guessNo;
        highResultText.innerHTML = guessNo.toString();
    }
    else if (guessNo < targetNo &&
        (targetNo - guessNo !== 1 || upperNo - guessNo !== 2)) {
        resultText.innerHTML = `${guessNo} is low!`;
        lowerNo = guessNo;
        lowResultText.innerHTML = guessNo.toString();
    }
    else {
        if (targetNo < guessNo) {
            highResultText.innerHTML = guessNo.toString();
            resultText.innerHTML = `${guessNo - 1} is it!`;
        }
        else if (guessNo < targetNo) {
            lowResultText.innerHTML = guessNo.toString();
            resultText.innerHTML = `${guessNo + 1} is it!`;
        }
        else {
            resultText.innerHTML = `${guessNo} is it!`;
        }
        guessNumberRow.style.display = 'none';
        startGameButton.innerHTML = 'Start new game';
        startGameButton.classList.add('button-primary');
        guessNumberInput.value = '';
        return;
    }
    guessNumberInput.value = '';
    guessNumberInput.focus();
    while (document.activeElement !== guessNumberInput) {
        sleep(100).then(() => {
            guessNumberInput.focus();
        });
    }
};
const hideMainRows = () => {
    targetRow.style.display = 'none';
    upperLimitRow.style.display = 'none';
    guessNumberRow.style.display = 'none';
    highLowRow.style.display = 'none';
};
const resetGame = () => {
    startGameButton.innerHTML = 'Restart game';
    startGameButton.classList.remove('button-primary');
    targetRow.style.display = 'block';
    upperLimitRow.style.display = 'none';
    guessNumberRow.style.display = 'none';
    highLowRow.style.display = 'none';
    targetNumberInput.focus();
    targetNo = 0;
    upperNo = 0;
    lowerNo = 1;
};
const initialiseNumbersGameDomVariables = () => {
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
};
const setUpNumbersGameButtonListeners = () => {
    startGameButton.onclick = () => {
        resetGame();
    };
    saveTargetNumberButton.onclick = () => {
        saveTargetNumber();
    };
    saveUpperLimitButton.onclick = () => {
        saveUpperLimit();
    };
    saveguessNumberButton.onclick = () => {
        handleNewGuess();
    };
};
const setUpEnterKeyHandlers = () => {
    targetNumberInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveTargetNumberButton.click();
        }
    });
    upperLimitInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveUpperLimitButton.click();
        }
    });
    guessNumberInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveguessNumberButton.click();
        }
    });
};
document.addEventListener('DOMContentLoaded', () => {
    initialiseNumbersGameDomVariables();
    setUpNumbersGameButtonListeners();
    setUpEnterKeyHandlers();
    hideMainRows();
});

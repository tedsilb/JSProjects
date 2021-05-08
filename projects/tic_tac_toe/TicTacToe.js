/* eslint-disable no-console */
// Tic Tac Toe game! Based on my TicTacToe.py program
// By Ted Silbernagel

// Declare variables so they're global
let btnResetGame;
let lblStatusDisplay;
let cellA1;
let cellA2;
let cellA3;
let cellB1;
let cellB2;
let cellB3;
let cellC1;
let cellC2;
let cellC3;
let cpuChoice;
let cpuStarted;
let buttonsEnabled;
let itemIndex;
let randomNo;
let availableCells = [];
let userChosenCells = [];
let cpuChosenCells = [];

// Set up constants
const userIcon = 'X';
const cpuIcon = 'O';
const cpuWinMsg = 'Computer wins :(';
const userWinMsg = 'You win!';
const tieMsg = 'Tie.';
const newGameMsg = 'New game. Your turn.';
const alreadySelectedMsg = 'Spot already selected. Try again.';
const cpuTurnMsg = 'Computer\'s turn...';
const userTurnMsg = 'Your turn.';

// Check if all array items are included in another array
const includesAll = (masterArray, itemsToCheck) => {
  for (const arrayItem of itemsToCheck) {
    if (!masterArray.includes(arrayItem)) {
      return false;
    }
  }
  return true;
};

// Main function to run on load
const main = () => {
  // Put interactable elements into variables
  cellA1 = document.getElementById('A1');
  cellA2 = document.getElementById('A2');
  cellA3 = document.getElementById('A3');
  cellB1 = document.getElementById('B1');
  cellB2 = document.getElementById('B2');
  cellB3 = document.getElementById('B3');
  cellC1 = document.getElementById('C1');
  cellC2 = document.getElementById('C2');
  cellC3 = document.getElementById('C3');
  btnResetGame = document.getElementById('reset-button');
  lblStatusDisplay = document.getElementById('status-display');

  // Set up onClick functions for the cells
  cellA1.onclick = () => {
    buttonPress(cellA1, 'A1');
  };
  cellA2.onclick = () => {
    buttonPress(cellA2, 'A2');
  };
  cellA3.onclick = () => {
    buttonPress(cellA3, 'A3');
  };
  cellB1.onclick = () => {
    buttonPress(cellB1, 'B1');
  };
  cellB2.onclick = () => {
    buttonPress(cellB2, 'B2');
  };
  cellB3.onclick = () => {
    buttonPress(cellB3, 'B3');
  };
  cellC1.onclick = () => {
    buttonPress(cellC1, 'C1');
  };
  cellC2.onclick = () => {
    buttonPress(cellC2, 'C2');
  };
  cellC3.onclick = () => {
    buttonPress(cellC3, 'C3');
  };

  // Set up reset button
  btnResetGame.onclick = () => {
    resetGame();
  };

  // Reset game, initially
  resetGame();
};

// Function to take CPU turn
const takeCpuTurn = () => {
  lblStatusDisplay.innerHTML = cpuTurnMsg;
  // Check for tie
  if (isTied()) {
    lblStatusDisplay.innerHTML = tieMsg;
    buttonsEnabled = false;
    console.log('Found a tie');

    // Some winning strategies
  } else if (
    cpuStarted && userChosenCells.length === 2 &&
    arraysEqual(cpuChosenCells, ['A1', 'A3']) &&
    (arraysEqual(userChosenCells, ['B1', 'A2']) ||
      arraysEqual(userChosenCells, ['C1', 'A2']) ||
      arraysEqual(userChosenCells, ['B3', 'A2']) ||
      arraysEqual(userChosenCells, ['A2', 'C2']))) {
    if (arraysEqual(userChosenCells, ['B1', 'A2']) ||
      arraysEqual(userChosenCells, ['C1', 'A2'])) {
      cpuChoice = 'C3';
    } else if (arraysEqual(userChosenCells, ['B3', 'A2'])) {
      cpuChoice = 'C1';
    } else if (arraysEqual(userChosenCells, ['A2', 'C2'])) {
      cpuChoice = 'B2';
    }
    console.log(`Taking a winning strategy, choosing ${cpuChoice}`);
  } else if (
    arraysEqual(userChosenCells, ['B2', 'C3']) &&
    arraysEqual(cpuChosenCells, ['A1', 'C1'])) {
    cpuChoice = 'A3';
    console.log(`Taking a winning strategy, choosing ${cpuChoice}`);

    // Block winning moves by user
    // A block
  } else if (
    (includesAll(userChosenCells, ['A2', 'A3']) ||
      includesAll(userChosenCells, ['B1', 'C1']) ||
      includesAll(userChosenCells, ['B2', 'C3'])) &&
    availableCells.includes('A1')) {
    cpuChoice = 'A1';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(userChosenCells, ['A1', 'A3']) ||
      includesAll(userChosenCells, ['B2', 'C2'])) &&
    availableCells.includes('A2')) {
    cpuChoice = 'A2';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(userChosenCells, ['A1', 'A2']) ||
      includesAll(userChosenCells, ['B3', 'C3']) ||
      includesAll(userChosenCells, ['C1', 'B2'])) &&
    availableCells.includes('A3')) {
    cpuChoice = 'A3';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
    // B block
  } else if (
    (includesAll(userChosenCells, ['B2', 'B3']) ||
      includesAll(userChosenCells, ['A1', 'C1'])) &&
    availableCells.includes('B1')) {
    cpuChoice = 'B1';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(userChosenCells, ['B1', 'B3']) ||
      includesAll(userChosenCells, ['A2', 'C2']) ||
      includesAll(userChosenCells, ['A1', 'C3'])) &&
    availableCells.includes('B2')) {
    cpuChoice = 'B2';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(userChosenCells, ['B1', 'B2']) ||
      includesAll(userChosenCells, ['A3', 'C3'])) &&
    availableCells.includes('B3')) {
    cpuChoice = 'B3';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
    // C block
  } else if (
    (includesAll(userChosenCells, ['C2', 'C3']) ||
      includesAll(userChosenCells, ['A1', 'B1']) ||
      includesAll(userChosenCells, ['A3', 'B2'])) &&
    availableCells.includes('C1')) {
    cpuChoice = 'C1';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(userChosenCells, ['C1', 'C3']) ||
      includesAll(userChosenCells, ['A2', 'B2'])) &&
    availableCells.includes('C2')) {
    cpuChoice = 'C2';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(userChosenCells, ['C1', 'C2']) ||
      includesAll(userChosenCells, ['B3', 'C3']) ||
      includesAll(userChosenCells, ['C1', 'B2'])) &&
    availableCells.includes('C3')) {
    cpuChoice = 'C3';
    console.log(`Blocking a winning move, choosing ${cpuChoice}`);

    // Take winning moves for cpu
    // A block
  } else if (
    (includesAll(cpuChosenCells, ['A2', 'A3']) ||
      includesAll(cpuChosenCells, ['B1', 'C1']) ||
      includesAll(cpuChosenCells, ['B2', 'C3'])) &&
    availableCells.includes('A1')) {
    cpuChoice = 'A1';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(cpuChosenCells, ['A1', 'A3']) ||
      includesAll(cpuChosenCells, ['B2', 'C2'])) &&
    availableCells.includes('A2')) {
    cpuChoice = 'A2';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(cpuChosenCells, ['A1', 'A2']) ||
      includesAll(cpuChosenCells, ['B3', 'C3']) ||
      includesAll(cpuChosenCells, ['C1', 'B2'])) &&
    availableCells.includes('A3')) {
    cpuChoice = 'A3';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
    // B block
  } else if (
    (includesAll(cpuChosenCells, ['B2', 'B3']) ||
      includesAll(cpuChosenCells, ['A1', 'C1'])) &&
    availableCells.includes('B1')) {
    cpuChoice = 'B1';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(cpuChosenCells, ['B1', 'B3']) ||
      includesAll(cpuChosenCells, ['A2', 'C2']) ||
      includesAll(cpuChosenCells, ['A1', 'C3'])) &&
    availableCells.includes('B2')) {
    cpuChoice = 'B2';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(cpuChosenCells, ['B1', 'B2']) ||
      includesAll(cpuChosenCells, ['A3', 'C3'])) &&
    availableCells.includes('B3')) {
    cpuChoice = 'B3';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
    // C block
  } else if (
    (includesAll(cpuChosenCells, ['C2', 'C3']) ||
      includesAll(cpuChosenCells, ['A1', 'B1']) ||
      includesAll(cpuChosenCells, ['B2', 'A3'])) &&
    availableCells.includes('C1')) {
    cpuChoice = 'C1';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(cpuChosenCells, ['C1', 'C3']) ||
      includesAll(cpuChosenCells, ['A2', 'B2'])) &&
    availableCells.includes('C2')) {
    cpuChoice = 'C2';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);
  } else if (
    (includesAll(cpuChosenCells, ['C1', 'C2']) ||
      includesAll(cpuChosenCells, ['B3', 'C3']) ||
      includesAll(cpuChosenCells, ['A1', 'B2'])) &&
    availableCells.includes('C3')) {
    cpuChoice = 'C3';
    console.log(`Taking a winning move, choosing ${cpuChoice}`);

    // Take smart starts
    // User start
  } else if (userChosenCells.length === 1 && cpuChosenCells.length === 0) {
    if (userChosenCells[0] === 'B2') {
      cpuChoice =
        ['A1', 'A3', 'C1',
          'C3'][Math.floor(Math.random() * ['A1', 'A3', 'C1', 'C3'].length)];
      console.log(`User start, choosing ${cpuChoice}`);
    } else {
      cpuChoice = 'B2';
    }
    // CPU start
  } else if (userChosenCells.length === 0) {
    console.log('Taking smart cpu starts');
    randomNo = Math.random();
    if (randomNo <= .2) {
      itemIndex = 0;
    } else if (randomNo > .2 && randomNo <= .4) {
      itemIndex = 1;
    } else if (randomNo > .4 && randomNo <= .8) {
      itemIndex = 2;
    } else if (randomNo > .8 && randomNo <= .9) {
      itemIndex = 3;
    } else if (randomNo > .9 && randomNo <= .925) {
      itemIndex = 4;
    } else if (randomNo > .925 && randomNo <= .95) {
      itemIndex = 5;
    } else if (randomNo > .95 && randomNo <= .975) {
      itemIndex = 6;
    } else {
      itemIndex = 7;
    }
    randomNo = 0;

    cpuChoice =
      ['A1', 'A3', 'C1', 'C3', 'B2', 'A2', 'B3', 'C2', 'B1'][itemIndex];

    // If no winning moves for user or cpu, choose at random
  } else {
    console.log('Choosing randomly');
    // First make sure it's not a tie
    if (availableCells.length !== 0) {
      cpuChoice =
        availableCells[Math.floor(Math.random() * availableCells.length)];
      // If it's a tie, end the game
    } else {
      console.log('Ending game');
      lblStatusDisplay.innerHTML = tieMsg;
      buttonsEnabled = false;
      return;
    }
  }

  console.log(`CPU choosing ${cpuChoice}`);

  // Set cell as chosen based on previous logic
  setCpuCellChosen();

  // Set cell as chosen, remove from available
  cpuChosenCells.push(cpuChoice);
  itemIndex = availableCells.indexOf(cpuChoice);
  console.log(`Removing ${availableCells[itemIndex]} from available`);
  availableCells.splice(itemIndex, 1);
  itemIndex = 0;

  console.log(`Currently available cells: ${availableCells}`);
  console.log(`Currently chosen cells: ${cpuChosenCells}`);

  // Check to see if computer has won
  if (hasWon(cpuChosenCells)) {
    lblStatusDisplay.innerHTML = cpuWinMsg;
    buttonsEnabled = false;
    console.log('CPU has won');
  } else {
    lblStatusDisplay.innerHTML = userTurnMsg;
    console.log('CPU has not won');
  }

  // Check for tie
  if (isTied()) {
    lblStatusDisplay.innerHTML = tieMsg;
    buttonsEnabled = false;
    console.log('Found a tie');
  }
};

// Check for tie function
const isTied = () => {
  if (availableCells.length === 0) {
    if (![cpuWinMsg, userWinMsg].includes(lblStatusDisplay.innerHTML)) {
      return true;
    }
  }
  return false;
};

// Check if player has won
const hasWon = (chosenCells) => {
  return includesAll(chosenCells, ['A1', 'A2', 'A3']) ||
    includesAll(chosenCells, ['B1', 'B2', 'B3']) ||
    includesAll(chosenCells, ['C1', 'C2', 'C3']) ||
    includesAll(chosenCells, ['A1', 'B1', 'C1']) ||
    includesAll(chosenCells, ['A2', 'B2', 'C2']) ||
    includesAll(chosenCells, ['A3', 'B3', 'C3']) ||
    includesAll(chosenCells, ['A1', 'B2', 'C3']) ||
    includesAll(chosenCells, ['C1', 'B2', 'A3']);
};

// Button press function
const buttonPress = (button, gridLoc) => {
  // Ensure buttons are enabled
  if (buttonsEnabled) {
    // Ensure cell isn't yet selected
    if (button.innerHTML === '') {
      // Set the cell as checked and chosen, remove from available
      button.innerHTML = userIcon;
      userChosenCells.push(gridLoc);
      itemIndex = availableCells.indexOf(gridLoc);
      availableCells.splice(itemIndex, 1);
      itemIndex = 0;
      // Check to see if you won
      if (hasWon(userChosenCells)) {
        lblStatusDisplay.innerHTML = userWinMsg;
        buttonsEnabled = false;
        // If you didn't win, take computer's turn
      } else {
        takeCpuTurn();
      }
      // If cell's selected, display error
    } else {
      lblStatusDisplay.innerHTML = alreadySelectedMsg;
    }
  }
};

// Set cpu cell as chosen function
const setCpuCellChosen = () => {
  if (cpuChoice === 'A1') {
    cellA1.innerHTML = cpuIcon;
  } else if (cpuChoice === 'A2') {
    cellA2.innerHTML = cpuIcon;
  } else if (cpuChoice === 'A3') {
    cellA3.innerHTML = cpuIcon;
  } else if (cpuChoice === 'B1') {
    cellB1.innerHTML = cpuIcon;
  } else if (cpuChoice === 'B2') {
    cellB2.innerHTML = cpuIcon;
  } else if (cpuChoice === 'B3') {
    cellB3.innerHTML = cpuIcon;
  } else if (cpuChoice === 'C1') {
    cellC1.innerHTML = cpuIcon;
  } else if (cpuChoice === 'C2') {
    cellC2.innerHTML = cpuIcon;
  } else if (cpuChoice === 'C3') {
    cellC3.innerHTML = cpuIcon;
  }
};

// Reset game function
const resetGame = () => {
  console.log('Resetting game');
  clearCells();
  buttonsEnabled = true;
  cellA1.innerHTML = '';
  cellA2.innerHTML = '';
  cellA3.innerHTML = '';
  cellB1.innerHTML = '';
  cellB2.innerHTML = '';
  cellB3.innerHTML = '';
  cellC1.innerHTML = '';
  cellC2.innerHTML = '';
  cellC3.innerHTML = '';
  lblStatusDisplay.innerHTML = newGameMsg;
  userChosenCells = [];
  cpuChosenCells = [];
  availableCells = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

  // Randomly have cpu start
  if ([true, false][Math.floor(Math.random() * [true, false].length)]) {
    cpuStarted = true;
    takeCpuTurn();
  } else {
    cpuStarted = false;
  }
};

// Clear cells function
const clearCells = () => {
  console.log('Clearing cells');
  cellA1.innerHTML = '';
  cellA2.innerHTML = '';
  cellA3.innerHTML = '';
  cellB1.innerHTML = '';
  cellB2.innerHTML = '';
  cellB3.innerHTML = '';
  cellC1.innerHTML = '';
  cellC2.innerHTML = '';
  cellC3.innerHTML = '';
};

// Check if arrays are equal
const arraysEqual = (arrayA, arrayB) => {
  const a = arrayA;
  const b = arrayB;
  a.sort();
  b.sort();
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

// Start script once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  main();
});

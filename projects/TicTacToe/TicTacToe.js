/* Only start script when DOM is loaded */
document.addEventListener('DOMContentLoaded', (event) => {
  main()
})

/* Declare cell variables so they're global */
let cellA1, cellA2, cellA3, cellB1, cellB2, cellB3, cellC1, cellC2, cellC3;

/* Main function to run on load */
function main() {
  /* Put the cells into variables */
  cellA1 = document.getElementById('A1');
  cellA2 = document.getElementById('A2');
  cellA3 = document.getElementById('A3');
  cellB1 = document.getElementById('B1');
  cellB2 = document.getElementById('B2');
  cellB3 = document.getElementById('B3');
  cellC1 = document.getElementById('C1');
  cellC2 = document.getElementById('C2');
  cellC3 = document.getElementById('C3');
  clearCells();
}

/* Clear cells function */
function clearCells() {
  cellA1.innerHTML = '';
  cellA2.innerHTML = '';
  cellA3.innerHTML = '';
  cellB1.innerHTML = '';
  cellB2.innerHTML = '';
  cellB3.innerHTML = '';
  cellC1.innerHTML = '';
  cellC2.innerHTML = '';
  cellC3.innerHTML = '';
}
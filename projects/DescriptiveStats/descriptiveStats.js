// Calculate descriptive statistics for a list of numbers
// By Ted Silbernagel

// Declare variables so they're global
let calcButton;
let boxSummary, boxMean, boxMedian, boxMode, boxRange;
let boxVariance, boxStDev, boxStErr, boxConfInt, boxConfLevel;
let i;

// Set up function to get data from user
function getUserData() {
  let userData = document.getElementById('userData').value;
  let dataType = document.querySelector('input[name="dataType"]:checked').value;
  let confLevel = document.querySelector('input[name="confLevel"]:checked').value;
  return {userData: userData,
          dataType: dataType,
          confLevel: confLevel
        }
}

// Set up variables to hold DOM elements
function initialiseDomVariables() {
  calcButton = document.getElementById('calcButton');
  boxSummary = document.getElementById('summary');
  boxMean = document.getElementById('mean');
  boxMedian = document.getElementById('median');
  boxMode = document.getElementById('mode');
  boxRange = document.getElementById('range');
  boxVariance = document.getElementById('variance');
  boxStDev = document.getElementById('stDev');
  boxStErr = document.getElementById('stErr');
  boxConfInt = document.getElementById('confInt');
  boxConfLevel = document.getElementById('confLevel');
}

// Set up onclick listener
function setUpOnClick() {
  calcButton.onclick = function(){ runDescriptiveStats(); };
}

// Set up function to run the process and display results
const runDescriptiveStats = () => {
  printResults(descriptiveStats(getUserData()));
}

// Set up function to compute the statistics
const descriptiveStats = (values) => {
  // Set up incoming variables
  let data = values.userData.split(",");
  for (i in data) {
    data[i] = parseFloat(data[i])
  }
  const dataType = values.dataType;
  let confLevel = parseInt(values.confLevel);

  const roundTo = 4;
  // Code confidence level
  let tStat = 0;
  if (confLevel === 90) {
    tStat = 1.64;
  } else if (confLevel === 95) {
    tStat = 1.96;
  } else if (confLevel === 99) {
    tStat = 2.58;
  }

  // Calculate degrees of freedom
  const dataLength = data.length;
  const lastData = dataLength - 1;
  let dof = 0;
  if (dataType === 'Sample') {
    dof = dataLength - 1;
  } else if (dataType === 'Population') {
    dof = dataLength;
  }

  // Calculate sum and mean
  let sum = 0;
  for (i in data) {
      sum += data[i];
  }
  const mean = sum / dataLength;

  // Calculate median
  let sortedData = data.sort();
  let median = 0;

  if (dataLength % 2 === 0) {
    median = (sortedData[dataLength / 2 - 1] + sortedData[dataLength / 2]) / 2;
  } else {
    median = sortedData[(lastData) / 2];
  }

  // Calculate mode
  let modes = data;
  let loopedModeNos = [];
  let numOccurrences = [];
  //let deleteRestModes = false;
  for (i in modes) {
    if (loopedModeNos.indexOf(modes[i]) === -1) {
      console.log('not found');
      console.log(i);
      console.log(modes[i]);
      console.log(loopedModeNos.indexOf(modes[i]));
      loopedModeNos.push(modes[i]);
      numOccurrences.push(1);
    } else {
      console.log('found');
      console.log(i);
      console.log(modes[i]);
      console.log(loopedModeNos.indexOf(modes[i]));
      loopedModeNos.push(modes[i]);
      numOccurrences.push(0);
      numOccurrences[loopedModeNos.indexOf(modes[i])] += 1;
    }
  }
  console.log(modes);
  console.log(loopedModeNos);
  console.log(numOccurrences);

  for (i in modes) {
    if (i[modes.indexOf(i)] !== max(numOccurrences)) {

    }
  }

  // Calculate range
  let range = [];
  const min = sortedData[0];
  const max = sortedData[lastData];
  range.push(min, max);

  // Calculate variance and standard deviation
  let sqDiffFromMean = [];
  let sqDifference = 0;
  for (i in data) {
    sqDifference = Math.pow((data[i] - mean), 2);
    sqDiffFromMean.push(sqDifference);
  }
  let variance = 0;
  for (i in sqDiffFromMean) {
    variance += sqDiffFromMean[i];
  }
  variance /= dof;
  let stDev = Math.sqrt(variance);

  // Calculate standard error
  let stErr = stDev / Math.sqrt(dataLength);

  // Calculate confidence interval
  let lowerBound = mean - (tStat * stErr);
  let upperBound = mean + (tStat * stErr);

  // Round numbers
  variance = variance.toFixed(roundTo);
  stDev = stDev.toFixed(roundTo);
  stErr = stErr.toFixed(roundTo);
  lowerBound = lowerBound.toFixed(roundTo);
  upperBound = upperBound.toFixed(roundTo);

  // Compile and return results
  return {dataType: dataType,
          n: dataLength,
          dof: dof,
          mean: mean,
          median: median,
          mode: modes,
          min: min,
          max: max,
          variance: variance,
          stDev: stDev,
          stErr: stErr,
          confLevel: confLevel,
          lowerBound: lowerBound,
          upperBound: upperBound
        }
};

// Set up function to print results
const printResults = (results) => {
  boxSummary.innerHTML = `${results.dataType} of ${results.n} observations`
  boxMean.innerHTML = `${results.mean}`
  boxMedian.innerHTML = `${results.median}`
  boxMode.innerHTML = `${results.mode}`
  boxRange.innerHTML = `[${results.min}, ${results.max}]`
  boxVariance.innerHTML =`${results.variance}`
  boxStDev.innerHTML = `${results.stDev}`
  boxStErr.innerHTML = `${results.stErr}`
  boxConfInt.innerHTML = `${results.confLevel}% Confidence Level:`
  boxConfLevel.innerHTML = `[${results.lowerBound}, ${results.upperBound}]`
};

/*

boxMedian
boxMode
boxRange
boxVariance
boxStDev
boxStErr
boxConfInt
*/


// Start script once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initialiseDomVariables();
  setUpOnClick();
})

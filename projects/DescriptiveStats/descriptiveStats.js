// Calculate descriptive statistics for a list of numbers
// By Ted Silbernagel

// Declare variables so they're global
let resultsTable, boxSummary, boxMean, boxMedian, boxMode, boxRange;
let boxVariance, boxStDev, boxStErr, boxConfInt, boxConfLevel;
let i;

// Set up keyUp and button listeners to auto calculate
const checkLastKey = () => {
  let entryBoxValue = document.getElementById('userData').value;

  // First show the table
  if (entryBoxValue.length === 0) {
    resultsTable.style.display = 'none';
  } else {
    resultsTable.style.display = 'table';
  }

  const regexToTest = /[a-z]|[0-9]/i;
  if (regexToTest.test(entryBoxValue.substr(-1))) {
    runDescriptiveStats();
  }
}
const setUpKeyUpListener = () => {
  document.getElementById('userData').onkeyup = () => { checkLastKey(); };
  document.getElementById('userData').onchange = () => { checkLastKey(); };
}
const setUpButtonListeners = () => {
  document.getElementById('dataTypeButtonS').onchange = () => { checkLastKey(); };
  document.getElementById('dataTypeButtonP').onchange = () => { checkLastKey(); };
  document.getElementById('confLevelButton90').onchange = () => { checkLastKey(); };
  document.getElementById('confLevelButton95').onchange = () => { checkLastKey(); };
  document.getElementById('confLevelButton99').onchange = () => { checkLastKey(); };
}

// Set up variables to hold DOM elements
const initialiseDomVariables = () => {
  resultsTable = document.getElementById('resultsTable');
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

// Set up function to get data from user
const getUserData = () => {
  let userData = document.getElementById('userData').value;
  let dataType = document.querySelector('input[name="dataType"]:checked').value;
  let confLevel = document.querySelector('input[name="confLevel"]:checked').value;
  return {userData: userData,
          dataType: dataType,
          confLevel: confLevel}
}

// Set up function to run the process and display results
const runDescriptiveStats = () => {
  printResults(descriptiveStats(getUserData()));
}

// Set up function to calculate mode
const calcMode = (data) => {
  let modes = data;
  let modeString = 'None';
  let loopedModeNos = [];
  let numOccurrences = [];
  // Get the number of occurrences per number
  for (i in modes) {
    if (loopedModeNos.indexOf(modes[i]) === -1) {
      loopedModeNos.push(modes[i]);
      numOccurrences.push(1);
    } else {
      loopedModeNos.push(modes[i]);
      numOccurrences.push(0);
      numOccurrences[loopedModeNos.indexOf(modes[i])] += 1;
    }
  }
  // If no occurrences less than 0, set to empty array
  let maxMode = 0;
  for (i in numOccurrences) {
    if (numOccurrences[i] > maxMode) {
      maxMode = numOccurrences[i];
    }
  }
  if (maxMode > 1) {
    // Remove all numbers with occurrences less than max
    for (i = modes.length - 1; i >= 0; i--) {
      if (numOccurrences[modes.indexOf(modes[i])] !== Math.max(...numOccurrences)) {
        loopedModeNos.splice(i, 1);
      }
    }
    // Remove duplicates
    modes = [...new Set(loopedModeNos)];
    // Put modes into string
    modeString = '';
    for (i in modes) {
      if (modes.length == 1) {
        modeString = modes[0];
      } else if (i == 0) {
        modeString += '[' + modes[i];
      } else if (i == modes.length - 1) {
        modeString += ', ' + modes[i] + ']';
      } else {
        modeString += ', ' + modes[i];
      }
    }
  }
  return modeString;
}

// Set up function to compute the statistics
const descriptiveStats = (values) => {
  // Set up incoming variables
  let data = values.userData.split(",");
  for (i in data) {
    data[i] = parseFloat(data[i]);
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
  let mean = sum / dataLength;

  // Calculate median
  let sortedData = data.sort();
  let median = 0;

  if (dataLength % 2 === 0) {
    median = (sortedData[dataLength / 2 - 1] + sortedData[dataLength / 2]) / 2;
  } else {
    median = sortedData[(lastData) / 2];
  }

  // Calculate mode
  let modeString = calcMode(data);

  // Calculate range
  let range = [];
  const min = sortedData[0];
  const max = sortedData[lastData];
  range.push(min, max);

  // Calculate variance
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

  // Calculate standard deviation
  variance /= dof;
  let stDev = Math.sqrt(variance);

  // Calculate standard error
  let stErr = stDev / Math.sqrt(dataLength);

  // Calculate confidence interval
  let lowerBound = mean - (tStat * stErr);
  let upperBound = mean + (tStat * stErr);

  // Round numbers
  mean = mean.toFixed(roundTo);
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
          mode: modeString,
          min: min,
          max: max,
          variance: variance,
          stDev: stDev,
          stErr: stErr,
          confLevel: confLevel,
          lowerBound: lowerBound,
          upperBound: upperBound};
};

// Set up function to print results
const printResults = (results) => {
  boxSummary.innerHTML = `<b>${results.dataType} of ${results.n} observations</b>`
  boxMean.innerHTML = `${results.mean}`
  boxMedian.innerHTML = `${results.median}`
  boxMode.innerHTML = `${results.mode}`
  boxRange.innerHTML = `[${results.min}, ${results.max}]`
  boxVariance.innerHTML =`${results.variance}`
  boxStDev.innerHTML = `${results.stDev}`
  boxStErr.innerHTML = `${results.stErr}`
  boxConfInt.innerHTML = `${results.confLevel}% Confidence Interval:`
  boxConfLevel.innerHTML = `[${results.lowerBound}, ${results.upperBound}]`
};

// Start script once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initialiseDomVariables();
  setUpKeyUpListener();
  setUpButtonListeners();
  // Hide results, initially
  resultsTable.style.display = 'none';
})

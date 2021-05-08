// Calculate descriptive statistics for a list of numbers
// By Ted Silbernagel

// Declare variables so they're global.
let resultsTable: HTMLElement;
let boxSummary: HTMLElement;
let boxMean: HTMLElement;
let boxMedian: HTMLElement;
let boxMode: HTMLElement;
let boxRange: HTMLElement;
let boxVariance: HTMLElement;
let boxStDev: HTMLElement;
let boxStErr: HTMLElement;
let boxConfInt: HTMLElement;
let boxConfLevel: HTMLElement;

// Interfaces.
interface UserData {
  userData: string;
  dataType: string;
  confLevel: string;
}
interface DescriptiveStatsData {
  dataType: string;
  n: number;
  dof: number;
  mean: string;
  median: number;
  mode: string;
  min: number;
  max: number;
  variance: string;
  stDev: string;
  stErr: string;
  confLevel: number;
  lowerBound: string;
  upperBound: string;
}

/**
 * Sum reducer function.
 * sum = array.reduce(reducer);
 */
const reducer = (accumulator: number, currentValue: number) => {
  return accumulator + currentValue;
};

/** Set up keyUp and button listeners to auto calculate. */
const checkLastKey = () => {
  const userDataElement = <HTMLInputElement>document.getElementById('userData');
  const entryBoxValue = userDataElement.value;

  // First show the table
  resultsTable.style.display = entryBoxValue.length === 0 ? 'none' : 'table';

  if (/[a-z]|[0-9]/i.test(entryBoxValue.substr(-1))) {
    runDescriptiveStats();
  }
};
const setUpKeyUpListener = () => {
  document.getElementById('userData').onkeyup = () => {
    checkLastKey();
  };
  document.getElementById('userData').onchange = () => {
    checkLastKey();
  };
};
const setUpDescriptiveStatsButtonListeners = () => {
  document.getElementById('dataTypeButtonS').onchange = () => {
    checkLastKey();
  };
  document.getElementById('dataTypeButtonP').onchange = () => {
    checkLastKey();
  };
  document.getElementById('confLevelButton90').onchange = () => {
    checkLastKey();
  };
  document.getElementById('confLevelButton95').onchange = () => {
    checkLastKey();
  };
  document.getElementById('confLevelButton99').onchange = () => {
    checkLastKey();
  };
};

/** Set up variables to hold DOM elements. */
const initialiseDescriptiveStatsDomVariables = () => {
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
};

/** Get data from user. */
const getUserData = () => {
  const userDataElement = <HTMLInputElement>document.getElementById('userData');
  const dataTypeElement = <HTMLInputElement>document.querySelector(
      'input[name="dataType"]:checked');
  const confLevelElement = <HTMLInputElement>document.querySelector(
      'input[name="confLevel"]:checked');
  return {
    userData: userDataElement.value,
    dataType: dataTypeElement.value,
    confLevel: confLevelElement.value,
  };
};

/** Run the process and display results. */
const runDescriptiveStats = () => {
  printResults(descriptiveStats(getUserData()));
};

/** Calculate mode. */
const calcMode = (data: Array<number>) => {
  let modes: Array<number> = data;
  let modeString = 'None';
  const loopedModeNos: Array<number> = [];
  const numOccurrences: Array<number> = [];
  // Get the number of occurrences per number
  for (const mode of modes) {
    if (loopedModeNos.indexOf(mode) === -1) {
      loopedModeNos.push(mode);
      numOccurrences.push(1);
    } else {
      loopedModeNos.push(mode);
      numOccurrences.push(0);
      numOccurrences[loopedModeNos.indexOf(mode)] += 1;
    }
  }
  // If no occurrences less than 0, set to empty array
  let maxMode = 0;
  for (const occurrence of numOccurrences) {
    if (occurrence > maxMode) {
      maxMode = occurrence;
    }
  }
  if (maxMode > 1) {
    // Remove all numbers with occurrences less than max
    for (let i = modes.length - 1; i >= 0; i--) {
      if (numOccurrences[modes.indexOf(modes[i])] !==
          Math.max(...numOccurrences)) {
        loopedModeNos.splice(i, 1);
      }
    }
    // Remove duplicates
    modes = [...new Set(loopedModeNos)];
    // Put modes into string
    modeString = '';
    for (const i in modes) {
      if (modes.length == 1) {
        modeString = modes[0].toString();
      } else if (parseInt(i, 10) === 0) {
        modeString += '[' + modes[i];
      } else if (parseInt(i, 10) === modes.length - 1) {
        modeString += ', ' + modes[i] + ']';
      } else {
        modeString += ', ' + modes[i];
      }
    }
  }
  return modeString;
};

/** Compute the statistics. */
const descriptiveStats = (values: UserData) => {
  // Set up incoming variables
  const data: Array<number> = [];
  for (const value of values.userData.split(',')) {
    data.push(parseFloat(value));
  }
  const dataType: string = values.dataType;
  const confLevel = parseInt(values.confLevel, 10);

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
  let dof = 0;
  if (dataType === 'Sample') {
    dof = data.length - 1;
  } else if (dataType === 'Population') {
    dof = data.length;
  }

  // Calculate mean
  const mean = data.reduce(reducer) / data.length;

  // Calculate median
  const sortedData = data.sort((a, b) => {
    return a - b;
  });
  let median = 0;

  if (data.length % 2 === 0) {
    const lowerIndex = (data.length / 2) - 1;
    median = (sortedData[lowerIndex] + sortedData[lowerIndex + 1]) / 2;
  } else {
    median = sortedData[(data.length - 1) / 2];
  }

  // Calculate mode
  const modeString = calcMode(data);

  // Calculate range
  const min = sortedData[0];
  const max = sortedData[data.length - 1];

  // Calculate variance
  const sqDiffFromMean = [];
  for (const num of data) {
    sqDiffFromMean.push(Math.pow((num - mean), 2));
  }
  const variance = sqDiffFromMean.reduce(reducer) / dof;

  // Calculate standard deviation
  const stDev = Math.sqrt(variance);

  // Calculate standard error
  const stErr = stDev / data.length;

  // Calculate confidence interval
  const lowerBound = mean - (tStat * stErr);
  const upperBound = mean + (tStat * stErr);

  // Compile and return results
  return {
    dataType: dataType,
    n: data.length,
    dof: dof,
    mean: mean.toFixed(roundTo),
    median: median,
    mode: modeString,
    min: min,
    max: max,
    variance: variance.toFixed(roundTo),
    stDev: stDev.toFixed(roundTo),
    stErr: stErr.toFixed(roundTo),
    confLevel: confLevel,
    lowerBound: lowerBound.toFixed(roundTo),
    upperBound: upperBound.toFixed(roundTo),
  };
};

/** Print results. */
const printResults = (results: DescriptiveStatsData) => {
  boxSummary.innerHTML =
      `<b>${results.dataType} of ${results.n} observations</b>`;
  boxMean.innerHTML = `${results.mean}`;
  boxMedian.innerHTML = `${results.median}`;
  boxMode.innerHTML = `${results.mode}`;
  boxRange.innerHTML = `[${results.min}, ${results.max}]`;
  boxVariance.innerHTML = `${results.variance}`;
  boxStDev.innerHTML = `${results.stDev}`;
  boxStErr.innerHTML = `${results.stErr}`;
  boxConfInt.innerHTML = `${results.confLevel}% Confidence Interval:`;
  boxConfLevel.innerHTML = `[${results.lowerBound}, ${results.upperBound}]`;
};

// Start script once DOM is loaded.
document.addEventListener('DOMContentLoaded', () => {
  initialiseDescriptiveStatsDomVariables();
  setUpKeyUpListener();
  setUpDescriptiveStatsButtonListeners();
  // Hide results, initially
  resultsTable.style.display = 'none';
});

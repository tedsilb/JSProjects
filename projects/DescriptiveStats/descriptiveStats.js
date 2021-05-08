let resultsTable;
let boxSummary;
let boxMean;
let boxMedian;
let boxMode;
let boxRange;
let boxVariance;
let boxStDev;
let boxStErr;
let boxConfInt;
let boxConfLevel;
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const checkLastKey = () => {
    const userDataElement = document.getElementById('userData');
    const entryBoxValue = userDataElement.value;
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
const getUserData = () => {
    const userDataElement = document.getElementById('userData');
    const dataTypeElement = document.querySelector('input[name="dataType"]:checked');
    const confLevelElement = document.querySelector('input[name="confLevel"]:checked');
    return {
        userData: userDataElement.value,
        dataType: dataTypeElement.value,
        confLevel: confLevelElement.value,
    };
};
const runDescriptiveStats = () => {
    printResults(descriptiveStats(getUserData()));
};
const calcMode = (data) => {
    let modes = data;
    let modeString = 'None';
    let loopedModeNos = [];
    let numOccurrences = [];
    for (const mode of modes) {
        if (loopedModeNos.indexOf(mode) === -1) {
            loopedModeNos.push(mode);
            numOccurrences.push(1);
        }
        else {
            loopedModeNos.push(mode);
            numOccurrences.push(0);
            numOccurrences[loopedModeNos.indexOf(mode)] += 1;
        }
    }
    let maxMode = 0;
    for (const occurrence of numOccurrences) {
        if (occurrence > maxMode) {
            maxMode = occurrence;
        }
    }
    if (maxMode > 1) {
        for (let i = modes.length - 1; i >= 0; i--) {
            if (numOccurrences[modes.indexOf(modes[i])] !==
                Math.max(...numOccurrences)) {
                loopedModeNos.splice(i, 1);
            }
        }
        modes = [...new Set(loopedModeNos)];
        modeString = '';
        for (const i in modes) {
            if (modes.length == 1) {
                modeString = modes[0].toString();
            }
            else if (parseInt(i, 10) === 0) {
                modeString += '[' + modes[i];
            }
            else if (parseInt(i, 10) === modes.length - 1) {
                modeString += ', ' + modes[i] + ']';
            }
            else {
                modeString += ', ' + modes[i];
            }
        }
    }
    return modeString;
};
const descriptiveStats = (values) => {
    let data = [];
    for (const value of values.userData.split(',')) {
        data.push(parseFloat(value));
    }
    const dataType = values.dataType;
    const confLevel = parseInt(values.confLevel, 10);
    const roundTo = 4;
    let tStat = 0;
    if (confLevel === 90) {
        tStat = 1.64;
    }
    else if (confLevel === 95) {
        tStat = 1.96;
    }
    else if (confLevel === 99) {
        tStat = 2.58;
    }
    let dof = 0;
    if (dataType === 'Sample') {
        dof = data.length - 1;
    }
    else if (dataType === 'Population') {
        dof = data.length;
    }
    const mean = data.reduce(reducer) / data.length;
    const sortedData = data.sort((a, b) => {
        return a - b;
    });
    let median = 0;
    if (data.length % 2 === 0) {
        const lowerIndex = (data.length / 2) - 1;
        median = (sortedData[lowerIndex] + sortedData[lowerIndex + 1]) / 2;
    }
    else {
        median = sortedData[(data.length - 1) / 2];
    }
    const modeString = calcMode(data);
    const min = sortedData[0];
    const max = sortedData[data.length - 1];
    let sqDiffFromMean = [];
    for (const num of data) {
        sqDiffFromMean.push(Math.pow((num - mean), 2));
    }
    const variance = sqDiffFromMean.reduce(reducer) / dof;
    const stDev = Math.sqrt(variance);
    const stErr = stDev / data.length;
    const lowerBound = mean - (tStat * stErr);
    const upperBound = mean + (tStat * stErr);
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
const printResults = (results) => {
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
document.addEventListener('DOMContentLoaded', () => {
    initialiseDescriptiveStatsDomVariables();
    setUpKeyUpListener();
    setUpDescriptiveStatsButtonListeners();
    resultsTable.style.display = 'none';
});

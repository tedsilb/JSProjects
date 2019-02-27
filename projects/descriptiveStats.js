// Calculate descriptive statistics for a list of numbers
// By Ted Silbernagel

const descriptiveStats = (dataType, confLevel, data, roundTo) => {
    // code confidence level, if exists
    let tStat = 0;
    let confLevelCoded = 0;
    if (confLevel === 0.90 || confLevel === 90) {
        tStat = 1.64;
        confLevelCoded = 90;
    } else if (confLevel === 0.95 || confLevel === 95) {
        tStat = 1.96;
        confLevelCoded = 95;
    } else if (confLevel === 0.99 || confLevel === 99) {
        tStat = 2.58;
        confLevelCoded = 99;
    } else {
        console.log('Enter a confidence level (90, 95, 99).');
        document.write('<h3 style="color:red;">Error, check console</h3>');
    }

    // code data type (sample or population)
    const dataTypeLower = dataType.toLowerCase();
    let dataTypeCoded = '';
    if (dataTypeLower === 's' || dataTypeLower === 'sample') {
        dataTypeCoded = 'Sample';
    } else if (dataTypeLower === 'p' || dataTypeLower === 'population') {
        dataTypeCoded = 'Population';
    } else {
        console.log('Enter type of data you are providing (sample/population) (s/p)');
        document.write('<h3 style="color:red;">Error, check console</h3>');
    }

    // calculate degrees of freedom
    const dataLength = data.length;
    const lastData = dataLength - 1;
    let dof = 0;
    if (dataTypeCoded === 'Sample') {
        dof = dataLength - 1;
    } else if (dataTypeCoded === 'Population') {
        dof = dataLength;
    } else {
        console.log('Error in DoF calculation.');
        document.write('<h3 style="color:red;">Error, check console.</h3>');
    }

    // calculate sum and mean
    let sum = 0;
    for (let i = 0; i < dataLength; i++) {
        sum += data[i];
    }
    const mean = sum / dataLength;

    // calculate median
    let sortedData = data.sort();
    let median = 0;

    if (dataLength % 2 === 0) {
        median = (sortedData[dataLength / 2 - 1] + sortedData[dataLength / 2]) / 2;
    } else {
        median = sortedData[(lastData) / 2];
    }

    // calculate range
    let range = [];
    const min = sortedData[0];
    const max = sortedData[lastData];
    range.push(min, max);

    // calculate variance and standard deviation
    let sqDiffFromMean = [];
    let sqDifference = 0;
    for (let i = 0; i < dataLength; i++) {
        sqDifference = Math.pow((data[i] - mean), 2);
        sqDiffFromMean.push(sqDifference);
    }
    let variance = 0;
    for (let i = 0; i < dataLength; i++) {
        variance += sqDiffFromMean[i];
    }
    variance /= dof;
    const stDev = Math.sqrt(variance);

    // calculate standard error
    const stErr = stDev / Math.sqrt(dataLength);

    // calculate confidence interval
    const lowerBound = mean - (tStat * stErr);
    const upperBound = mean + (tStat * stErr);

    // parse roundTo value
    roundTo = parseInt(roundTo)

    // compile and return results
    let results = {};
    results.dataType = dataTypeCoded;
    results.n = dataLength;
    results.dof = dof;
    results.mean = mean;
    results.median = median;
    results.range = range;
    results.variance = variance;
    results.stDev = stDev;
    results.stErr = stErr;
    results.confLevel = confLevelCoded;
    results.lowerBound = lowerBound;
    results.upperBound = upperBound;
    return results;
};

const printResults = (results) => {
    const varianceRounded = results.variance.toFixed(roundTo);
    const stDevRounded = results.stDev.toFixed(roundTo);
    const stErrRounded = results.stErr.toFixed(roundTo);
    const lowerBoundRounded = results.lowerBound.toFixed(roundTo);
    const upperBoundRounded = results.upperBound.toFixed(roundTo);

    document.write(`Sample or Population: ${results.dataType}<br />`);
    document.write(`Observations: ${results.n}<br />`);
    document.write(`Degrees of Freedom: ${results.dof}<br />`);
    document.write(`Mean: ${results.mean}<br />`);
    document.write(`Median: ${results.median}<br />`);
    document.write(`Range: [${results.range[0]}, ${results.range[1]}]<br />`);
    document.write(`Variance: ${varianceRounded}<br />`);
    document.write(`Standard Deviation: ${stDevRounded}<br />`);
    document.write(`Standard Error: ${stErrRounded}<br />`);
    document.write(`Confidence Level: ${results.confLevel}%<br />`);
    document.write(`Lower Bound: ${lowerBoundRounded}<br />`);
    document.write(`Upper Bound: ${upperBoundRounded}<br />`);
};

// Run descriptive stats on a set of data
const testType1 = 'sample';
const testConfInt1 = 0.95;
const testData1 = [44, 46, 30, 24, 31, 47, 27, 26, 41, 22, 21, 34, 48, 38, 38, 24, 40, 31, 40, 19];

printResults(descriptiveStats(testType1, testConfInt1, testData1));

// Separate from the next set of data
document.write('<br />');

// Run descriptive stats on another set of data
const testType2 = 'p';
const testConfInt2 = 99;
const testData2 = [23, 13, 19, 16, 22, 20, 29, 20, 16, 21, 28, 15, 18, 20, 13, 27, 13, 17, 26, 17];

printResults(descriptiveStats(testType2, testConfInt2, testData2));
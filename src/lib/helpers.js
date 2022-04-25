const getGreaterCommonFactor = (k, n) => {
	return k ? getGreaterCommonFactor(n % k, k) : n;
};

const countVowels = (str) => { 
	return str.match(/[aeiou]/gi).length;
};

const countConsonants = (str) => {
	return str.match(/[^aeiou ]/gi).length;
}

const printResults = (results) => {
	const totalScore = results.reduce((totalScore, result) => totalScore + parseFloat(result.score), 0);
	console.log('Total SS:', totalScore);
	results.forEach((result) => {
		console.log(`Shipment address: ${result.shipmentName} - Driver's name: ${result.driverName} - Score: ${result.score}`)
	});
}

module.exports = {
	getGreaterCommonFactor,
	countVowels,
	countConsonants,
	printResults
};
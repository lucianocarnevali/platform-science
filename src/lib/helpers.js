const getGreaterCommonFactor = (k, n) => {
	return k ? getGreaterCommonFactor(n % k, k) : n;
};

const countVowels = (str) => { 
	return str.match(/[aeiou]/gi).length;
};

const countConsonants = (str) => {
	return str.match(/[^aeiou ]/gi).length;
}

module.exports = {
	getGreaterCommonFactor,
	countVowels,
	countConsonants
};
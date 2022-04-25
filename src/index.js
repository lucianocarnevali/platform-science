#! /usr/bin/env node
const { getGreaterCommonFactor, countVowels, countConsonants } = require('./lib/helpers.js');
const { COMMON_FACTOR, EVEN, ODD } = require('./lib/constants.js');

const cli = require('commander');
const pkg = require('../package.json');
const yargs = require("yargs");
const fs = require('fs');


cli.name(pkg.name)
	.description(pkg.description)
	.version(pkg.version);


const options = yargs
	.usage("Usage: -s <shipments>")
	.option("s", { alias: "shipments", describe: "Shipment destinations", type: "string", demandOption: true })
	.usage("Usage: -d <drivers>")
	.option("d", { alias: "drivers", describe: "Drivers names", type: "string", demandOption: true })
		.argv;

// console.log(options);

const shipmentsFile = options.shipments;
const driversFile = options.drivers;

if (!fs.existsSync(shipmentsFile)) {
	console.log('The shipments path is incorrect');
	process.exit();
}
if (!fs.existsSync(driversFile)) {
	console.log('The drivers path is incorrect');
	process.exit();
}

let shipments = [];
let drivers = [];
try {
	const driversData = fs.readFileSync(driversFile).toString().split("\n");
	for (let i in driversData) {
		const name = driversData[i].replace(/\r?\n|\r/g, '');
		const driver = {
			name,
			vowelsScore: countVowels(name) * EVEN,
			consonantsScore: countConsonants(name) * ODD
		};
		drivers.push(driver);
	}

	const shipmentsData = fs.readFileSync(shipmentsFile).toString().split("\n");
	for (let i in shipmentsData) {	
		const name = shipmentsData[i].replace(/\r?\n|\r/g, '');
		const shipment = {
			name,
			even: name.length % 2 == 0,
		};
		shipments.push(shipment);
	}
} catch(err) {
  console.error(err);
}

if (shipments.length !== drivers.length) {
	console.log('The rows quantity of both files need to be the same');
	process.exit();
}


console.log('results', results);

console.log('end');

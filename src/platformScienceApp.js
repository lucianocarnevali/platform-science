const { getGreaterCommonFactor, countVowels, countConsonants, printResults } = require('./lib/helpers.js');
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

const shipmentsFilePath = options.shipments;
const driversFilePath = options.drivers;

// Check files path
if (!fs.existsSync(shipmentsFilePath)) {
	console.log('The shipments path is incorrect');
	process.exit();
}
if (!fs.existsSync(driversFilePath)) {
	console.log('The drivers path is incorrect');
	process.exit();
}

// Read files
let shipments = [];
let drivers = [];
try {
	const driversData = fs.readFileSync(driversFilePath).toString().split("\n");
	for (let i in driversData) {
		const name = driversData[i].replace(/\r?\n|\r/g, '');
		const driver = {
			name,
			vowelsScore: countVowels(name) * EVEN,
			consonantsScore: countConsonants(name) * ODD
		};
		drivers.push(driver);
	}

	const shipmentsData = fs.readFileSync(shipmentsFilePath).toString().split("\n");
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

// Top-secret algorithm maximize the total suitability 
const results = [];
while(shipments.length !== results.length) {

	shipments.forEach((shipment) => {
		const shipmentAssigned = results.find((s) => s.shipmentName === shipment.name);
		if (!shipmentAssigned) {

			let assigned = false;
			const driversCopy = drivers.map((driver) => driver);

			while(!assigned) {
				const optimusDriver = driversCopy.reduce((prev, current) => {
					let prevScore = shipment.even ? prev.vowelsScore : prev.consonantsScore;
					if (getGreaterCommonFactor(prev.name.length, shipment.name.length) > 1) {
						prevScore *= COMMON_FACTOR;
					}
					let currentScore = shipment.even ? current.vowelsScore : current.consonantsScore;
					if (getGreaterCommonFactor(current.name.length, shipment.name.length) > 1) {
						currentScore *= COMMON_FACTOR;
					}
					if (prevScore > currentScore) {
						return prev;
					}
					return current;
				});

				let score = shipment.even ? optimusDriver.vowelsScore : optimusDriver.consonantsScore;
				if (getGreaterCommonFactor(optimusDriver.name.length, shipment.name.length) > 1) {
					score *= COMMON_FACTOR;
				}
				const driverAssigned = results.find((r) => r.driverName === optimusDriver.name);

				if (driverAssigned && driverAssigned.score >= score) {
					driversCopy.splice(driversCopy.indexOf(optimusDriver), 1);
				} else {
					if (driverAssigned) {
						results.splice(results.indexOf(driverAssigned), 1);
					}
					const result = {
						driverName: optimusDriver.name,
						shipmentName: shipment.name,
						score
					};
					results.push(result);
					assigned = true;
				}
			}
		}
	});
}

printResults(results);
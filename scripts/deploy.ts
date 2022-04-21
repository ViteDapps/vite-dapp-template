import { expect } from 'chai';
const vuilder = require('@vite/vuilder');
import config from './deploy.config.json';

async function run(): Promise<void> {
	const provider = vuilder.newProvider(config.http);
	console.log(await provider.request('ledger_getSnapshotChainHeight'));
	const deployer = vuilder.newAccount(config.mnemonic, 0, provider);

	// compile
	const compiledContracts = await vuilder.compile('ExampleContract.solpp');
	expect(compiledContracts).to.have.property('ExampleContract');

	// deploy
	let cafe = compiledContracts.ExampleContract;
	cafe.setDeployer(deployer).setProvider(provider);
	await cafe.deploy({});
	expect(cafe.address).to.be.a('string');
	console.log(cafe.address);

	// stake quota
	// await deployer.stakeForQuota({beneficiaryAddress: cafe.address, amount:"2001000000000000000000"});

	return;
}

run().then(() => {
	console.log('done');
});
import * as dotenv from 'dotenv';
dotenv.config()

import readUserInput from './readUserInput';
import swap from './swap';
import ibcTransfer from './ibc-transfer'

async function getBalance(val: string) {
    console.log('***** ' + val);
}

(async function main() {

    while(true) {
        const name = await readUserInput('Which one to choose?\n1.balance\n2.approve\n3.swap\n4.getReserves\n5.getAllReserves\n6.getAllPairs\nX.quit\n> ');
    	switch (name) {
            case '1':
		await getBalance('1');
		break;
	    case '2':
		await ibcTransfer(1); 
		break;
	    case '3':
		await swap(1);
		break;
            case 'X':
		return;
	    default:
	}
    }

})();

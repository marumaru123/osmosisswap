import * as dotenv from 'dotenv';
dotenv.config()

import readUserInput from './readUserInput';
import swap from './swap';
import ibcTransfer3 from './ibc-transfer3'
import Tokens from './Tokens'

async function getTokenFromUserInput(tokens: any) {
    const userInput: any = await readUserInput('Which one?\n' + await tokens.toString() + '\n> ');
    let   token     = await tokens.getTokenFromIndex(Number(userInput) - 1);
    return token;
}

async function getBalance(tokens: any) {
    var tokenList = new Array();
    let token = await getTokenFromUserInput(tokens);
    while(typeof token !== "undefined") {
        tokenList.push(token);
	token = await getTokenFromUserInput(tokens);
    }
    if (tokenList.length != 0) {
        console.log(tokenList);
    } else {
        console.log('*****');
    }
}

async function ibcTransfer2(tokens: any) {
    const val = await readUserInput('How value?\n> ');
    let token = await getTokenFromUserInput(tokens);
    if (typeof token !== "undefined") {
	await ibcTransfer3(token, val); 
    }
}

(async function main() {

    let tokens = await Tokens.build();
    console.log(tokens);

    while(true) {
        const name = await readUserInput('Which one to choose?\n1.balance\n2.approve\n3.swap\n4.getReserves\n5.getAllReserves\n6.getAllPairs\nX.quit\n> ');
    	switch (name) {
            case '1':
		await getBalance(tokens);
		break;
	    case '2':
		await ibcTransfer2(tokens); 
		break;
	    case '3':
		await swap(1);
		break;
            case 'X':
		return;
            case '':
		return;
	    default:
		console.log("|" + name + "|");
	}
    }

})();

import * as dotenv from 'dotenv';
dotenv.config()

import readUserInput from './readUserInput';
import swap2 from './swap2';
import ibcTransfer3 from './ibc-transfer3'
import getbalance2 from './get-balance'
import Tokens from './Tokens'

async function getTokenFromUserInput(tokens: any) {
    const userInput: any = await readUserInput('Which one?\n' + await tokens.toString() + '\n> ');
    let   token     = await tokens.getTokenFromIndex(Number(userInput) - 1);
    return token;
}

async function swap11(tokens: any) {
    let token0 = await getTokenFromUserInput(tokens);
    if (typeof token0 === "undefined") {
        return;
    }
    let token1 = await getTokenFromUserInput(tokens);
    if (typeof token1 === "undefined") {
        return;
    }
    const val = await readUserInput('How value?\n> ');
    await swap2([token0,token1], val); 
}

async function getBalance(tokens: any) {
    await getbalance2(tokens, 2);
	/*
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
   */
}

async function ibcTransfer2(tokens: any) {
    let token = await getTokenFromUserInput(tokens);
    if (typeof token !== "undefined") {
        const val = await readUserInput('How value?\n> ');
	await ibcTransfer3(token, val); 
    }
}

(async function main() {

    let tokens = await Tokens.build();
    console.log(tokens);

    while(true) {
        const name = await readUserInput('Which one to choose?\n1.balance\n2.ibc transfer\n3.swap\n4.getReserves\n5.getAllReserves\n6.getAllPairs\nX.quit\n> ');
    	switch (name) {
            case '1':
		await getBalance(tokens);
		break;
	    case '2':
		await ibcTransfer2(tokens); 
		break;
	    case '3':
		await swap11(tokens);
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

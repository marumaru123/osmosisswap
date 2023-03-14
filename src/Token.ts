//import fs from 'fs';
//import { getWeb3, getUnit } from './web3utils.mjs';

//const IERC20 = JSON.parse(fs.readFileSync('abis/IERC20.json', 'utf8'))["abi"];

export default class Token {
    private name: any;
    private ibcdenom: any;
    private decimals: any;

    constructor() {
//	this.contract  = null;
    }

    static async build(name: any, config: any) {
	const token    = new Token();
	token.name     = name;
	token.ibcdenom = config["IBCDenom"];
	token.decimals = config["decimals"];
	return token;
    }

    async getIbcdenom() {
        return this.ibcdenom;
    }

    async getDecimals() {
        return this.decimals;
    }

}

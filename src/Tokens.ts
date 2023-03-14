import * as fs from 'fs';
import Token from './Token';

export default class Tokens {
    private config: any;
    private tokenMap: any;
    private tokenList: any;

    constructor() {
        this.config = null;
	this.tokenMap = null;
//	this.tokenAddressMap = null;
        this.tokenList = null;
    }

    static async build() {
        const tokens = new Tokens();
	tokens.config = JSON.parse(fs.readFileSync('./src/token.json', 'utf8'));
	//console.log(tokens.config);
	tokens.tokenMap = new Map();
//	tokens.tokenAddressMap = new Map();
        tokens.tokenList = new Array();
	for (let key in tokens.config) {
        //for (let i = 0; i < tokens.config.length; i++) {
            const token = await Token.build(key, tokens.config[key]);
            tokens.tokenMap.set(key, token);
//	    tokens.tokenAddressMap.set(tokens.config[key], token);
            tokens.tokenList.push(token);
        }
        return tokens;
    }

    async toString() {
        var _array = [];
        var i = 1;
	for (let key in this.config) {
            _array.push(i + "." + key);
            i++;
        }
        return _array.join("\n");
    }

    async getTokenFromIndex(i: number) {
	return this.tokenList[i];
    }

    async getTokenFromName(name: string) {
	return this.tokenMap.get(name);
    }

  //  async getTokenFromAddress(address) {
//	return this.tokenAddressMap.get(address);
 //   }

}

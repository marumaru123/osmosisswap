import * as dotenv from 'dotenv';
dotenv.config()

import { chains } from 'chain-registry';
import { getOfflineSignerAmino } from 'cosmjs-utils';
import { osmosis, FEES, getSigningIbcClient, ibc } from 'osmojs';
//import Long from 'long';
import { coins, coin } from '@cosmjs/amino';
import { getSigningOsmosisClient} from '@cosmology/core';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { assertIsDeliverTxSuccess } from '@cosmjs/stargate';
import { Dec, DecUtils, Int, IntPretty } from "@keplr-wallet/unit";

const {
  transfer
} = ibc.applications.transfer.v1.MessageComposer.withTypeUrl;
const rpcEndpoint = 'https://rpc.osmosis.zone/';
const restEndpoint = 'https://lcd.osmosis.zone/';

const mnemonic: string = process.env.MNEMONIC as string;
const _sender: string   = process.env.SENDER as string;
const _receiver: string = process.env.RECEIVER as string;

const { createRPCQueryClient } = osmosis.ClientFactory;

export default async(tokens:any, val: any) => {
	console.log(tokens.getTokenFromDenom('ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858'));

    const client = await createRPCQueryClient({ rpcEndpoint });

    const balance = await client.cosmos.bank.v1beta1.allBalances({ address: _sender });
    const display = await Promise.all(balance.balances.map(async function (_ref2) {

        var denom = _ref2.denom,
            amount = _ref2.amount;

        var token = await tokens.getTokenFromDenom(denom);
	console.log(token);
        var symbol = token != null ? await token.getName() : '';
	const a = new IntPretty(new Dec(amount));
	const decimals = token != null ? await token.getDecimals() : '';
	const decimals2 = decimals != '' ? await (decimals * -1) : 1;
	var displayAmount = a.moveDecimalPointRight(decimals2).maxDecimals(16).locale(false).toString();
	//var displayAmount = await a.moveDecimalPointRight(decimals2).toString();
	console.log(symbol, displayAmount);
	return {
	    symbol: symbol,
	    denom: denom,
	    amount: amount,
	    displayAmount: displayAmount
	};

    }));
    //console.log(display);

}

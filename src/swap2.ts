import * as dotenv from 'dotenv';
dotenv.config()

/*import {
  printOsmoTransactionResponse,
  prompt,
  promptChain,
  promptRpcEndpoint,
  promptMnemonic
} from './utils';
*/

import { 
  lookupRoutesForTrade,
  getPoolsPricesPairs,
  calculateAmountWithSlippage,
  getBalancerPools,
  noDecimals
} from '@cosmology/core';

import { chains } from 'chain-registry';
import { osmosis, FEES } from 'osmojs';
import { coin } from '@cosmjs/amino';
import { getSigningOsmosisClient} from '@cosmology/core';
import { signAndBroadcast } from 'cosmjs-utils';
import { getOfflineSignerAmino } from 'cosmjs-utils';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Dec, DecUtils, Int, IntPretty } from "@keplr-wallet/unit";

//import Long from 'long';

const {
  swapExactAmountIn
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

const rpcEndpoint = 'https://rpc.osmosis.zone/';

const mnemonic: string = process.env.MNEMONIC as string;
const _sender: string   = process.env.SENDER as string;
const _receiver: string = process.env.RECEIVER as string;

export default async function(tokens: any, val: any) {

  //console.log("aiueo");
  //const mnemonic = 'idle city coral print adjust tape own mom situate woman devote win';
  //const chain = await promptChain(argv);
  const chain = chains.find(({ chain_name }) => chain_name === 'osmosis');
  if (!chain) {
    return;
  }
  if (!chain.apis) {
    return;
  }
  if (!chain.apis.rpc) {
    return;
  }
  //const rpcEndpoint = await promptRpcEndpoint(chain.apis.rpc.map((e) => e.address), argv);

  const client = await osmosis.ClientFactory.createRPCQueryClient({ rpcEndpoint });
  const signer = await getOfflineSignerAmino({ mnemonic, chain });
  //console.log("aiueo");

  //const address = 'osmo1avzsxy2rvpldcxnnklrsevd5rjlkt72d0hsuuh';
  const address = _sender;

  const {
    pools,
    prices,
    pairs,
    prettyPools
  } = await getPoolsPricesPairs(client);
  const balancerPools = await getBalancerPools(client);
  balancerPools.map((val2: any) => {
	  console.log(val2.poolAssets[0].token.denom, val2.poolAssets[1].token.denom);
  });
  //console.log(balancerPools);

  const decimals = await tokens[0].getDecimals();
  const _denom0 = await tokens[0].getIbcdenom();
  const _symbol0 = await tokens[0].getName();
  const actualAmount = (() => {
      let dec = new Dec(val);
      dec = dec.mul(DecUtils.getPrecisionDec(decimals));
      return dec.truncate().toString();
  })();
  const tokenIn = {
    denom : _denom0
  }
  const tokenInAmount = actualAmount; // 0.01 USDC

  const value = '1';

  const _denom1 = await tokens[1].getIbcdenom();
  const _symbol1 = await tokens[1].getName();
  const tokenOut = {
    //denom : 'ibc/D38BB3DD46864694F009AF01DA5A815B3A875F8CC52FF5679BFFCC35DC7451D5'
    denom : _denom1 
  }
  const tokenOutAmount = '1';
  //console.log(pairs);

  const routes = lookupRoutesForTrade({
//    pools,
    trade: {
      sell: {
        denom: tokenIn.denom,
        amount: tokenInAmount,
        displayAmount: '',
        value: '',
        symbol: _symbol0
      },
      buy: {
        denom: tokenOut.denom,
        amount: tokenOutAmount,
        displayAmount: '',
        value: '',
        symbol: _symbol1
      },
      beliefValue: value
    },
    pairs
  }).map((tradeRoute) => {
    const {
      poolId,
      tokenOutDenom
    } = tradeRoute;
    console.log(poolId);
    return {
      poolId,
      tokenOutDenom
    };
  });
  console.log(routes);
/*
  const slippage = 1;
  console.log("aiueo");

  const tokenOutMinAmount = calculateAmountWithSlippage(
//    buy.amount,
    tokenOutAmount,
    slippage
  );
  console.log("aiueo");
  console.log(tokenInAmount);
  console.log(tokenOutMinAmount);
  
//  const fee = FEES.osmosis.swapExactAmountIn(argv.fee || 'low'); // low, medium, high
  const fee = FEES.osmosis.swapExactAmountIn('low'); // low, medium, high
  const _in111 = noDecimals(tokenInAmount);
  const _out111 = noDecimals(tokenOutMinAmount);
  console.log(_in111, _out111);
  const msg = swapExactAmountIn({
    sender: address, // osmo address
    routes, // TradeRoute 
    tokenIn: coin(_in111, tokenIn.denom), // Coin
    tokenOutMinAmount: _out111 // number as string with no decimals
  });

  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  })

  const _sequence = stargateClient.getSequence(address);
  const accountNumber = (await _sequence).accountNumber;
  const sequence = (await _sequence).sequence;

  const _txRaw = await stargateClient.sign(
    address,
    [msg],
    fee,
    '', // memo
    {
      accountNumber: accountNumber,
      sequence: sequence,
      chainId: chain.chain_id
    }
  );

  const txBytes = TxRaw.encode(_txRaw).finish();

  const res = await stargateClient.broadcastTx(txBytes);
  
  //printOsmoTransactionResponse(res);
  console.log(res);
 */
  
}

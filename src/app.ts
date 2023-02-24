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
  noDecimals
} from '@cosmology/core';

import { chains } from 'chain-registry';
import { osmosis, FEES } from 'osmojs';
import { coin } from '@cosmjs/amino';
import { getSigningOsmosisClient} from '@cosmology/core';
import { signAndBroadcast } from 'cosmjs-utils';
import { getOfflineSignerAmino } from 'cosmjs-utils';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

const {
  swapExactAmountIn
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;

const rpcEndpoint = 'https://rpc.osmosis.zone/';

const testfunc = async(argv : any) => {

  console.log("aiueo");
  const mnemonic = 'idle city coral print adjust tape own mom situate woman devote win';
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
  console.log("aiueo");

  const address = 'osmo1avzsxy2rvpldcxnnklrsevd5rjlkt72d0hsuuh';

  const {
    pools,
    prices,
    pairs,
    prettyPools
  } = await getPoolsPricesPairs(client);

  const tokenIn = {
    denom : 'ibc/D189335C6E4A68B513C10AB227BF1C1D38C746766278BA3EEB4FB14124F1D858'
  }
  const tokenInAmount = '10000'; // 0.01 USDC

  const value = '1';

  const tokenOut = {
    //denom : 'ibc/D38BB3DD46864694F009AF01DA5A815B3A875F8CC52FF5679BFFCC35DC7451D5'
    denom : 'ibc/BB936517F7E5D77A63E0ADB05217A6608B0C4CF8FBA7EA2F4BAE4107A7238F06'
  }
  const tokenOutAmount = '1442258430000000000';

  const routes = lookupRoutesForTrade({
//    pools,
    trade: {
      sell: {
        denom: tokenIn.denom,
        amount: tokenInAmount,
        displayAmount: '',
        value: '',
        symbol: 'USDC'
      },
      buy: {
        denom: tokenOut.denom,
        amount: tokenOutAmount,
        displayAmount: '',
        value: '',
        symbol: 'ACRE'
      },
      beliefValue: value
    },
    pairs
  }).map((tradeRoute) => {
    const {
      poolId,
      tokenOutDenom
    } = tradeRoute;
    return {
      poolId,
      tokenOutDenom
    };
  });

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
  
}
testfunc(process.argv);

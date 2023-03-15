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
import { Dec, DecUtils, Int } from "@keplr-wallet/unit";

const {
  transfer
} = ibc.applications.transfer.v1.MessageComposer.withTypeUrl;
const rpcEndpoint = 'https://rpc.osmosis.zone/';
const restEndpoint = 'https://lcd.osmosis.zone/';

const mnemonic: string = process.env.MNEMONIC as string;
const _sender: string   = process.env.SENDER as string;
const _receiver: string = process.env.RECEIVER as string;

export default async(token:any, val: any) => {
  console.log(token);
  console.log(val);

  const chain = chains.find(({ chain_name }) => chain_name === 'osmosis');
  const chain2 = chains.find(({ chain_name }) => chain_name === 'acrechain');

  if (!chain) {
    return;
  }
  if (!chain.apis) {
    return;
  }
  if (!chain.apis.rpc) {
    return;
  }
  if (!chain2) {
    return;
  }
  if (!chain2.apis) {
    return;
  }
  if (!chain2.apis.rpc) {
    return;
  }
  const signer  = await getOfflineSignerAmino({ mnemonic, chain });
  const signer2 = await getOfflineSignerAmino({ mnemonic, chain: chain2 });

  const account = (await signer.getAccounts())[0];
  const toAccount = (await signer2.getAccounts())[0];
  const address = account.address;

  const ibcClient = await getSigningIbcClient({
    rpcEndpoint: rpcEndpoint,
    signer: signer
  });

  const client = await osmosis.ClientFactory.createLCDClient({
    restEndpoint: restEndpoint
  });

  const source_port = 'transfer';
  const source_channel = 'channel-490';
  const stamp = Date.now();
  const timeoutInNanos = (stamp + 1.2e+6) * 1e+6; // TODO
  const decimals = await token.getDecimals();
  const actualAmount = (() => {
      let dec = new Dec(val);
      dec = dec.mul(DecUtils.getPrecisionDec(decimals));
      return dec.truncate().toString();
  })();
  const _value = Number(val).toFixed(await token.getDecimals()).split('.');
  const _value2 = _value[0] + _value[1];
  const _denom = await token.getIbcdenom();
  console.log(actualAmount, _denom);
  console.log(_sender);
  console.log(_receiver);
  //console.log(account.address);
  //console.log(toAccount.address);
  const msg = transfer({
    sourcePort: source_port,
    sourceChannel: source_channel,
    token: coin(actualAmount, _denom),
    //{
//      denom: balances[0].denom,
//      amount: balances[0].amount
//      dennom: 'USDC',
//      amount: ''
//    },
    //sender: account.address,
    //receiver: toAccount.address,
    sender: _sender,
    receiver: _receiver,
    timeoutHeight: undefined,
    // timeoutHeight: {
    //     revisionNumber: "1",
    //     revisionHeight: "3670610"
    // },
    // 20 mins in nanos
//    timeoutTimestamp: Long.fromString(timeoutInNanos + '')
    timeoutTimestamp: timeoutInNanos + ''
  });
  const fee = {
    amount: coins(0, 'uosmo'),
    gas: '250000'
  };
/*
  const stargateClient = await getSigningOsmosisClient({
    rpcEndpoint,
    signer
  })
*/
  const _sequence = ibcClient.getSequence(address);
  const accountNumber = (await _sequence).accountNumber;
  const sequence = (await _sequence).sequence;

  const _txRaw = await ibcClient.sign(
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
  const res = await ibcClient.broadcastTx(txBytes);

  await assertIsDeliverTxSuccess(res);
  ibcClient.disconnect();

  //printOsmoTransactionResponse(res);
  console.log(res);

}

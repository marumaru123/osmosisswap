git clone https://github.com/marumaru123/osmosisswap
npm install
vi src/app.ts
vi node_modules/@cosmology/core/types/types.d.ts
update 'USDC' | 'ACRE' | 'CNTO'
export declare type CoinSymbol = 'ATOM' | 'OSMO' | 'ION' | 'AKT' | 'DVPN' | 'IRIS' | 'CRO' | 'XPRT' | 'REGEN' | 'IOV' | 'NGM' | 'EEUR' | 'JUNO' | 'LIKE' | 'USTC' | 'LUNC' | 'BCNA' | 'SCRT' | 'MED' | 'USDC' | 'ACRE' | 'CNTO';
npx ts-node src/main.ts

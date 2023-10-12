import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { SuiClient } from "@mysten/sui.js/client";
import { fromB64 } from "@mysten/sui.js/utils";
import * as dotenv from "dotenv";
dotenv.config();

const pkg = process.env.PACKAGE as string;
const tCap = process.env.TREASURY_CAP as string;

const getClient = () => {
    const pk = fromB64(process.env.PRIVATE_KEY!);
    const pk_array = Array.from(pk);
    pk_array.shift();
    const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(pk_array));
    const address = keypair.toSuiAddress();
    const client = new SuiClient({
      url: "https://fullnode.testnet.sui.io:443",
    });
  
    return { address, keypair, client };
  };


const mintCoins = async () => {
    const {address, keypair, client} = getClient();

    const tx = new TransactionBlock();

    const alcCoins = tx.moveCall({
        target: `0x2::coin::mint`,
        arguments: [tx.object(tCap), tx.pure.u64("10000000")],
        typeArguments: [`${pkg}::alc::ALC`]
    });

    tx.transferObjects([alcCoins], tx.pure.address(address));

    const response = await client.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        signer: keypair,
        options: {showEffects: true, showBalanceChanges: true},
        requestType: "WaitForLocalExecution"
    })
    console.log(response);
}

mintCoins();
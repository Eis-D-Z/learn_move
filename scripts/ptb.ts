import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { SuiClient } from "@mysten/sui.js/client";
import { fromB64 } from "@mysten/sui.js/utils";
import * as dotenv from "dotenv";

dotenv.config();

const pkg = process.env.PACKAGE as string;
const cap = process.env.MINT_CAP as string;
const shelf = process.env.SHELF as string;

const getDynFields = async () => {
  const { address, keypair, client } = getClient();

  const response = await client.getDynamicFields({
    parentId: shelf,
  });

  client.subscribeEvent

  const resp = await client.getObject({
    id: shelf,
    options: {
      showBcs: true,
      showContent: true,
      showType: true,
      showDisplay: true,
      showPreviousTransaction: true,
      showOwner: true,
    },
  });

  console.log(JSON.stringify(resp));
};

const getDynField = async () => {
  const { address, keypair, client } = getClient();

  const response = await client.getDynamicFieldObject({
    parentId: shelf,
    name: {
      type: "address",
      value:
        "0xeadac26754832d39ecdefac1f13d94bbf5d6fe1bbfb32ccccffc083f59180e6b",
    },
  });

  console.log(response);
};

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

const mintPotion = async (
  type: string,
  keypair: Ed25519Keypair,
  client: SuiClient
) => {
  const tx = new TransactionBlock();

  tx.setSender(keypair.toSuiAddress());
  const potion = tx.moveCall({
    target: `${pkg}::potions::mint`,
    arguments: [
      tx.object(cap),
      tx.pure.string("Potion of Charisma"),
      tx.pure.u8(80),
      tx.pure.u8(12),
      tx.pure.string("A potion that increases Charisma."),
    ],
    typeArguments: [`${pkg}::potions::${type}`],
  });

  tx.transferObjects([potion], tx.pure.address(keypair.toSuiAddress()));

  const response: any = await client.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    signer: keypair,
    options: {
      showEffects: true,
    },
    requestType: "WaitForLocalExecution",
  });

  return { id: response.effects?.created[0].reference.objectId, type };
};

const putInShelf = async (
  potion: string,
  type: string,
  keypair: Ed25519Keypair,
  client: SuiClient
) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${pkg}::potions::put_in_shelf`,
    arguments: [tx.object(shelf), tx.object(potion)],
    typeArguments: [`${pkg}::potions::${type}`],
  });

  const response: any = await client.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
    },
    requestType: "WaitForLocalExecution",
    signer: keypair,
  });
  return response;
};

const main = async () => {
  const { address, keypair, client } = getClient();

  const { id: id1, type: type1 } = await mintPotion("LUCK", keypair, client);
  // const { id: id2, type: type2 } = await mintPotion("LvlUp", keypair, client);
  // const { id: id3, type: type3 } = await mintPotion("STR", keypair, client);

  const resp1 = await putInShelf(id1, type1, keypair, client);
  // const resp2 = await putInShelf(id2, type2, keypair, client);
  // const resp3 = await putInShelf(id3, type3, keypair, client);

  // console.log(resp1.effects.status.status);
};
main();

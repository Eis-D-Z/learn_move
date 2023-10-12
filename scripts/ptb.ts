import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { SuiClient } from "@mysten/sui.js/client";
import { fromB64 } from "@mysten/sui.js/utils";
import * as dotenv from "dotenv";
import { get } from "http";
dotenv.config();

const pkg = process.env.PACKAGE as string;
const cap = process.env.MINT_CAP as string;
const shelf = process.env.SHELF as string;

const getDynFields = async () => {
  const { address, keypair, client } = getClient();

  const response = await client.getDynamicFields({
    parentId: shelf,
  });

  console.log(JSON.stringify(response));
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

  // const resp1 = await putInShelf(id1, type1, keypair, client);
  // const resp2 = await putInShelf(id2, type2, keypair, client);
  // const resp3 = await putInShelf(id3, type3, keypair, client);

  // console.log(resp1.effects.status.status);
};
main();
// getDynField();

const dyn = {
  data: [
    {
      name: {
        type: "address",
        value:
          "0xeadac26754832d39ecdefac1f13d94bbf5d6fe1bbfb32ccccffc083f59180e6b",
      },
      bcsName: "GomseQdnpTj1wUHK3UjrpCKN6i2BTrSjzG8HiRohUZuk",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::STR>",
      objectId:
        "0xeadac26754832d39ecdefac1f13d94bbf5d6fe1bbfb32ccccffc083f59180e6b",
      version: 10820584,
      digest: "EFWNH5Tt1MVaLaZJBhshmxg63AdhmoQX8ZJ2Fqz2MdkU",
    },
    {
      name: {
        type: "address",
        value:
          "0xd01b8b2679c000a73c0e2d34927ab2f0c79768eb0b279f899ce3e923aa9deb06",
      },
      bcsName: "F1NAKuzC4oCL6jyhjKbZm3tpLTmdisEA9QYxPZRE9GuK",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::LvlUp>",
      objectId:
        "0xd01b8b2679c000a73c0e2d34927ab2f0c79768eb0b279f899ce3e923aa9deb06",
      version: 10820583,
      digest: "CAUyp5VSTufMMg5XgJ3ZuCxFviV2yf8DssybYpwTxf3j",
    },
    {
      name: {
        type: "address",
        value:
          "0xfc3d6aa78ec3e34d2256541ee393e2959df17a77bc58fd6a956bcc497bc194b8",
      },
      bcsName: "Hye4JmQP8FL5o7vhrN4CDKtzUHouvUjFU6tGtHXHnCyu",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::CHA>",
      objectId:
        "0xfc3d6aa78ec3e34d2256541ee393e2959df17a77bc58fd6a956bcc497bc194b8",
      version: 10820563,
      digest: "CtMY2fetcLWS4n6EE8ixAYPodkY5DfnQdg3DNf2Bqp7e",
    },
    {
      name: {
        type: "address",
        value:
          "0xe4e54d8f8d36596b891b808722ab7a2266a65bd7ec4d07a7c4efe7d756595553",
      },
      bcsName: "GQWkc4EEvceSLHQNTEvyRcJ84XxdShphbHWQHGEnqjAr",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::CHA>",
      objectId:
        "0xe4e54d8f8d36596b891b808722ab7a2266a65bd7ec4d07a7c4efe7d756595553",
      version: 10820582,
      digest: "2k133jMvtRoL5dMz9zbeRDEtAGSjUPm9SY7u7e3ZFVka",
    },
    {
      name: {
        type: "address",
        value:
          "0x1a1a77313c6b7a41f8f7194864f7217eecaa6085bdd261f0604ec9969782040c",
      },
      bcsName: "2ku1Nh84bv4XJBcHJSAUR6g7pveu7w1UsjBmzq2RRZAb",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::STR>",
      objectId:
        "0x1a1a77313c6b7a41f8f7194864f7217eecaa6085bdd261f0604ec9969782040c",
      version: 10820578,
      digest: "nuagbRNdfsCsc23CJJSbUaX28Fq4UXwGXkzzZQCyQSc",
    },
    {
      name: {
        type: "address",
        value:
          "0x1ef360b00bf2fc6382f406a207b700c7882d586d7ad4a80f3e1675ab63cfb6f9",
      },
      bcsName: "35pUaDkW7uM5wDC7nJ9cVoaAe3cDkwtAnk4sBFW3hBt4",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::CHA>",
      objectId:
        "0x1ef360b00bf2fc6382f406a207b700c7882d586d7ad4a80f3e1675ab63cfb6f9",
      version: 10820570,
      digest: "6Y4mxNji27qpGqT7HxaHLQ5L6KBnCVg99jqDStjDA8QE",
    },
    {
      name: {
        type: "address",
        value:
          "0xffb37173d61aa220728c8358f3ccf69b5e6e0ba15da7ed1e2512b85907bab2ba",
      },
      bcsName: "JD9fUcizfqV7KUk2PEfqCNsasKz3GwhbJ1uh3i14yG2u",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::LvlUp>",
      objectId:
        "0xffb37173d61aa220728c8358f3ccf69b5e6e0ba15da7ed1e2512b85907bab2ba",
      version: 10820577,
      digest: "FoH7ZszsDxXVrC8otQVTAp12nHAwfmvGJrukm6wCn6dF",
    },
    {
      name: {
        type: "address",
        value:
          "0x89bfb53ebef3df00cb1943dd68ee0357b91ecd3fc62e62cc321b18d6cb6f7da9",
      },
      bcsName: "AGiQKhYoBFBEV9BWGSGTUY1NiasMA1oMxMeJS84psmtC",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::CHA>",
      objectId:
        "0x89bfb53ebef3df00cb1943dd68ee0357b91ecd3fc62e62cc321b18d6cb6f7da9",
      version: 10820576,
      digest: "ChubcJbCDwoTmqXvxandJDwiDn1Z3EbrkMqBxvTDufCY",
    },
    {
      name: {
        type: "address",
        value:
          "0x2c108736016b3bf0bb8ed7e3515c79aa0809ea7d1755e6ba20b8301c70e669d7",
      },
      bcsName: "3y1ZGPCZgtg6ZUNPjwrm3E1nq5UsAQktC5mCjCbuGoSW",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::STR>",
      objectId:
        "0x2c108736016b3bf0bb8ed7e3515c79aa0809ea7d1755e6ba20b8301c70e669d7",
      version: 10820572,
      digest: "251X5SHiP25NQv2dZmDD41MV8R72bMmvQ5gseCEijU6C",
    },
    {
      name: {
        type: "address",
        value:
          "0x06e81bf4b58040b51f935512ba25b3d1e5a7b18a12d57043ab8b0e182397ccb5",
      },
      bcsName: "Txj32t345Z4BoMBFXFPxn2mgiPw6uQHMWPM5RtkUw2U",
      type: "DynamicObject",
      objectType:
        "0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::Potion<0x7dcef1556fb2033dc6f5fe3f1d43fa6e8cb1a0d740c039d398bff14761ad4209::potions::LvlUp>",
      objectId:
        "0x06e81bf4b58040b51f935512ba25b3d1e5a7b18a12d57043ab8b0e182397ccb5",
      version: 10820571,
      digest: "FDRsPdH1Kf3m2UN4Cv2KzBWAkcwDG2QFEUqnLUa91DYU",
    },
  ],
  nextCursor:
    "0xf9d2320f15238c7988f344e6028c81d9f3b2d57c9274bfeb9aa955add3a5fbbc",
  hasNextPage: false,
};

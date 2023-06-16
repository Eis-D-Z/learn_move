import {
  TransactionBlock,
  JsonRpcProvider,
  RawSigner,
  Ed25519Keypair,
  devnetConnection,
  fromB64,
} from "@mysten/sui.js";

const getSignerAddress = () => {
  const b64PrivKey = "ACGrHNXjXYqasmhChBDTvItmj6eDFhBNVwF1cYiGsTmA";
  const privKeyArray = Array.from(fromB64(b64PrivKey));
  privKeyArray.shift();
  const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(privKeyArray));
  const address = keypair.getPublicKey().toSuiAddress();
  const provider = new JsonRpcProvider(devnetConnection);
  const signer = new RawSigner(keypair, provider);

  return { address, signer };
};
const packageId =
  "0x7c8f52f7f53791a9cd007d4e943f10f486f4fcb43ec643f196f6adcfb52e39c4";
const moduleName = "weapons";
const mint = async () => {
  const { address, signer } = getSignerAddress();

  const tx = new TransactionBlock();
  tx.setGasBudget(1000000000);
  tx.setSender(address);
  const functionName = "mint";
  const weapon = tx.moveCall({
    target: `${packageId}::${moduleName}::${functionName}`,
    arguments: [],
    typeArguments: [],
  });
  console.log(weapon);
  let recipient = tx.pure(address, "address");
  tx.transferObjects([weapon], recipient);
  // tx.transferObjects([weapon], tx.pure(address));

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
      showEvents: true,
    },
  });

  console.log(JSON.stringify(result));
};

mint();

const a = {
  digest: "6EU7hkT2qPoTXAJmaiBSVVz4pVL2Gmqsf7GrvRWukyye",
  effects: {
    messageVersion: "v1",
    status: { status: "success" },
    executedEpoch: "3",
    gasUsed: {
      computationCost: "1000000",
      storageCost: "4020400",
      storageRebate: "2934360",
      nonRefundableStorageFee: "29640",
    },
    modifiedAtVersions: [
      {
        objectId:
          "0x46118895c8ee85e9ed0e348904e91f8bf51fb275732e0693ebe82f4421194690",
        sequenceNumber: "57",
      },
      {
        objectId:
          "0x5c0dfbe32a1b4b17af8aebecd107b244b8cfeb96e99656f94e51150be1732887",
        sequenceNumber: "52",
      },
      {
        objectId:
          "0xf86711f8c924c3934eaa58b64be58dd0468ad74332d438b4a8e804f0063638ec",
        sequenceNumber: "51",
      },
    ],
    transactionDigest: "6EU7hkT2qPoTXAJmaiBSVVz4pVL2Gmqsf7GrvRWukyye",
    created: [
      {
        owner: {
          AddressOwner:
            "0x6f2d5e80dd21cb2c87c80b227d662642c688090dc81adbd9c4ae1fe889dfaf71",
        },
        reference: {
          objectId:
            "0x9f7746cf83340b5e8d6998589adbf7949e527af42bd43a473fcf714ad4f4f7a6",
          version: 58,
          digest: "5pug86dvCj2C5fagkYXVc3pJtMG436w2jcVhD7UYuXMg",
        },
      },
      {
        owner: {
          AddressOwner:
            "0x6f2d5e80dd21cb2c87c80b227d662642c688090dc81adbd9c4ae1fe889dfaf71",
        },
        reference: {
          objectId:
            "0xafc972db8d96fa6bf651012cbd28be60bc19f416be63be5c6243e08bd71f80d4",
          version: 58,
          digest: "5LwL97ePj6yLWNQR8sxZNqyXHkPcvN5USzmRMdDUpAQB",
        },
      },
    ],
    mutated: [
      {
        owner: {
          AddressOwner:
            "0x6f2d5e80dd21cb2c87c80b227d662642c688090dc81adbd9c4ae1fe889dfaf71",
        },
        reference: {
          objectId:
            "0x46118895c8ee85e9ed0e348904e91f8bf51fb275732e0693ebe82f4421194690",
          version: 58,
          digest: "J8SroL7E6yHp4CHHR7L9vru1BujwkvKwWjhQv5MNF9Nc",
        },
      },
    ],
    deleted: [
      {
        objectId:
          "0x5c0dfbe32a1b4b17af8aebecd107b244b8cfeb96e99656f94e51150be1732887",
        version: 58,
        digest: "7gyGAp71YXQRoxmFBaHxofQXAipvgHyBKPyxmdSJxyvz",
      },
      {
        objectId:
          "0xf86711f8c924c3934eaa58b64be58dd0468ad74332d438b4a8e804f0063638ec",
        version: 58,
        digest: "7gyGAp71YXQRoxmFBaHxofQXAipvgHyBKPyxmdSJxyvz",
      },
    ],
    gasObject: {
      owner: {
        AddressOwner:
          "0x6f2d5e80dd21cb2c87c80b227d662642c688090dc81adbd9c4ae1fe889dfaf71",
      },
      reference: {
        objectId:
          "0x46118895c8ee85e9ed0e348904e91f8bf51fb275732e0693ebe82f4421194690",
        version: 58,
        digest: "J8SroL7E6yHp4CHHR7L9vru1BujwkvKwWjhQv5MNF9Nc",
      },
    },
    dependencies: [
      "DhoqFMZZmSggSG4MFEUAuuyxtdW2M5JUqvGK1RMFBGA",
      "GWNCE8wngn1iMBzFGGLoSQJVukDB3S4mrJers1e74RV",
      "46rq18xQ8tUsjyPD6PZfYnxukN1dBmg9evsfEAkUjvM2",
      "Brgk6qQKSchzPz3txnR7PRUvcbVQ1wyUgeUZC7UdqLpZ",
    ],
  },
  events: [],
  confirmedLocalExecution: true,
};

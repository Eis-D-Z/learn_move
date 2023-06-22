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
  "0xe2958e0a8a8b763fb7ffea7c40bea6aa23b2ef398e146af26aad901eb952a5d1";

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

const do_a_lot = async () => {

  const {address, signer} = getSignerAddress();
  const tx = new TransactionBlock();

  const weapon = tx.moveCall({
    target: `${packageId}::${moduleName}::forge`,
    arguments: [tx.pure(100, "u16"), tx.pure("katana", "string")]
  });

  for (let i = 0; i<4; i++) {
    tx.moveCall({
      target: `${packageId}::${moduleName}::slash`,
      arguments: [weapon]
    });
  }

  const holder = tx.moveCall({
    target: `${packageId}::${moduleName}::mint_holder`,
    arguments: []
  });

  tx.moveCall({
    target: `${packageId}::${moduleName}::holster`,
    arguments: [holder, weapon]
  });

  tx.moveCall({
    target: `${packageId}::${moduleName}::add_accessory`,
    arguments: [tx.pure("White", "string"), tx.pure("strings", "string"), holder]
  });

  tx.transferObjects([holder], tx.pure(address));

  const response = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
      showObjectChanges: true
    }
  });
  console.log(JSON.stringify(response));
}

do_a_lot()



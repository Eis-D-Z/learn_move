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
  "0xa5737efbd706103a1472244e9108cb92c6424da605022f00a0a863243eca74e7";

const moduleName = "weapons";

const mint = async () => {
  console.log(0.3 == 0.1 + 0.2);
  const { address, signer } = getSignerAddress();

  const tx = new TransactionBlock();
  tx.setGasBudget(1000000000);
  tx.setSender(address);
  const functionName = "forge";
  const weapon = tx.moveCall({
    target: `${packageId}::${moduleName}::${functionName}`,
    arguments: [tx.pure("255", "u16"), tx.pure("katana", "string")],
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

const update_display = async () => {
  const { address, signer } = getSignerAddress();
  const tx = new TransactionBlock();

  tx.moveCall({
    target: "0x2::display::update_version",
    arguments: [tx.object("0xa59424c11955574da4b2e6c1aa5184ba001e76faa09c71aa4a02f4117fd762a3")],
    typeArguments: [`${packageId}::weapons::Weapon`]

  });

  
  const response = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    requestType: "WaitForLocalExecution"
  });

  console.log(response);

}

// do_a_lot()
// mint()
update_display()



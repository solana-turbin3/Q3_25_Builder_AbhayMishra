import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);




const secretKey = bs58.decode(wallet.secretKey);

const keypair = Keypair.fromSecretKey(secretKey);

const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const account_seeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];

const [account_key, _account_bump] = PublicKey.findProgramAddressSync(
  account_seeds,
  program.programId
);

const mintTs = Keypair.generate();

const collection_seeds = [
  Buffer.from("collection"),
  mintCollection.toBuffer(),
];

const [collection_key, _collection_bump] =
  PublicKey.findProgramAddressSync(collection_seeds, program.programId);


// (async () => {
//   try {
//     const txhash = await program.methods
//       .initialize("abhayymishraa")
//       .accountsPartial({
//         user: keypair.publicKey,
//         account: account_key,
//         system_program: SYSTEM_PROGRAM_ID,
//       })
//       .signers([keypair])
//       .rpc();
//     console.log(`Success! Check out your TX here:
//             https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
//   } catch (e) {
//     console.error(`Oops, something went wrong: ${e}`);
//   }
// })();

(async () => {
  try {
    const txhash = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        authority: collection_key,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair, mintTs])
      .rpc();
    console.log(`Success! Check out your TX here:
            https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

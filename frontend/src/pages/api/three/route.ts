// import { OrbisDB, type OrbisConnectResult } from "@useorbis/db-sdk";
// import { OrbisKeyDidAuth } from "@useorbis/db-sdk/dist/auth/keyDid";

// export const runtime = "edge";

// const ENV_ID = process.env.NEXT_PUBLIC_ENV_ID ?? "";
// const seed = process.env.PRIVATE_DID_SEED ?? "";
// const ATTESTATION_TABLE_ID = process.env.ATTESTATION_TABLE_ID ?? "";
// const CONTEXT_ID = process.env.CONTEXT_ID ?? "";

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = new Uint8Array(arrayBuffer);

//     const orbis = new OrbisDB({
//       ceramic: {
//         gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
//       },
//       nodes: [
//         {
//           gateway: "https://studio.useorbis.com",
//           env: ENV_ID,
//         },
//       ],
//     });
//     const auth = await OrbisKeyDidAuth.fromSeed(seed);
//     const authResult: OrbisConnectResult = await orbis.connectUser({ auth });

//     // get hash of file
//     const hashValue = await crypto.subtle.digest("SHA-256", buffer);
//     const hashArray = Array.from(new Uint8Array(hashValue));
//     // get bytes32 hash
//     const hashHex =
//       "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
//     console.log(hashHex);

//     // SAVE TO ORBIS
//     const updatequery = await orbis
//       .insert(ATTESTATION_TABLE_ID)
//       .value({
//         content_hash: hashHex,
//         CID: formData.get("imageCid") as string,
//         owner: formData.get("address") as string,
//         name: formData.get("fileName") as string,
//         start_timestamp: new Date().toISOString(),
//         end_timestamp: new Date().toISOString(),
//       })
//       .context(CONTEXT_ID)
//       .run();

//     if (updatequery.content) {
//       return Response.json({ data: updatequery.content }, { status: 200 });
//     }

//     return Response.json(
//       { error: `Something went wrong storing in Ceramic - check node status` },
//       { status: 500 }
//     );
//   } catch (error) {
//     return Response.json({ error: `Something went wrong` }, { status: 500 });
//   }
// }

import { Connection } from "@solana/web3.js";
import idl from "./verifycLy8mB96wd9wqq3WDXQwM4oU6r42Th37Db9fC-idl.json";
import { parseAnchorTransactionEvents } from "./parseEvents";
import { Idl } from "@coral-xyz/anchor";

export async function GET(request: Request) {
  return new Response("Hello, from API! + " + JSON.stringify(request));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook payload:", body);

    const connection = new Connection(process.env.RPC_URL!);
    const transaction = body[0]; // Since the webhook sends an array

    // Parse events from the transaction
    if (transaction && transaction.signature) {
      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: transaction.signature,
        },
        "finalized"
      );

      const events = await parseAnchorTransactionEvents(
        transaction.signature,
        connection,
        idl as Idl
      );
      console.log("Parsed Anchor events:", events);

      // If we found an otterVerifyEvent, forward it to verify-with-signer
      const otterEvent = events.find((e) => e.name === "otterVerifyEvent");
      if (otterEvent && otterEvent.data) {
        const verifyResponse = await fetch(
          `https://verify.osec.io/verify-with-signer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              program_id: otterEvent.data.program.toString(),
              signer: otterEvent.data.signer.toString(),
              repository: otterEvent.data.params.gitUrl.toString(),
              commit_hash: otterEvent.data.params.commit.toString(),
            }),
          }
        );

        const verifyResult = await verifyResponse.json();
        console.log("Verification result:", verifyResult);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

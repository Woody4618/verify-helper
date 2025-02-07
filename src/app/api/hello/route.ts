import { parseAnchorTransactionEvents } from "@solana-developers/helpers";
import { Connection } from "@solana/web3.js";

// The path is relative to where the code is executed (project root)
const IDL_PATH =
  "./src/app/api/hello/verifycLy8mB96wd9wqq3WDXQwM4oU6r42Th37Db9fC-idl.json";

export async function GET(request: Request) {
  return new Response("Hello, from API! + " + JSON.stringify(request));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received webhook payload:", body);

    const connection = new Connection(process.env.RPC_URL!);

    // Parse events from the transaction
    const transaction = body[0]; // Since the webhook sends an array
    if (transaction && transaction.events) {
      const events = parseAnchorTransactionEvents(
        IDL_PATH,
        transaction.signature,
        connection
      );
      console.log("Parsed Anchor events:", events);
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

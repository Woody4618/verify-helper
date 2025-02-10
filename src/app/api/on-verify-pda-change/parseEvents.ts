import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  EventParser,
  Idl,
  Wallet,
} from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

/**
 * Parses Anchor events from a transaction
 *
 * @param signature - Transaction signature to parse events from
 * @param connection - Connection object
 * @param idl - The IDL object
 * @returns Array of parsed events with their name and data
 */
export async function parseAnchorTransactionEvents(
  signature: string,
  connection: Connection,
  idl: Idl
): Promise<Array<{ name: string; data: any }>> {
  let wallet = new NodeWallet(new Keypair());
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  const program = new Program(idl, provider);

  const parser = new EventParser(program.programId, program.coder);

  const transaction = await provider.connection.getTransaction(signature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  if (!transaction?.meta?.logMessages) {
    return [];
  }

  const events: Array<{ name: string; data: any }> = [];
  for (const event of parser.parseLogs(transaction.meta.logMessages)) {
    events.push({
      name: event.name,
      data: event.data,
    });
  }

  return events;
}

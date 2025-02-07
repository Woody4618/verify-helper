import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, EventParser, Idl } from "@coral-xyz/anchor";

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
  //   const provider = new AnchorProvider(
  //     connection,
  //     // Dummy wallet since we're just reading data
  //     { publicKey: PublicKey.default } as any,
  //     {}
  //   );

  const provider = connection
    ? new AnchorProvider(connection, AnchorProvider.env().wallet, {})
    : AnchorProvider.env();

  const program = new Program(idl, provider);

  // const program = new Program(idl, new PublicKey(idl.metadata.address), provider);
  const parser = new EventParser(program.programId, program.coder);

  const transaction = await provider.connection.getTransaction(signature, {
    commitment: "confirmed",
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

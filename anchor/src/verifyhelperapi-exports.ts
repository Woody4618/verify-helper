// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VerifyhelperapiIDL from '../target/idl/verifyhelperapi.json'
import type { Verifyhelperapi } from '../target/types/verifyhelperapi'

// Re-export the generated IDL and type
export { Verifyhelperapi, VerifyhelperapiIDL }

// The programId is imported from the program IDL.
export const VERIFYHELPERAPI_PROGRAM_ID = new PublicKey(VerifyhelperapiIDL.address)

// This is a helper function to get the Verifyhelperapi Anchor program.
export function getVerifyhelperapiProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VerifyhelperapiIDL, address: address ? address.toBase58() : VerifyhelperapiIDL.address } as Verifyhelperapi, provider)
}

// This is a helper function to get the program ID for the Verifyhelperapi program depending on the cluster.
export function getVerifyhelperapiProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Verifyhelperapi program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VERIFYHELPERAPI_PROGRAM_ID
  }
}

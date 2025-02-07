import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Verifyhelperapi} from '../target/types/verifyhelperapi'

describe('verifyhelperapi', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Verifyhelperapi as Program<Verifyhelperapi>

  const verifyhelperapiKeypair = Keypair.generate()

  it('Initialize Verifyhelperapi', async () => {
    await program.methods
      .initialize()
      .accounts({
        verifyhelperapi: verifyhelperapiKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([verifyhelperapiKeypair])
      .rpc()

    const currentCount = await program.account.verifyhelperapi.fetch(verifyhelperapiKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Verifyhelperapi', async () => {
    await program.methods.increment().accounts({ verifyhelperapi: verifyhelperapiKeypair.publicKey }).rpc()

    const currentCount = await program.account.verifyhelperapi.fetch(verifyhelperapiKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Verifyhelperapi Again', async () => {
    await program.methods.increment().accounts({ verifyhelperapi: verifyhelperapiKeypair.publicKey }).rpc()

    const currentCount = await program.account.verifyhelperapi.fetch(verifyhelperapiKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Verifyhelperapi', async () => {
    await program.methods.decrement().accounts({ verifyhelperapi: verifyhelperapiKeypair.publicKey }).rpc()

    const currentCount = await program.account.verifyhelperapi.fetch(verifyhelperapiKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set verifyhelperapi value', async () => {
    await program.methods.set(42).accounts({ verifyhelperapi: verifyhelperapiKeypair.publicKey }).rpc()

    const currentCount = await program.account.verifyhelperapi.fetch(verifyhelperapiKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the verifyhelperapi account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        verifyhelperapi: verifyhelperapiKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.verifyhelperapi.fetchNullable(verifyhelperapiKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})

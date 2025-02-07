'use client'

import { getVerifyhelperapiProgram, getVerifyhelperapiProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useVerifyhelperapiProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVerifyhelperapiProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVerifyhelperapiProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['verifyhelperapi', 'all', { cluster }],
    queryFn: () => program.account.verifyhelperapi.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['verifyhelperapi', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ verifyhelperapi: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVerifyhelperapiProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVerifyhelperapiProgram()

  const accountQuery = useQuery({
    queryKey: ['verifyhelperapi', 'fetch', { cluster, account }],
    queryFn: () => program.account.verifyhelperapi.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['verifyhelperapi', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ verifyhelperapi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['verifyhelperapi', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ verifyhelperapi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['verifyhelperapi', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ verifyhelperapi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['verifyhelperapi', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ verifyhelperapi: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}

#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod verifyhelperapi {
    use super::*;

  pub fn close(_ctx: Context<CloseVerifyhelperapi>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.verifyhelperapi.count = ctx.accounts.verifyhelperapi.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.verifyhelperapi.count = ctx.accounts.verifyhelperapi.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVerifyhelperapi>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.verifyhelperapi.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVerifyhelperapi<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Verifyhelperapi::INIT_SPACE,
  payer = payer
  )]
  pub verifyhelperapi: Account<'info, Verifyhelperapi>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVerifyhelperapi<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub verifyhelperapi: Account<'info, Verifyhelperapi>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub verifyhelperapi: Account<'info, Verifyhelperapi>,
}

#[account]
#[derive(InitSpace)]
pub struct Verifyhelperapi {
  count: u8,
}

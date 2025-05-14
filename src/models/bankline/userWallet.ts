export class UserWallet extends Entity<void> {
    constructor(
      id?: string,
      public primaryWallet: Wallet,
      public connectedWallets: Wallet[] = []
    ) {
      super(id);
    }
  }
import { Entity } from "@/commons/entity";

type WalletType = 'metamask' | 'walletconnect' | 'coinbase';

export class Wallet extends Entity<void> {
  private balances: Map<string, string> = new Map();

  constructor(
    id?: string,
    public readonly address: string,
    public readonly type: WalletType,
    public isConnected: boolean = false
  ) {
    super(id);
  }

  addBalance(tokenId: string, amount: string): void {
    const current = this.balances.get(tokenId) || '0';
    this.balances.set(tokenId, (BigInt(current) + BigInt(amount)).toString());
  }
}
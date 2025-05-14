import { Entity } from "@/commons/entity";



export class Token extends Entity<void> {
  constructor(
    id?: string,
    public readonly symbol: string,
    public readonly decimals: number,
    public readonly chainId: number,
    public readonly type: 'native' | 'erc20' | 'erc721' = 'erc20',
    public readonly logoURI?: string
  ) {
    super(id);
  }

  validate(): void {
    if (this.decimals < 0 || this.decimals > 36) {
      throw new Error(`Invalid decimals for token ${this.symbol}`);
    }
  }
}
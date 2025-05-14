import { Entity } from "@/commons/entity";
import { Token } from "./token";

export class Swap extends Entity<void> {
    public status: 'pending' | 'completed' | 'failed' = 'pending';
    public txHash?: string;
    public gasFeeActual?: string;
  
    constructor(
      id?: string,
      public readonly fromToken: Token,
      public readonly toToken: Token,
      public amountIn: string,
      public amountOut: string,
      public slippage: number = 0.3, // 0.3% default
      public gasFeeEstimated: string
    ) {
      super(id);
    }
  
    markCompleted(txHash: string, actualGasFee: string): void {
      this.status = 'completed';
      this.txHash = txHash;
      this.gasFeeActual = actualGasFee;
    }
  }
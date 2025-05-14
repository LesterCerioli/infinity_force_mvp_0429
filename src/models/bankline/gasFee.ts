

export class GasFee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cryptoAssetId: string;  // ID do criptoativo (ex: ETH, BTC)

  @Column()
  transactionType: 'swap' | 'deposit' | 'withdrawal' | 'loan'; // Tipo de transação

  @Column('decimal', { precision: 18, scale: 8 })
  gasPrice: number;  // Preço do gás em unidades do criptoativo

  @Column()
  gasLimit: number; // Limite de gás para a transação

  @Column('decimal', { precision: 18, scale: 8 })
  gasFee: number;  // Taxa de gás calculada

  @Column({ default: false })
  isCalculated: boolean; // Indica se a taxa de gás foi calculada com sucesso

}
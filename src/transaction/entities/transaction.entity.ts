export class Transaction {
  date: Date;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  timestamp?: Date;
}

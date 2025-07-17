import { Injectable } from '@nestjs/common';
import { SheetService } from 'src/sheet/sheet.service';
import { Transaction } from './entities/transaction.entity';
import { Balance } from './entities/balance.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly sheetService: SheetService) {}

  async getTransactions(): Promise<Transaction[]> {
    const rows = await this.sheetService.getRawSheetData();
    return rows.map((row) => {
      const [date, type, amount, category, note, timestamp] = row;
      return {
        date: new Date(date),
        type: type as 'income' | 'expense',
        amount: parseFloat(amount),
        category,
        note,
        timestamp: timestamp ? new Date(timestamp) : undefined,
      } as Transaction;
    });
  }

  async addTransactions(transactions: Transaction[]) {
    const values = transactions.map((tx) => [
      tx.date.toISOString(),
      tx.type,
      tx.amount.toString(),
      tx.category,
      tx.note ?? '',
      tx.timestamp ? tx.timestamp.toISOString() : new Date().toISOString(),
    ]);
    return this.sheetService.writeRawSheetData(values);
  }

  async getTotalBalance(): Promise<Balance> {
    return this.sheetService.getTotalBalance();
  }
}

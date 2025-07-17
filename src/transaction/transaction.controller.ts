import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  getTransactions() {
    return this.transactionService.getTransactions();
  }

  @Post()
  async addTransaction(@Body() dto: CreateTransactionDto) {
    try {
      const transaction: Transaction = {
        ...dto,
        timestamp: new Date(),
      };
      await this.transactionService.addTransactions([transaction]);
    } catch (e) {
      throw new BadRequestException('Failed to add transaction: ' + e);
    }
  }

  @Get('balance')
  getTotalBalance() {
    return this.transactionService.getTotalBalance();
  }
}

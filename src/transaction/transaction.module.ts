import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SheetModule } from '../sheet/sheet.module';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [SheetModule],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}

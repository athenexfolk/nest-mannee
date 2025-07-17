import { Injectable, OnModuleInit } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { join } from 'path';
import { Balance } from 'src/transaction/entities/balance.entity';

@Injectable()
export class SheetService implements OnModuleInit {
  private sheets: sheets_v4.Sheets;
  private readonly MAIN_SHEET_NAME = 'main';
  private readonly META_SHEET_NAME = 'meta';
  private readonly DATA_RANGE = `${this.MAIN_SHEET_NAME}!A2:F`;
  private readonly TOTAL_BALANCE_RANGE = `${this.META_SHEET_NAME}!A2:B2`;
  private SPREADSHEET_ID =
    process.env.GOOGLE_SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID_HERE';

  async onModuleInit() {
    const keyFile =
      process.env.GOOGLE_KEY_FILE ||
      join(process.cwd(), 'YOUR_GOOGLE_SERVICE_ACCOUNT_KEY.json');

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      keyFile,
    });

    const authClient = await auth.getClient();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.sheets = google.sheets({ version: 'v4', auth: authClient as any });

    this.SPREADSHEET_ID =
      process.env.GOOGLE_SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID_HERE';
  }

  async getRawSheetData(): Promise<string[][]> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.SPREADSHEET_ID,
      range: this.DATA_RANGE,
    });
    return (res.data.values || []) as string[][];
  }

  async writeRawSheetData(values: string[][]) {
    const res = await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.SPREADSHEET_ID,
      range: this.DATA_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    if (res.ok) {
      return res.data;
    }

    throw new Error('Failed to write data to the sheet');
  }

  async getTotalBalance(): Promise<Balance> {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.SPREADSHEET_ID,
      range: this.TOTAL_BALANCE_RANGE,
    });

    const amount = res.data.values![0][0] as string;
    const lastUpdated = res.data.values![0][1] as string | undefined;

    return {
      amount: amount ? parseFloat(amount) : 0,
      lastUpdated: lastUpdated ? new Date(lastUpdated) : undefined,
    };
  }
}

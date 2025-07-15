import { Injectable, OnModuleInit } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import { join } from 'path';

@Injectable()
export class SheetService implements OnModuleInit {
  private sheets: sheets_v4.Sheets;

  async onModuleInit() {
    const keyFile =
      process.env.GOOGLE_KEY_FILE ||
      join(process.cwd(), 'YOUR_GOOGLE_SERVICE_ACCOUNT_KEY.json');
    const spreadsheetId =
      process.env.GOOGLE_SPREADSHEET_ID || 'YOUR_SPREADSHEET_ID_HERE';

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      keyFile,
    });
    const authClient = await auth.getClient();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.sheets = google.sheets({ version: 'v4', auth: authClient as any });

    // Example usage: Fetch data from a specific range in the spreadsheet
    const range = 'sheet1!A2:C';

    try {
      await this.writeSheetData(spreadsheetId, range, [
        ['New Data 1', 'New Data 2', 'New Data 3'],
        ['More Data 1', 'More Data 2', 'More Data 3'],
      ]);
    } catch (e) {
      console.error('Error writing data to the sheet:', e);
      return;
    }

    const raws = await this.getSheetData(spreadsheetId, range);
    console.log(raws);
  }

  async getSheetData(spreadsheetId: string, range: string) {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return res.data.values;
  }

  async writeSheetData(spreadsheetId: string, range: string, values: any[][]) {
    const res = await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
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
}

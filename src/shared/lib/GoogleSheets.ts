import { google } from 'googleapis';
import { LogisticRequest } from '../types';

export class GoogleSheetsService {
  private sheets;
  private auth;

  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async appendLogisticRequest(data: LogisticRequest): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // Convert to Russian time (Moscow timezone: UTC+3)
    const russianDate = this.toRussianTime(data.timestamp);
    const date = russianDate.toLocaleDateString('ru-RU'); // Format: дд.мм.гггг
    const time = russianDate.toLocaleTimeString('ru-RU'); // Format: чч:мм:сс

    const values = [[
      data.username,
      date,
      time,
      data.requestContent,
      data.userId.toString(),
      data.status || 'pending',
    ]];

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:F',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      console.log('✅ Data berhasil ditambahkan ke Google Sheets (Russian time)');
    } catch (error) {
      console.error('❌ Error menambahkan data ke Google Sheets:', error);
      throw error;
    }
  }

  async initializeSheet(): Promise<void> {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    try {
      // Cek apakah header sudah ada
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A1:E1',
      });

      // Jika belum ada header, tambahkan
      if (!response.data.values || response.data.values.length === 0) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: 'Sheet1!A1:E1',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Username', 'Tanggal', 'Jam', 'Isi Request', 'User ID']],
          },
        });
        console.log('Header sheet berhasil dibuat');
      }
    } catch (error) {
      console.error('Error inisialisasi sheet:', error);
      throw error;
    }
  }

  async getAllRequests(): Promise<LogisticRequest[]> {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A:F', // A=Username, B=Date, C=Time, D=Request, E=UserID, F=Status
      });

      const rows = response.data.values;

      // Jika tidak ada data atau hanya header
      if (!rows || rows.length <= 1) {
        return [];
      }

      // Skip header row (index 0) dan map data
      const requests: LogisticRequest[] = rows.slice(1).map((row, index) => {
        const [username, date, time, requestContent, userId, status] = row;

        // Parse tanggal dan waktu Indonesia
        const timestamp = this.parseRussianDateTime(date, time);

        return {
          username: username || 'unknown',
          timestamp,
          requestContent: requestContent || '',
          userId: parseInt(userId) || 0,
          chatId: 0, // chatId tidak disimpan di sheet, bisa diabaikan
          status: (status as LogisticRequest['status']) || 'pending',
          rowIndex: index + 2, // +2 karena: skip header (1) + array index dimulai dari 0
        };
      });

      console.log(`✅ Fetched ${requests.length} requests from Google Sheets`);
      return requests;

    } catch (error) {
      console.error('❌ Error fetching requests from Google Sheets:', error);
      throw error;
    }
  }

  private toRussianTime(date: Date): Date {
    // Moscow timezone is UTC+3
    // Convert to Russian time by getting UTC time and adding 3 hours
    return new Date(
      date.toLocaleString('en-US', {
        timeZone: 'Europe/Moscow',
      })
    );
  }

  private parseRussianDateTime(dateStr: string, timeStr: string): Date {
    try {
      // Parse Russian date: "24.11.2024" -> day, month, year
      const [day, month, year] = dateStr.split('.').map(Number);

      // Parse time: "14:30:45" -> hour, minute, second
      const [hour, minute, second] = timeStr.split(':').map(Number);

      // Create Date object (month is 0-indexed in JS)
      // This creates a date in Moscow timezone
      const moscowDate = new Date(year, month - 1, day, hour, minute, second);

      return moscowDate;
    } catch (error) {
      console.error('❌ Error parsing Russian date/time:', dateStr, timeStr, error);
      return new Date(); // Fallback to current date
    }
  }

}
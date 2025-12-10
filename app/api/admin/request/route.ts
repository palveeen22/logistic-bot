// src/app/api/admin/requests/route.ts
import { GoogleSheetsService } from '@/shared/lib';
import { NextRequest, NextResponse } from 'next/server';

const sheetsService = new GoogleSheetsService();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status') || 'all';

    // Fetch all data from Google Sheets
    const allRequests = await sheetsService.getAllRequests();

    // Apply filters
    let filteredRequests = allRequests;

    if (search) {
      filteredRequests = filteredRequests.filter(
        (req) =>
          req.username.toLowerCase().includes(search.toLowerCase()) ||
          req.requestContent.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredRequests = filteredRequests.filter(
        (req) => new Date(req.timestamp) >= fromDate
      );
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      filteredRequests = filteredRequests.filter(
        (req) => new Date(req.timestamp) <= toDate
      );
    }

    if (status !== 'all') {
      filteredRequests = filteredRequests.filter(
        (req) => req.status === status
      );
    }

    // Calculate stats
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: allRequests.length,
      today: allRequests.filter((req) => new Date(req.timestamp) >= todayStart).length,
      thisWeek: allRequests.filter((req) => new Date(req.timestamp) >= weekStart).length,
      thisMonth: allRequests.filter((req) => new Date(req.timestamp) >= monthStart).length,
    };

    return NextResponse.json({
      requests: filteredRequests,
      stats,
      allRequests
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}
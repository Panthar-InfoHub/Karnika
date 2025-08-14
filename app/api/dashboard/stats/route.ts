import { NextResponse } from "next/server";
import { getDashboardStats, type TimePeriod } from "@/lib/dashboard-stats";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = (searchParams.get('period') as TimePeriod) || 'today';

    // Validate period
    if (!['today', '30days', 'lifetime'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be today, 30days, or lifetime' },
        { status: 400 }
      );
    }

    const stats = await getDashboardStats(period);
    
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Dashboard stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

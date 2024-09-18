import { Bookings } from '@/app/models/booking';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get all bookings
        const bookings = await Bookings.find();
        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ message: 'Failed to fetch bookings', error: error.message }, { status: 500 });
    }
}

import { Bookings } from '@/app/models/booking';
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Extract userId from URL parameters
    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();  // Extract userId from the URL

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        // Find bookings by user ID
        const bookings = await Bookings.find({ userid: userId });

        if (bookings.length === 0) {
            return NextResponse.json({ message: 'No bookings found for this user' }, { status: 404 });
        }

        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ message: 'Error fetching bookings', error: error.message }, { status: 500 });
    }
}
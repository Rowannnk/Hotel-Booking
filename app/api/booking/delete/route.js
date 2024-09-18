import { Users } from '@/app/models/user';
import { Bookings } from '@/app/models/booking';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
    const body = await request.json();
    const { userid, bookingId } = body;

    try {
        // Check if the user exists and is not an admin
        const user = await Users.findById(userid);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        if (user.isAdmin) {
            return NextResponse.json({ message: 'Permission denied: Admins cannot delete bookings' }, { status: 403 });
        }

        // Delete the booking
        const result = await Bookings.findByIdAndDelete(bookingId);
        if (!result) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Booking deletion error:', error);
        return NextResponse.json({ message: 'Booking deletion failed', error: error.message }, { status: 500 });
    }
}

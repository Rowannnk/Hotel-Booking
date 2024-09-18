import { Users } from '@/app/models/user';
import { Bookings } from '@/app/models/booking';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    const body = await request.json();
    const { userid, bookingId, room, roomid, fromdate, todate, totalAmount, totalDays, transitionId, status } = body;

    try {
        // Check if the user exists and is not an admin
        const user = await Users.findById(userid);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        if (user.isAdmin) {
            return NextResponse.json({ message: 'Permission denied: Admins cannot update bookings' }, { status: 403 });
        }

        // Find the booking by ID
        const booking = await Bookings.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        // Update fields only if they are provided
        if (room) booking.room = room;
        if (roomid) booking.roomid = roomid;
        if (fromdate) booking.fromdate = fromdate;
        if (todate) booking.todate = todate;
        if (totalAmount) booking.totalAmount = totalAmount;
        if (totalDays) booking.totalDays = totalDays;
        if (transitionId) booking.transitionId = transitionId;
        if (status) booking.status = status;

        await booking.save();
        return NextResponse.json({ message: 'Booking updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Booking update error:', error);
        return NextResponse.json({ message: 'Booking update failed', error: error.message }, { status: 400 });
    }
}

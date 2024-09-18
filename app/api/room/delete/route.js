import { Users } from '@/app/models/user';
import { Rooms } from '@/app/models/room';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
    const body = await request.json();
    const { userId, roomId } = body;  // userId to check admin status and roomId to delete

    try {
        // Find the user by ID
        const user = await Users.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            return NextResponse.json({ message: 'Permission denied: Only admins can delete rooms' }, { status: 403 });
        }

        // Find the room by ID
        const room = await Rooms.findById(roomId);
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        // Delete the room
        await Rooms.findByIdAndDelete(roomId);

        return NextResponse.json({ message: 'Room deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Room deletion error:', error);  // Log detailed error
        return NextResponse.json({ message: 'Room deletion failed', error: error.message }, { status: 400 });
    }
}

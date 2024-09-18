import { Users } from '@/app/models/user';
import { Rooms } from '@/app/models/room';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    const body = await request.json();
    const { userId, roomId, name, maxpeople, phonenumber, rentperday, imgurls, roomtype, description } = body;

    try {
        // Find the user by ID
        const user = await Users.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Check if the user is an admin
        if (!user.isAdmin) {
            return NextResponse.json({ message: 'Permission denied: Only admins can update rooms' }, { status: 403 });
        }

        // Find the room by ID
        const room = await Rooms.findById(roomId);
        if (!room) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        // Update fields only if they are provided
        if (name) room.name = name;
        if (maxpeople) room.maxpeople = maxpeople;
        if (phonenumber) room.phonenumber = phonenumber;
        if (rentperday) room.rentperday = rentperday;
        if (imgurls && imgurls.length > 0) room.imgurls = imgurls;
        if (roomtype) room.roomtype = roomtype;
        if (description) room.description = description;

        // Save the updated room
        await room.save();

        return NextResponse.json({ message: 'Room updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Room update error:', error);  // Log the error
        return NextResponse.json({ message: 'Room update failed', error: error.message }, { status: 400 });
    }
}

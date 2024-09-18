import { Rooms } from '@/app/models/room';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rooms = await Rooms.find();  // Fetch all rooms from the database
        return NextResponse.json(rooms, { status: 200 });
    } catch (error) {
        console.error('Error fetching rooms:', error);  // Log detailed error
        return NextResponse.json({ message: 'Failed to retrieve rooms', error: error.message }, { status: 400 });
    }
}

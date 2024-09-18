
import { Users } from '@/app/models/user';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Retrieve all users from the database
        const users = await Users.find({});

        // Return the users in the response
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);  // Log detailed error
        return NextResponse.json({ message: 'Failed to retrieve users', error: error.message }, { status: 500 });
    }
}

// pages/api/user/getUserById/[id].js

import { Users } from '@/app/models/user'
import { NextResponse } from 'next/server';

export async function GET(request) {
    // Extract the user ID from the URL path
    const { pathname } = new URL(request.url);
    const userid = pathname.split('/').pop();

    try {
        // Find the user by ID
        const user = await Users.findById(userid);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Return the user data
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error); // Log detailed error
        return NextResponse.json({ message: 'Failed to retrieve user', error: error.message }, { status: 500 });
    }
}

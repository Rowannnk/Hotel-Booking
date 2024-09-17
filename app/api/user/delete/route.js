import { Users } from '@/models/user';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const { userid } = body;

    try {
        // Check if the user exists
        const user = await Users.findById(userid);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Delete the user
        await Users.findByIdAndDelete(userid);
        return NextResponse.json({ message: 'User account deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Account deletion error:', error);  // Log detailed error
        return NextResponse.json({ message: 'Account deletion failed', error: error.message }, { status: 500 });
    }
}

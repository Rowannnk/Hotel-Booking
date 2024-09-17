import { Users } from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;

    try {
        const user = await Users.findOne({ email });

        // Check if user exists and password matches
        if (user && await bcrypt.compare(password, user.password)) {
            // Return only necessary user information
            const userData = {
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                // Consider not returning _id if not needed
            };
            return NextResponse.json(userData, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Login Failed: Incorrect email or password' }, { status: 400 });
        }
    } catch (error) {
        console.error('Login error:', error);  // Log error details for debugging
        return NextResponse.json({ message: 'Login failed', error: error.message }, { status: 500 });  // Use 500 for server errors
    }
}

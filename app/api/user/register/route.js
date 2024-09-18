import { Users } from '@/app/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({ name, email, password: hashedPassword });

        await newUser.save();
        return NextResponse.json({ message: 'User Registered Successfully' }, { status: 200 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Registration failed', error: error.message }, { status: 400 });
    }
}

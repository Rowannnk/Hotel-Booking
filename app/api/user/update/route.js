import { Users } from '@/app/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
    const body = await request.json();
    const { userid, name, email, password, isAdmin } = body;  // Include isAdmin here

    try {
        const user = await Users.findById(userid);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Update fields only if provided
        if (name) user.name = name;
        if (email) user.email = email;

        // Hash password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update isAdmin only if provided, otherwise keep the existing value
        if (typeof isAdmin === 'boolean') {
            user.isAdmin = isAdmin;  // Update only if isAdmin is explicitly provided
        }

        // Save updated user
        await user.save();
        return NextResponse.json({ message: 'User account updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Account update error:', error);  // Log detailed error
        return NextResponse.json({ message: 'Account update failed', error: error.message }, { status: 400 });
    }
}

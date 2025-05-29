import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User, IUser } from '@/models/User';
import { sendTokenResponse } from '@/lib/authUtils';
// import { ErrorHandler } from '@/lib/errorHandler'; // If you create a separate error handler

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, password, gender } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Please provide name, email, and password' }, { status: 400 });
    }

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 }); // 409 Conflict
    }

    // Create user - password will be hashed by pre-save hook in User model
    user = await User.create({
      name,
      email,
      password,
      gender, // Assuming gender is part of your IUser and userSchema
      // avatar: { public_id: 'sample_id', url: 'sample_url' }, // Placeholder if avatar is required by schema
    });
    
    // The User model's select: false for password and salt should prevent them from being in 'user' object here.
    // However, sendTokenResponse also explicitly shapes the user data for the response.
    return sendTokenResponse(user, 201, 'User registered successfully');

  } catch (error: any) {
    console.error('Register API Error:', error);
    // Basic error handling, consider a more robust solution for production
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error.code === 11000) { // Duplicate key error (e.g. email or userID)
        return NextResponse.json({ message: 'Duplicate field value entered. Please check your email or user ID.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User, IUser } from '@/models/User';
import { sendTokenResponse } from '@/lib/authUtils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Please provide email and password' }, { status: 400 });
    }

    const user = await User.findOne({ email, loginDomain: 'system' }).select('+password +salt');

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    // User is authenticated, send token
    // The User model's select: false for password and salt should prevent them from being in 'user' object
    // when it's refetched without .select(). sendTokenResponse also curates the output.
    return sendTokenResponse(user, 200, 'Login successful');

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
  }
}

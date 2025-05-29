// src/lib/authUtils.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { User, IUser } from '@/models/User'; // Adjust path if your models are elsewhere
import dbConnect from './dbConnect';

interface DecodedToken {
  id: string;
  // iat: number; // Issued at
  // exp: number; // Expires at
}

export async function verifyAuth(req: NextRequest): Promise<{ user?: IUser; error?: NextResponse; status?: number }> {
  await dbConnect();
  const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return { error: NextResponse.json({ message: 'Login first to access this resource.' }, { status: 401 }), status: 401 };
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not defined in environment variables");
    return { error: NextResponse.json({ message: 'Server configuration error.' }, { status: 500 }), status: 500 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    // Ensure User model is connected by awaiting a query
    const user = await User.findById(decoded.id).exec();
    
    if (!user) {
      return { error: NextResponse.json({ message: 'User not found or invalid token.' }, { status: 401 }), status: 401 };
    }
    return { user };
  } catch (err: any) {
    console.error("Token verification failed:", err.message);
    // Provide a more generic error message for security
    return { error: NextResponse.json({ message: 'Session expired or token is invalid. Please log in again.' }, { status: 401 }), status: 401 };
  }
}

export function sendTokenResponse(user: IUser, statusCode: number, message: string) {
  const token = user.getJwtToken();

  const cookieExpiresTime = process.env.COOKIE_EXPIRES_TIME;
  if (!cookieExpiresTime || isNaN(Number(cookieExpiresTime))) {
    console.error('COOKIE_EXPIRES_TIME is not defined or invalid in environment variables. Using default of 7 days.');
  }
  const expiresInMs = (Number(cookieExpiresTime) || 7) * 24 * 60 * 60 * 1000; // Default to 7 days

  const options = {
    expires: new Date(Date.now() + expiresInMs),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  // Prepare user data for the response, explicitly excluding password and salt
  const userResponseData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    // Include other fields you want to send back, e.g., role, photo
    // Ensure password and salt are not included if they were accidentally selected
  };
  
  const response = NextResponse.json(
    { 
      success: true, 
      // token, // Token is sent in cookie, not usually in body for web clients
      user: userResponseData, // Send curated user data
      message 
    }, 
    { status: statusCode }
  );
  
  response.cookies.set('token', token, options);
  return response;
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/authUtils';
import { IUser } from '@/models/User'; // Import IUser if you want to type the user object

export async function GET(req: NextRequest) {
  const authResult = await verifyAuth(req);

  if (authResult.error) {
    return authResult.error;
  }

  if (!authResult.user) {
    // This case should ideally be handled by verifyAuth returning an error,
    // but as a fallback:
    return NextResponse.json({ message: 'Authentication failed.' }, { status: 401 });
  }

  const user = authResult.user as IUser; // Type assertion

  // Send back the user data
  // Ensure sensitive data like password and salt are not included.
  // The 'User' model has `select: false` for these, and verifyAuth fetches the user.
  // For extra safety, you can destructure and pick fields:
  const { _id, name, email, gender /* other safe fields */ } = user;

  return NextResponse.json({
    success: true,
    user: { _id, name, email, gender /* other safe fields */ },
  }, { status: 200 });
}

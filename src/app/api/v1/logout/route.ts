import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear the token cookie
    response.cookies.set('token', '', {
      expires: new Date(0), // Set expiry to a past date
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Should match sendTokenResponse
      path: '/', // Should match sendTokenResponse
    });

    return response;

  } catch (error: any) {
    console.error('Logout API Error:', error);
    return NextResponse.json({ message: 'An unexpected error occurred during logout.' }, { status: 500 });
  }
}

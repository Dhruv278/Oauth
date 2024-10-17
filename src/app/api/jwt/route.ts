// app/api/create-token/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { authType, data } = body;

        if (!authType || !data) {
            return NextResponse.json({ error: 'userId and email are required.' }, { status: 400 });
        }

        // Create a token
        const token = jwt.sign(
            { authType, data }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1D' } 
        );

        return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred while creating the token.' }, { status: 500 });
    }
}

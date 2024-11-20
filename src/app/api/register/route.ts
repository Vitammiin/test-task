import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = registerSchema.parse(body);

        const response = await fetch(`${process.env.FRONTEND_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error, message: data.message },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'SERVER_ERROR', message: 'Internal server error' },
            { status: 500 }
        );
    }
}

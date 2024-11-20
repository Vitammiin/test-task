import { NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = registerSchema.parse(body);


        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'SERVER_ERROR', message: 'Internal server error' },
            { status: 500 }
        );
    }
}

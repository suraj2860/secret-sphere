import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        
    } catch (error) {
        console.error('Error occured while registering user :: ', error);
        return Response.json(
            {
                success: false,
                message: 'Error occured while registering user'
            },
            {
                status: 500
            }
        )
    }
}

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { User as AuthUser } from "next-auth";
import mongoose from "mongoose";


export async function GET(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: AuthUser = session?.user as AuthUser;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }
    
    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const user = await User.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ]);
        //console.log(user);
        
        if(!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            ) 
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            { status: 200 }
        ) 
    } catch (error) {
        console.error("Error while fetching messages : ", error);
        
        return Response.json(
            {
                success: false,
                message: "Error while fetching messages"
            },
            { status: 500 }
        )
    }
}
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { User as AuthUser } from "next-auth";

export async function POST(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: AuthUser = session?.user as AuthUser;
    //console.log(user);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await req.json();

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "DB :: Failed to update user status to accept messages"
                },
                { status: 400 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages");

        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            { status: 500 }
        )
    }
}

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

    const userId = user._id;
    try {
        const foundUser = await User.findById(userId);

        if (!foundUser) {
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
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 202 }
        )
    } catch (error) {
        console.log("Error in getting message acceptance status");

        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            { status: 500 }
        )
    }
}

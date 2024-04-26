import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { Message } from "@/models/user.model";

export async function POST(req: Request) {
    await dbConnect();

    const {username, content} = await req.json();

    try {
        const user = await User.findOne({username});
        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }

        if(!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting messages"
                },
                { status: 403 }
            )
        }

        const newMessage = {content, createdAt: new Date()};
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.error("Error while sending message : ", error);
        
        return Response.json(
            {
                success: false,
                message: "Error while sending message"
            },
            { status: 500 }
        )
    }
}
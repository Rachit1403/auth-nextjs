import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();

        const { username, email, password } = reqBody;

        //Check if user already exist

        const userFound = await User.findOne({ email });

        if (userFound) {
            return NextResponse.json(
                { error: "User Already Exists" },
                { status: 400 }
            );
        }

        // hash Password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const hashedUser = new User({
            username,
            email,
            password: hash,
        });

        const userSaved = await hashedUser.save();

        return NextResponse.json({
            message: "User Created Successfully!",
            success: true,
            userSaved,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

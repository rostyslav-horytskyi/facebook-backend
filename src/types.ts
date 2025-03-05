import {Document} from "mongoose";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserI extends Document {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    picture: string;
    cover: string;
    gender: string;
    bYear: number;
    bMonth: number;
    bDay: number;
    verified: boolean;
    friends: string[];
    followings: string[];
    followers: string[];
    requests: string[];
    search: {user: string}[];
    details: {
        bio: string;
        otherName: string;
        job: string;
        workplace: string;
        highSchool: string;
        college: string;
        currentCity: string;
        hometown: string;
        relationship: string;
        instagram: string;
    };
    savedPosts: {post: string; savedAt: Date}[];
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload | { id: string };
}

export interface ResetPasswordRequestBody {
    email: string;
    code?: string;
    password?: string;
}

export interface UserResponse {
    email: string;
    picture: string;
}

export interface ErrorResponse {
    message: string;
}


import {Document} from "mongoose";

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

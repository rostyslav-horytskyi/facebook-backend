import mongoose, { Schema, Types, HydratedDocument } from "mongoose";
import type { UserI } from "../types";

// Define the user schema
const userSchema = new Schema<UserI>({
    first_name: {
        type: String,
        required: [true, 'First name is required.'],
        trim: true,
        text: true,
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required.'],
        trim: true,
        text: true,
    },
    username: {
        type: String,
        required: [true, 'Username is required.'],
        trim: true,
        text: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
    },
    picture: {
        type: String,
        default: ''
    },
    cover: {
        type: String,
    },
    gender: {
        type: String,
        required: [true, 'Gender is required.'],
    },
    bYear: {
        type: Number,
        required: true,
    },
    bMonth: {
        type: Number,
        required: true,
    },
    bDay: {
        type: Number,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    friends: {
        type: [Types.ObjectId],
        default: [],
        ref: 'User',
    },
    followings: {
        type: [Types.ObjectId],
        default: [],
        ref: 'User',
    },
    followers: {
        type: [Types.ObjectId],
        default: [],
        ref: 'User',
    },
    requests: {
        type: [Types.ObjectId],
        default: [],
        ref: 'User',
    },
    search: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
            }
        }
    ],
    details: {
        bio: {
            type: String,
        },
        otherName: {
            type: String,
        },
        job: {
            type: String,
        },
        workplace: {
            type: String,
        },
        highSchool: {
            type: String,
        },
        college: {
            type: String,
        },
        currentCity: {
            type: String,
        },
        hometown: {
            type: String,
        },
        relationship: {
            type: String,
            enum: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed']
        },
        instagram: {
            type: String,
        }
    },
    savedPosts: [
        {
            post: {
                type: Types.ObjectId,
                ref: 'Post',
            },
            savedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

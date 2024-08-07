const mongoose = require('mongoose');
const {Schema, Types: {ObjectId}} = mongoose;

const userSchema = Schema({
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
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    followers: {
        type: Array,
        default: [],
    },
    requests: {
        type: Array,
        default: [],
    },
    search: [
        {
            user: {
                type: ObjectId,
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
                type: ObjectId,
                ref: 'Post',
            },
            savedAt: {
                type: Date,
                default: new Date(),
            }
        }
    ],
}, {
    timestamps: true,
});

let User;

try {
    User = mongoose.model('User');
} catch (error) {
    User = mongoose.model('User', userSchema);
}

module.exports = User;
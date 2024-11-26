import mongoose from 'mongoose';

const EmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Email = mongoose.model('Email', EmailSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

interface User extends Document {
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    }
}

const userSchema = new Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User: Model<User> = mongoose.model<User>("User", userSchema);

export default User;

import bcrypt from 'bcryptjs';
import User from '../models/user.model';

const saltRounds = 10; 

const createUser = async (email: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user in the database
    const user = new User({ email, password: hashedPassword });
    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("User creation failed");
  }
};

export default { createUser };
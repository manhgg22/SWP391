import { User } from '../models/user.model';
import { AppError } from '../middleware/error';

class UserService {
  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }

  async updateProfile(userId: string, updateData: { name?: string; phone?: string; avatarUrl?: string }) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }
}

export const userService = new UserService();
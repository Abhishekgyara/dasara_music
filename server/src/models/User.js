import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true,
      lowercase: true,
      trim: true
    },
    name: { 
      type: String, 
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    passwordHash: { 
      type: String, 
      required: true
    },
    avatarUrl: { 
      type: String,
      default: function() {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=6366f1&color=fff`;
      }
    },
    preferences: {
      favoriteGenres: { type: [String], default: [] },
      moodPreferences: { type: [String], default: [] },
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
      }
    }
  }
);

userSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
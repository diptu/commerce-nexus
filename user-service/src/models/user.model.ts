import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";

import { addressSchema } from "./address.model.ts";

// -----------------------------
// Social Links Interface
// -----------------------------
export interface ISocialLinks {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    github?: string;
    website?: string;
}

// -----------------------------
// User Interface
// -----------------------------
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string | undefined;

    role: "customer" | "admin" | "superadmin";
    status: "active" | "suspended" | "archived";

    image: string;

    isEmailVerified: boolean;

    passwordResetToken?: string | undefined;
    passwordResetExpires?: Date | undefined;

    addresses: any[];

    socialLinks: ISocialLinks;

    // Instance Methods
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// -----------------------------
// Social Links Schema
// -----------------------------
const socialLinksSchema = new Schema<ISocialLinks>(
    {
        facebook: {
            type: String,
            trim: true,
        },

        linkedin: {
            type: String,
            trim: true,
        },

        twitter: {
            type: String,
            trim: true,
        },

        instagram: {
            type: String,
            trim: true,
        },

        tiktok: {
            type: String,
            trim: true,
        },

        youtube: {
            type: String,
            trim: true,
        },

        github: {
            type: String,
            trim: true,
        },

        website: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    }
);

// -----------------------------
// User Schema
// -----------------------------
const UserSchema: Schema<IUser> = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            maxlength: 50,
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            maxlength: 50,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address",
            ],
            index: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
            select: false,
        },

        role: {
            type: String,
            enum: ["customer", "admin", "superadmin"],
            default: "customer",
        },

        status: {
            type: String,
            enum: ["active", "suspended", "archived"],
            default: "active",
        },

        image: {
            type: String,
            default:
                process.env.IMAGE_UPLOAD_PATH ||
                "/assets/default-avatar.png",
        },

        // -----------------------------
        // Email Verification
        // -----------------------------
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        // -----------------------------
        // Password Recovery
        // -----------------------------
        passwordResetToken: {
            type: String,
        },

        passwordResetExpires: {
            type: Date,
        },

        // -----------------------------
        // Addresses
        // -----------------------------
        addresses: [addressSchema],

        // -----------------------------
        // Social Links
        // -----------------------------
        socialLinks: {
            type: socialLinksSchema,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

// -----------------------------
// Password Hash Middleware
// -----------------------------
UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(
        this.password as string,
        salt
    );

    // Clear reset fields after password update
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
});

// -----------------------------
// Instance Methods
// -----------------------------
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    if (!this.password) return false;

    return await bcrypt.compare(
        candidatePassword,
        this.password
    );
};

// -----------------------------
// Export Model
// -----------------------------
const User: Model<IUser> = mongoose.model<IUser>(
    "User",
    UserSchema
);

export default User;
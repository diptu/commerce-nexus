import mongoose from 'mongoose';

export const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
}, {
    _id: true, // Generates a unique ID for each address, making targeted updates/deletes easier 
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

export default addressSchema;
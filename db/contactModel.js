import mongoose, { Schema, SchemaType } from 'mongoose';

export const contactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Set name for contact'],
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
	},
	{ versionKey: false }
);

export const Contact = mongoose.model('Contact', contactSchema);

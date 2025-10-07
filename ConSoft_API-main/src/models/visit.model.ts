import { Schema, model, Types, InferSchemaType } from 'mongoose';

const VisitSchema = new Schema(
	{
    user: { type: Types.ObjectId, ref: 'User' },
		visitDate: { type: Date, required: true },
		address: { type: String, required: true, trim: true },
		status: { type: String, required: true, trim: true },
		services: {
			type: [
				{
					type: Types.ObjectId,
					required: true,
					ref: 'Servicio',
				},
			],
			default: [],
		},
	},
	{ collection: 'visitas' }
);

export const VisitModel = model('Visit', VisitSchema);

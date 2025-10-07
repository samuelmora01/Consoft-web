import { VisitModel } from '../models/visit.model';
import { createCrudController } from './crud.controller';

const base = createCrudController(VisitModel);

export const VisitController = {
	...base,

	list: async (_req: Request, res: Response) => {
		const visits = await VisitModel.find()
			.populate('user', 'name email') // ✔ user es un ObjectId
			.populate('services', 'name description'); // ✔ services es un array de ObjectId
		return res.json({ ok: true, visits });
	},

	get: async (req: Request, res: Response) => {
		const visit = await VisitModel.findById(req.params.id).populate('user', 'name email');
		if (!visit) return res.status(404).json({ message: 'Not found' });
		return res.json(visit);
	},

	create: async (req: Request, res: Response) => {
		try {
			const { visitDate, address, status, services, user } = req.body || {};
			const date = visitDate ? new Date(visitDate) : null;
			if (!date || isNaN(date.getTime())) {
				return res.status(400).json({ message: 'visitDate inválida o ausente' });
			}
			if (!address || !status) {
				return res.status(400).json({ message: 'address y status son requeridos' });
			}
			const servicesArray = Array.isArray(services) ? services : (services ? [services] : []);
			const payload = {
				user: user ?? undefined, // si existe, se usa; si no, queda undefined
				visitDate: date,
				address,
				status,
				services: servicesArray,
			};
			const created = await VisitModel.create(payload as any);
			return res.status(201).json(created);
		} catch (err) {
			return res.status(500).json({ error: 'Error creating visit' });
		}
	},
};

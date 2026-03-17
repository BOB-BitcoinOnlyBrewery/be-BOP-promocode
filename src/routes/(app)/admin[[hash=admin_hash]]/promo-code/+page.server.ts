import { collections } from '$lib/server/database';

export const load = async () => {
	const promoCodes = await collections.promoCodes.find({}).sort({ createdAt: -1 }).toArray();

	return { promoCodes };
};

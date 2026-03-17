import { collections } from '$lib/server/database';
import { adminPrefix } from '$lib/server/admin';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { CURRENCIES } from '$lib/types/Currency';

export async function load({ params }) {
	const promoCode = await collections.promoCodes.findOne({ _id: params.id });

	if (!promoCode) {
		throw error(404, 'Promo code not found');
	}

	return { promoCode };
}

export const actions = {
	update: async function ({ request, params }) {
		const promoCode = await collections.promoCodes.findOne({ _id: params.id });
		if (!promoCode) {
			throw error(404, 'Promo code not found');
		}

		const formData = await request.formData();

		const parsed = z
			.object({
				label: z.string().min(1).max(100),
				discountValue: z.coerce.number().positive(),
				currency: z.enum([CURRENCIES[0], ...CURRENCIES.slice(1)]).optional(),
				maxUses: z.coerce.number().int().positive().nullable(),
				minimumAmount: z.coerce.number().positive().optional(),
				beginsAt: z.date({ coerce: true }),
				endsAt: z.date({ coerce: true }).nullable(),
				active: z.boolean({ coerce: true }).default(false)
			})
			.parse({
				label: formData.get('label'),
				discountValue: formData.get('discountValue'),
				currency: formData.get('currency') || undefined,
				maxUses: formData.get('maxUses') || null,
				minimumAmount: formData.get('minimumAmount') || undefined,
				beginsAt: formData.get('beginsAt'),
				endsAt: formData.get('endsAt') || null,
				active: formData.get('active')
			});

		if (promoCode.discountType === 'percentage' && parsed.discountValue > 100) {
			throw error(400, 'Percentage must be between 0 and 100');
		}

		await collections.promoCodes.updateOne(
			{ _id: params.id },
			{ $set: { ...parsed, updatedAt: new Date() } }
		);
	},

	delete: async function ({ params }) {
		await collections.promoCodes.deleteOne({ _id: params.id });
		throw redirect(303, `${adminPrefix()}/promo-code`);
	}
};

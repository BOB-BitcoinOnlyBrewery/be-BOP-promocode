import { collections } from '$lib/server/database';
import type { Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { adminPrefix } from '$lib/server/admin';
import { CURRENCIES } from '$lib/types/Currency';

export const actions: Actions = {
	default: async function ({ request }) {
		const formData = await request.formData();

		const parsed = z
			.object({
				code: z
					.string()
					.min(1)
					.max(50)
					.regex(/^[A-Z0-9_-]+$/, 'Code must be uppercase alphanumeric'),
				label: z.string().min(1).max(100),
				discountType: z.enum(['percentage', 'fiat']),
				discountValue: z.coerce.number().positive(),
				currency: z.enum([CURRENCIES[0], ...CURRENCIES.slice(1)]).optional(),
				maxUses: z.coerce.number().int().positive().nullable(),
				minimumAmount: z.coerce.number().positive().optional(),
				beginsAt: z.date({ coerce: true }),
				endsAt: z.date({ coerce: true }).nullable(),
				active: z.boolean({ coerce: true }).default(true)
			})
			.parse({
				code: String(formData.get('code') ?? '').toUpperCase(),
				label: formData.get('label'),
				discountType: formData.get('discountType'),
				discountValue: formData.get('discountValue'),
				currency: formData.get('currency') || undefined,
				maxUses: formData.get('maxUses') || null,
				minimumAmount: formData.get('minimumAmount') || undefined,
				beginsAt: formData.get('beginsAt'),
				endsAt: formData.get('endsAt') || null,
				active: formData.get('active')
			});

		if (parsed.discountType === 'percentage' && parsed.discountValue > 100) {
			throw error(400, 'Percentage must be between 0 and 100');
		}

		if (parsed.discountType === 'fiat' && !parsed.currency) {
			throw error(400, 'Currency is required for fixed amount discount');
		}

		const existing = await collections.promoCodes.findOne({ code: parsed.code });
		if (existing) {
			throw error(400, `Code "${parsed.code}" already exists`);
		}

		const now = new Date();
		await collections.promoCodes.insertOne({
			...parsed,
			_id: parsed.code,
			usedCount: 0,
			createdAt: now,
			updatedAt: now
		});

		throw redirect(303, `${adminPrefix()}/promo-code/${parsed.code}`);
	}
};

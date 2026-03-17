import { collections } from '$lib/server/database';
import { userIdentifier, userQuery } from '$lib/server/user';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

/** Apply a promo code to the cart */
export const POST: RequestHandler = async ({ request, locals }) => {
	const { code } = z
		.object({ code: z.string().min(1).max(50) })
		.parse(await request.json());

	const upperCode = code.toUpperCase();
	const now = new Date();

	const promoCode = await collections.promoCodes.findOne({
		code: upperCode,
		active: true,
		beginsAt: { $lte: now },
		$or: [{ endsAt: null }, { endsAt: { $gt: now } }]
	});

	if (!promoCode) {
		throw error(404, 'Promo code not found or expired');
	}

	if (promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) {
		throw error(400, 'Promo code usage limit reached');
	}

	// Save to cart (minimum amount will be validated at checkout)
	await collections.carts.updateOne(
		userQuery(userIdentifier(locals)),
		{
			$set: {
				appliedPromoCode: { code: upperCode, promoCodeId: promoCode._id },
				updatedAt: new Date()
			}
		},
		{ upsert: false }
	);

	return json({
		code: promoCode.code,
		label: promoCode.label,
		discountType: promoCode.discountType,
		discountValue: promoCode.discountValue,
		currency: promoCode.currency,
		minimumAmount: promoCode.minimumAmount
	});
};

/** Remove the promo code from the cart */
export const DELETE: RequestHandler = async ({ locals }) => {
	await collections.carts.updateOne(userQuery(userIdentifier(locals)), {
		$unset: { appliedPromoCode: '' },
		$set: { updatedAt: new Date() }
	});

	return json({ success: true });
};

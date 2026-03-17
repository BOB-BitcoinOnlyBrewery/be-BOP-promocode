import type { Currency } from './Currency';
import type { Timestamps } from './Timestamps';

export type PromoCode = Timestamps & {
	_id: string;
	/** Le code que l'utilisateur saisit (ex: "BITCOIN10") — stocké en majuscules */
	code: string;
	/** Nom interne pour identifier la campagne (ex: "Chauffagistes 10%") */
	label: string;
	discountType: 'percentage' | 'fiat';
	/** Valeur du discount : pourcentage (0-100) ou montant en devise */
	discountValue: number;
	/** Devise pour discountType 'fiat'. Doit être défini si discountType === 'fiat' */
	currency?: Currency;
	/** null = illimité */
	maxUses: number | null;
	usedCount: number;
	/** Montant minimum du panier (en devise principale du shop) pour que le code soit applicable */
	minimumAmount?: number;
	beginsAt: Date;
	endsAt: Date | null;
	active: boolean;
};

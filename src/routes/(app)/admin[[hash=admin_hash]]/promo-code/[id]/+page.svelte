<script lang="ts">
	import { enhance } from '$app/forms';
	import { CURRENCIES } from '$lib/types/Currency';

	export let data;

	const pc = data.promoCode;
	let beginsAt = pc.beginsAt?.toJSON?.().slice(0, 10) ?? '';
	let endsAt = pc.endsAt?.toJSON?.().slice(0, 10) ?? '';
</script>

<h1 class="text-3xl font-mono">{pc.code}</h1>
<p class="text-gray-500 mb-4">
	Used {pc.usedCount}{pc.maxUses !== null ? ` / ${pc.maxUses}` : ''} times
</p>

<form method="post" action="?/update" class="flex flex-col gap-4 max-w-lg" use:enhance>
	<label class="form-label">
		Internal label
		<input class="form-input" type="text" name="label" value={pc.label} maxlength="100" required />
	</label>

	<label class="form-label">
		{pc.discountType === 'percentage' ? 'Percentage (1–100)' : 'Amount'}
		<input
			class="form-input"
			type="number"
			name="discountValue"
			value={pc.discountValue}
			min="0.01"
			max={pc.discountType === 'percentage' ? 100 : undefined}
			step="0.01"
			required
		/>
	</label>

	{#if pc.discountType === 'fiat'}
		<label class="form-label">
			Currency
			<select name="currency" class="form-input">
				{#each CURRENCIES as c}
					<option value={c} selected={c === pc.currency}>{c}</option>
				{/each}
			</select>
		</label>
	{/if}

	<label class="form-label">
		Start date
		<input class="form-input" type="date" name="beginsAt" bind:value={beginsAt} required />
	</label>

	<label class="form-label">
		End date (leave empty = no expiry)
		<input class="form-input" type="date" name="endsAt" bind:value={endsAt} />
	</label>

	<label class="form-label">
		Max uses (leave empty = unlimited)
		<input
			class="form-input"
			type="number"
			name="maxUses"
			value={pc.maxUses ?? ''}
			min="1"
			step="1"
		/>
	</label>

	<label class="form-label">
		Minimum order amount (leave empty = none)
		<input
			class="form-input"
			type="number"
			name="minimumAmount"
			value={pc.minimumAmount ?? ''}
			min="0.01"
			step="0.01"
		/>
	</label>

	<label class="checkbox-label">
		<input type="checkbox" name="active" class="form-checkbox" checked={pc.active} />
		Active
	</label>

	<input type="submit" class="btn btn-blue self-start text-white" value="Save" />
</form>

<form method="post" action="?/delete" class="mt-8" use:enhance>
	<button type="submit" class="btn text-red-600 border border-red-600">Delete this code</button>
</form>

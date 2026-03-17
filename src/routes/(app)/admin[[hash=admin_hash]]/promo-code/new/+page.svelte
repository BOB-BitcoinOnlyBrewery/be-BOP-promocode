<script lang="ts">
	import { enhance } from '$app/forms';
	import { CURRENCIES } from '$lib/types/Currency';

	let discountType = 'percentage';
	let beginsAt = new Date().toJSON().slice(0, 10);
	let endsAt = '';
	let hasMaxUses = false;
	let hasMinimum = false;
	let hasEndDate = false;
</script>

<h1 class="text-3xl">New promo code</h1>

<form method="post" class="flex flex-col gap-4 max-w-lg mt-4" use:enhance>
	<label class="form-label">
		Code (uppercase, ex: BITCOIN10)
		<input
			class="form-input font-mono uppercase"
			type="text"
			name="code"
			pattern="[A-Z0-9_-]+"
			maxlength="50"
			placeholder="BITCOIN10"
			required
		/>
	</label>

	<label class="form-label">
		Internal label
		<input
			class="form-input"
			type="text"
			name="label"
			maxlength="100"
			placeholder="Bitcoin community — 10% off"
			required
		/>
	</label>

	<label class="form-label">
		Discount type
		<select name="discountType" class="form-input" bind:value={discountType}>
			<option value="percentage">Percentage (%)</option>
			<option value="fiat">Fixed amount</option>
		</select>
	</label>

	<label class="form-label">
		{discountType === 'percentage' ? 'Percentage (1–100)' : 'Amount'}
		<input
			class="form-input"
			type="number"
			name="discountValue"
			min="0.01"
			max={discountType === 'percentage' ? 100 : undefined}
			step="0.01"
			required
		/>
	</label>

	{#if discountType === 'fiat'}
		<label class="form-label">
			Currency
			<select name="currency" class="form-input">
				{#each CURRENCIES as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
		</label>
	{/if}

	<label class="form-label">
		Start date
		<input class="form-input" type="date" name="beginsAt" bind:value={beginsAt} required />
	</label>

	<label class="checkbox-label">
		<input type="checkbox" class="form-checkbox" bind:checked={hasEndDate} />
		Set an end date
	</label>
	{#if hasEndDate}
		<label class="form-label">
			End date
			<input class="form-input" type="date" name="endsAt" bind:value={endsAt} />
		</label>
	{/if}

	<label class="checkbox-label">
		<input type="checkbox" class="form-checkbox" bind:checked={hasMaxUses} />
		Limit number of uses
	</label>
	{#if hasMaxUses}
		<label class="form-label">
			Max uses
			<input class="form-input" type="number" name="maxUses" min="1" step="1" required />
		</label>
	{/if}

	<label class="checkbox-label">
		<input type="checkbox" class="form-checkbox" bind:checked={hasMinimum} />
		Minimum order amount
	</label>
	{#if hasMinimum}
		<label class="form-label">
			Minimum amount
			<input class="form-input" type="number" name="minimumAmount" min="0.01" step="0.01" required />
		</label>
	{/if}

	<label class="checkbox-label">
		<input type="checkbox" name="active" class="form-checkbox" checked />
		Active
	</label>

	<input type="submit" class="btn btn-blue self-start text-white" value="Create" />
</form>

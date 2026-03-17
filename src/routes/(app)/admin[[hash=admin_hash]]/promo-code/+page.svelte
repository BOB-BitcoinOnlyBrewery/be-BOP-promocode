<script lang="ts">
	export let data;
</script>

<a href="{data.adminPrefix}/promo-code/new" class="underline block">Add promo code</a>

<h1 class="text-3xl">Promo codes</h1>

<table class="w-full text-left mt-4">
	<thead>
		<tr class="border-b">
			<th class="p-2">Code</th>
			<th class="p-2">Label</th>
			<th class="p-2">Discount</th>
			<th class="p-2">Uses</th>
			<th class="p-2">Status</th>
			<th class="p-2">Expires</th>
		</tr>
	</thead>
	<tbody>
		{#each data.promoCodes as pc}
			<tr class="border-b">
				<td class="p-2">
					<a href="{data.adminPrefix}/promo-code/{pc._id}" class="underline text-blue font-mono">
						{pc.code}
					</a>
				</td>
				<td class="p-2">{pc.label}</td>
				<td class="p-2">
					{#if pc.discountType === 'percentage'}
						{pc.discountValue}%
					{:else}
						{pc.discountValue} {pc.currency ?? ''}
					{/if}
				</td>
				<td class="p-2">
					{pc.usedCount}{pc.maxUses !== null ? ` / ${pc.maxUses}` : ''}
				</td>
				<td class="p-2">
					{#if !pc.active}
						<span class="text-red-500">Inactive</span>
					{:else if pc.endsAt && pc.endsAt < new Date()}
						<span class="text-gray-500">Expired</span>
					{:else}
						<span class="text-green-600">Active</span>
					{/if}
				</td>
				<td class="p-2">{pc.endsAt ? pc.endsAt.toLocaleDateString() : '—'}</td>
			</tr>
		{:else}
			<tr><td colspan="6" class="p-2 text-gray-500">No promo codes yet</td></tr>
		{/each}
	</tbody>
</table>

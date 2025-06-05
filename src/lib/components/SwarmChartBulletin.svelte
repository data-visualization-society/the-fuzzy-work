<script>
	// @ts-nocheck
	import { format } from 'd3';
	let { company, colorScale } = $props();

	function formatDate(string) {
		const [month, day, year] = string.split('/');
		const dateObj = new Date(year, month - 1, day);
		const options = { month: 'short', day: 'numeric', year: 'numeric' };
		return dateObj.toLocaleDateString('en-US', options);
	}
</script>

{#if company.company}
	<div
		class="layoff-details"
		style="
			border-top: 8px solid {colorScale(company.stage)};
			border-bottom: 2px solid {colorScale(company.stage)};"
	>
		<p>
			<span>Company: </span>
			{company.company} <br />
			<span>Industry: </span>
			{company.industry} <br />
			<span>Total layoffs: </span>
			{format(',')(company.layoff)} ppl
		</p>
		<table>
			<tbody>
				{#each company.events as e}
					<tr>
						<td>
							{formatDate(e.date)}
						</td>
						<td>
							{e.location.split(',')[0]} <br />
							{e.country}
						</td>
						<td>
							{format(',')(e.layoff)} <br />
							{e.percentage ? e.percentage : 'null'}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>Click another circle to view a different company.</p>
{:else}
	<p>Click a circle to view details.</p>
{/if}

<style>
	.layoff-details {
		background: white;
		padding: 0.75em;
		border-radius: 5px 5px 2px 2px;
	}

	.layoff-details p {
		margin-top: 0;
	}

	.layoff-details p span {
		text-transform: uppercase;
		font-size: 0.75em;
		color: var(--color-light-blue);
	}

	table {
		--border: var(--color-lightest-blue);
		width: 100%;
		text-align: left;
		font-size: 0.85em;
		border-spacing: 0;
	}

	table td:first-child {
		width: 5em;
	}

	table td:last-child {
		text-align: right;
	}
	table td {
		padding: 0.5em 0;
		border-top: 1px solid var(--border);
	}
</style>

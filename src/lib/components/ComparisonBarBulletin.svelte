<script>
	//@ts-check
	import { format } from 'd3';
	let { measure, selected } = $props();
</script>

<div>
	{#if selected}
		<p>
			Click on a different <span style="text-transform: uppercase; font-size: 0.85em"
				>{measure}</span
			>
			to see details.
		</p>
		<div class="details">
			<span>Industry: </span>
			{selected.key} <br />
			<span>Companies: </span>
			{selected.companies} <br />
			<span>100% layoff: </span>
			{selected.bankrupted} <br />
			<span>Job loss: </span>
			{format(',')(selected.ppl_laidoff)} <br />
		</div>
	{:else}
		<p>
			Click on <span style="text-transform: uppercase; font-size: 0.85em">{measure}</span> in the chart
			to see details.
		</p>
	{/if}
</div>

<style>
	.details {
		background: white;
		padding: 0.75em;
		border-radius: 5px 5px 2px 2px;
		border-top: var(--color-dark-bg) 5px solid;
		border-bottom: var(--color-dark-bg) 2px solid;
	}
	.details span {
		text-transform: uppercase;
		font-size: 0.75em;
		color: var(--color-light-blue);
	}
</style>

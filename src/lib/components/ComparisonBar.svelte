<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	let { measure, data, selectedKey } = $props();

	let rangeCom = $state();
	let rangePpl = $state();

	const companyExtent = d3.extent(data, (d) => d.companies);
	const pplExtent = d3.extent(data, (d) => d.ppl_laidoff);
	const comScale = $derived(
		d3.scaleLinear().rangeRound([0, rangeCom]).domain([0, companyExtent[1]])
	);
	const pplScale = $derived(d3.scaleLinear().rangeRound([0, rangePpl]).domain([0, pplExtent[1]]));
	function handleBlur() {
		selectedKey(null);
	}
</script>

<div class="header container">
	<p>Companies</p>
	<p>{measure}</p>
	<p>Jobs Eliminated</p>
</div>

<div class="container" style="padding: 0.5em 2em">
	{#each data as d}
		<div class="bar-container" bind:clientWidth={rangeCom}>
			<div class="company bar" style="width: {comScale(d.companies)}px"></div>
		</div>
		<button
			class="key"
			onclick={() => {
				selectedKey(d);
			}}
			onblur={handleBlur}
		>
			{d.key}
		</button>
		<div class="bar-container" bind:clientWidth={rangePpl}>
			<div class="ppl bar" style="width: {pplScale(d.ppl_laidoff)}px"></div>
		</div>
	{/each}
</div>
<div class="footer container">
	<p>Max: {companyExtent[1]} --- Min: {companyExtent[0]}</p>
	<p>Count: {data.length}</p>
	<p>Max: {d3.format(',')(pplExtent[1])} --- Min: {d3.format(',')(pplExtent[0])}</p>
</div>

<style>
	.container {
		background: white;
		display: grid;
		grid-template-columns: 1fr 8em 1fr;
		align-items: center;
	}

	.header,
	.footer {
		text-align: center;
		text-transform: uppercase;
		font-size: 0.85em;
		color: var(--color-light-blue);
	}

	.header {
		border-bottom: var(--color-light-bg) solid 2px;
	}

	.footer {
		border-top: var(--color-light-bg) solid 2px;
	}

	.key {
		background: none;
		border: none;
		padding: 0.1em 0;
		color: var(--color-dark-bg);
	}

	.key:hover,
	.key:focus {
		color: var(--color-accent-on-light);
	}

	.bar-container {
		position: relative;
	}
	.bar {
		position: absolute;
		transform: translate(0, -50%);
		height: 0.65em;
		background: var(--color-light-blue);
	}

	.ppl.bar {
		left: 0;
	}

	.company.bar {
		right: 0;
	}
</style>

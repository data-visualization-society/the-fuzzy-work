<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	let { measure, data, selectedKey } = $props();

	let width = $state();
	let height = $state();
	let margin = {
		left: 120,
		right: 20,
		top: 30,
		bottom: 80
	};

	let bound = $derived({
		w: width - margin.left - margin.right,
		h: height - margin.top - margin.bottom
	});

	const pplExtent = d3.extent(data, (d) => d.ppl_laidoff);

	let xScale = $derived(d3.scaleLinear().rangeRound([0, bound.w]).domain([0, pplExtent[1]]));
	let ticks = $derived(xScale.ticks(5));

	// Tooltip state
	let tooltip = $state({
		visible: false,
		x: 0,
		y: 0,
		data: null
	});

	// Tooltip functions
	function showTooltip(event, d) {
		const rect = event.target.getBoundingClientRect();
		let x = event.clientX + 10;
		let y = event.clientY - 10;

		// Prevent going off right edge
		if (x + 200 > window.innerWidth) {
			x = event.clientX - 210;
		}

		// Prevent going off top edge
		if (y < 0) {
			y = event.clientY + 20;
		}

		tooltip.visible = true;
		tooltip.x = x;
		tooltip.y = y;
		tooltip.data = d;
	}

	function hideTooltip() {
		tooltip.visible = false;
	}

	function moveTooltip(event) {
		if (tooltip.visible) {
			tooltip.x = event.clientX + 10;
			tooltip.y = event.clientY - 10;
		}
	}

	$inspect(tooltip);
</script>

<svg class="chart" bind:clientWidth={width} bind:clientHeight={height}>
	<text
		class="chart-title"
		x={width / 2}
		y={height - margin.bottom / 4}
		text-anchor="middle"
		alignment-baseline="baseline"
	>
		People laid off by industry
	</text>
	<g class="axis" transform="translate({margin.left}, {margin.top})">
		{#each ticks as t}
			<line x1={xScale(t)} x2={xScale(t)} y1="0" y2={bound.h} />
			<text x={xScale(t)} y={bound.h + 20} text-anchor="middle">{d3.format(',')(t)}</text>
		{/each}
	</g>
	{#each data as d, i}
		<g transform="translate({margin.left},{margin.top + i * (bound.h / data.length)})">
			<text x="-10" y="0" text-anchor="end" alignment-baseline="hanging">
				{d.key}
			</text>
			<rect
				class="bar"
				x="0"
				y="0"
				width={xScale(d.ppl_laidoff)}
				onmouseenter={(event) => showTooltip(event, d)}
				onmouseleave={hideTooltip}
				onmousemove={moveTooltip}
			/>
		</g>
	{/each}
</svg>

<!-- Tooltip -->
{#if tooltip.visible && tooltip.data}
	<div class="tooltip" style:left="{tooltip.x}px" style:top="{tooltip.y}px">
		<div class="tooltip-content">
			<strong>{tooltip.data.key}</strong>
			<div>
				People laid off: <span class="value">{d3.format(',')(tooltip.data.ppl_laidoff)}</span>
			</div>
		</div>
	</div>
{/if}

<style>
	svg {
		width: 100%;
		height: calc(100vh - 2em);
		min-height: 520px;
		max-height: 1000px;
	}
	.chart-title {
		font-size: 1rem;
		text-transform: uppercase;
		font-weight: 600;
		fill: var(--color-light-blue);
	}
	.bar {
		height: 0.8rem;
	}
	.axis line {
		stroke-width: 1px;
		stroke: var(--color-lightest-blue);
	}
	.axis text {
		font-size: 0.75rem;
		stroke-width: 0;
	}
	.tooltip {
		font-family: var(--font-sans);
		position: fixed;
		pointer-events: none;
		z-index: 1000;
		background: var(--color-dark-bg);
		color: white;
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 14px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		max-width: 200px;
		opacity: 0;
		animation: fadeIn 0.2s ease forwards;
	}

	.tooltip-content {
		line-height: 1.4;
	}

	.tooltip-content strong {
		display: block;
		margin-bottom: 4px;
		font-weight: 600;
	}

	.value {
		font-weight: 600;
		color: var(--color-accent-on-dark);
	}
	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}
</style>

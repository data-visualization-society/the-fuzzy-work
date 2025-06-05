<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import './style.css';
	import SwarmChart from './SwarmChart.svelte';
	import Bulletin from './SwarmChartBulletin.svelte';
	import { getContext } from 'svelte';

	let { relationships, layoffByCompany } = $props();

	const industries = getContext('industryData');
	const colorScale = getContext('stageColor');
	const stages = getContext('stages');

	const allIndustries = Array.from(industries.map((d) => d.key));
	const top20 = d3.sum(layoffByCompany.slice(0, 379), (d) => d.layoff);
	const total = d3.sum(layoffByCompany, (d) => d.layoff);
	const dataExtent = d3.extent(layoffByCompany, (d) => d.layoff);

	const rScale = d3.scaleSqrt().domain([0, 100]).range([2, 10]);

	let chartWidth = 625;
	let chartHeight = chartWidth * 1.5;

	let slices = $state(1);
	let layoffNumBound = $state([200, 30000]);
	let selectedCompany = $state({});
	let selectedIndustries = $state(['Other']);

	let slicedData = $derived.by(() => {
		const filteredData = layoffByCompany.filter(
			(d) =>
				d.layoff >= layoffNumBound[0] &&
				d.layoff <= layoffNumBound[1] &&
				selectedIndustries.includes(d.industry)
		);

		const quantileScale = d3
			.scaleQuantile()
			.domain(filteredData.map((d) => d.layoff))
			.range([...Array(slices).keys()]);

		const quantiles = quantileScale.range().sort(d3.descending);

		let data = [];

		quantiles.forEach((n) => {
			data.push(filteredData.filter((d) => quantileScale(d.layoff) === n));
		});

		return data;
	});

	function getCompanyCountbyStage(data, stage) {
		let count = 0;
		data.forEach((s) => {
			count += s.filter((d) => d.stage === stage).length;
		});

		return count;
	}

	function findRelatedInd(ind) {
		const relatedIndustries = {
			[ind]: true
		};

		relationships.forEach((rel) => {
			if (rel.Strength === 2 && (rel.Source === ind || rel.Target === ind)) {
				relatedIndustries[rel.Target] = true;
				relatedIndustries[rel.Source] = true;
			}
		});

		selectedIndustries = Object.keys(relatedIndustries);
	}

	function handleSelection(e) {
		const isChecked = e.currentTarget.checked;
		const currentInd = e.currentTarget.value;
		const i = selectedIndustries.indexOf(currentInd);
		console.log(i, $state.snapshot(selectedIndustries));

		if (i !== -1) {
			selectedIndustries.splice(i, 1);
		} else {
			findRelatedInd(currentInd);
		}
	}
</script>

<div class="main-content">
	<h2>80% of job loss came from 20% of companies</h2>
	<p>
		The layoff pattern follows the 80-20 rule: The top 20% of companies are responsible for 80% of
		job elimination.
	</p>
	<p>
		Specifically, of {layoffByCompany.length} companies in the dataset, the top {Math.round(
			layoffByCompany.length / 5
		)} companies eliminated {d3.format(',')(top20)} jobs, out of the total {d3.format(',')(total)} job
		loss.
	</p>

	<p>
		The job elimination per company ranges from {dataExtent[0]}
		to {d3.format(',')(dataExtent[1])}.
	</p>
	<p>You can use the filters below to play with the data and see more patterns.</p>
</div>
<form class="main-content">
	<fieldset>
		<legend>Filter selected industries:</legend>
		<div style="display: grid;  grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));">
			{#each allIndustries as ind}
				<label class="select-industries">
					<input
						type="checkbox"
						value={ind}
						bind:group={selectedIndustries}
						onclick={handleSelection}
					/>
					{ind}
				</label>
			{/each}
		</div>
		<div style="text-align: right; margin-top: 0.5em;">
			<button
				type="button"
				onclick={() => {
					selectedIndustries = allIndustries;
				}}>Select All</button
			>
			<button
				type="button"
				onclick={() => {
					selectedIndustries = [];
				}}>Unselect All</button
			>
		</div>
	</fieldset>
	<div
		style="
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1em;
	"
	>
		<fieldset>
			<legend>Filter data range:</legend>
			<label class="pair" for="min"
				>Min:
				<input id="min" type="number" min="1" max="30000" bind:value={layoffNumBound[0]} />
			</label>

			<label class="pair" for="max">
				Max:
				<input id="max" type="number" min="1" max="30000" bind:value={layoffNumBound[1]} />
			</label>
		</fieldset>
		<fieldset>
			<legend>Observe data distribution:</legend>
			<label for="quantiles">
				Slice into <input id="quantiles" type="number" min="1" max="10" bind:value={slices} />
				quantiles</label
			>

			{#if slices === 10}
				<p class="warning">10 is the maximum slices allowed.</p>
			{/if}
		</fieldset>
	</div>
</form>
<aside>
	<p class="insight">
		When you select one industry, related industries will be selected by default. You can adjust the
		selection as you see fit.
	</p>
</aside>

<div class="main-content">
	<div class="color-encoding">
		<p class="label">
			Stage <br /> Count
		</p>
		{#each stages as stage}
			<p style="color: {colorScale(stage)}; text-align: center; font-size: 0.9em;">
				{stage}<br />
				{getCompanyCountbyStage(slicedData, stage)}
			</p>
		{/each}
	</div>

	{#each slicedData as slice, i (slice)}
		<SwarmChart
			{stages}
			{colorScale}
			{rScale}
			data={slice}
			height={chartHeight / slicedData.length}
			width={chartWidth}
			whichCompany={(node) => {
				selectedCompany = node;
			}}
		/>
	{/each}
</div>
<aside>
	<p>
		Each circle represents a company. The circle size corresponds to the percentage of people laid
		off from a company:
	</p>
	<ul class="rLedgend" style="grid-template-columns: repeat(auto-fill, minmax(6em, 1fr));">
		<li>
			<span style="width: {rScale(1) * 2}px; background:{colorScale(selectedCompany.stage)}"></span>
			1%
		</li>
		<li>
			<span style="width: {rScale(50) * 2}px; background:{colorScale(selectedCompany.stage)}"
			></span> 50%
		</li>
		<li>
			<span style="width: {rScale(100) * 2}px; background:{colorScale(selectedCompany.stage)}"
			></span> 100%
		</li>
		<li>
			<span
				style="opacity: 75%; width: {rScale(20) *
					2}px; border: 1px solid black; background:{colorScale(selectedCompany.stage)}"
			></span> unknown
		</li>
	</ul>

	<Bulletin company={selectedCompany} {colorScale} />
</aside>

<style>
	ul {
		display: grid;
		list-style: none;
		padding: 0.25em;
	}

	li {
		margin: 0.25em 0;
	}
	.rLedgend li {
		display: flex;
		align-items: center;
	}
	.rLedgend span {
		display: block;
		float: left;
		aspect-ratio: 1;
		margin-right: 1em;
		border-radius: 50%;
		background: #cc5456;
	}
	.color-encoding {
		display: flex;
		width: 100%;
		justify-content: space-around;
		background: white;
	}

	.color-encoding .label {
		text-transform: uppercase;
		font-size: 0.75em;
		line-height: 200%;
		color: var(--color-light-blue);
	}
</style>

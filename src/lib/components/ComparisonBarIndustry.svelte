<script>
	//@ts-nocheck
	import { getContext } from 'svelte';
	// import ComparisonBar from './ComparisonBar.svelte';
	import ComparisonBarBulletin from './ComparisonBarBulletin.svelte';
	import BarChart from './BarChart.svelte';
	const data = getContext('industryData');
	const measure = 'industry';
	let selected = $state();
</script>

<div class="main-content">
	<h2>The most impacted industries</h2>
	<p>
		The chart below compares the number of companies that announced layoff events and the number of
		jobs eliminated in each industry.
	</p>
	<p>Note that the definition of an industry can be ambiguous.</p>
	<ul>
		<li>&ldquo;Other&rdquo; included companies like Microsoft, Miro, Oracle, and Asana.</li>
		<li>
			&ldquo;Infrastructure&rdquo; refers to information networking companies like Cisco, VMware,
			New Relic, Docker, and BitTorrent.
		</li>
		<li>
			Google and Meta are classified as &ldquo;Consumer&rdquo;, whereas Apple is in
			&ldquo;Hardware&rdquo;, and Amazon is in &ldquo;Retail&rdquo;, although they all have
			businesses in different industries.
		</li>
	</ul>
	<BarChart
		{measure}
		{data}
		selectedKey={(key) => {
			selected = key;
		}}
	/>

	<!-- <ComparisonBar
		{measure}
		{data}
		selectedKey={(key) => {
			selected = key;
		}}
	/> -->
</div>
<!-- <aside>
	<p class="insight">
		Only a few hardware companies made layoff announcements, yet the number of jobs eliminated in
		this field is quite high.
	</p>
	<p class="insight">
		Consumer, Retail, Transportation, and Finance are among the top industries that have slashed
		jobs in the past five years.
	</p>
	<ComparisonBarBulletin {measure} {selected} />
</aside> -->

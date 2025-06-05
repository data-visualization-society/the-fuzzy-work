<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import { setContext } from 'svelte';

	import '$lib/components/style.css';
	import DraggableWordCloud from '$lib/components/DraggableWordCloud.svelte';
	import ComparisonBar from '$lib/components/ComparisonBar.svelte';
	import DeepDiveCompanies from '$lib/components/SwarmChartComponent.svelte';
	import ComparisonBarIndustry from '$lib/components/ComparisonBarIndustry.svelte';
	import ComparisonBarStage from '$lib/components/ComparisonBarStage.svelte';
	import HeatMapChart from '$lib/components/HeatMapChart.svelte';

	let { data } = $props();
	const relationships = data.relationships;
	const layoffByCompany = data.layoffByCompany.sort((a, b) => d3.descending(a.layoff, b.layoff));
	const bankrupted = layoffByCompany.filter((d) => d.percentage === 100);
	const stages = ['Public', 'Private', 'Unknown', 'Early Stage', 'Mid Stage', 'Late Stage'];

	const colorScale = d3
		.scaleOrdinal()
		.domain(stages)
		.range(['#EA216E', '#3DCC93', '#C9C544', '#6EB5F8', '#2A59E4', '#8841E6']);

	function rollupByX(string, data = layoffByCompany) {
		const counts = d3.rollups(
			data,
			(v) => {
				return {
					companies: v.length,
					bankrupted: v.filter((d) => d.percentage === 100).length,
					ppl_laidoff: d3.sum(v, (d) => d.layoff)
				};
			},
			(d) => d[string]
		);
		const countsArray = Array.from(counts, ([name, counts]) => ({
			key: name,
			...counts
		}));
		countsArray.sort((a, b) => d3.descending(a.ppl_laidoff, b.ppl_laidoff));
		return countsArray;
	}

	setContext('industryData', rollupByX('industry'));
	setContext('stageData', rollupByX('stage'));
	setContext('stageColor', colorScale);
	setContext('stages', stages);
	setContext('relationships', relationships);
</script>

<svelte:head>
	<title>The Fuzzy Work</title>
	<meta
		name="description"
		content="Between March 11, 2020, and April 16, 2025, tech companies around the globe conducted a series
			of layoffs, impacting people working in many different industries. This essay explores data shared on Layoffs FYI using interactive charts."
	/>
</svelte:head>

<div class="full-width">
	<DraggableWordCloud />
</div>
<div class="grid-container dark-bg" style="transform: translate(0, -5em)">
	<div class="main-content header">
		<h1>The Fuzzy Work</h1>
		<h2>2020-2025: the nebulous shift of the tech industry</h2>
	</div>
	<div class="main-content">
		<p>
			Between March 11, 2020, and April 16, 2025, tech companies around the globe conducted a series
			of layoffs, impacting people working in many different industries. However, job cuts don’t
			always mean business failure; Layoffs in the past five years are often a symptom of
			macroeconomic shifts. Post-COVID normalization, the end of easy money, and the rise of AI all
			converged to reshape what tech work looks like.
		</p>
		<p>
			This essay explores data shared on <a href="https://layoffs.fyi/" target="_blank"
				>Layoffs FYI</a
			> using interactive charts.
		</p>
		<p>
			In the original dataset, each row represents a layoff announcement in the news. For this
			analysis, I rolled up the announcement data by company. I also simplified the classification
			of the funding stage of a company. See <a href="the-fuzzy-work/behind-the-scenes"
				>Behind The Scenes</a
			> for details.
		</p>
	</div>
	<div class="main-content">
		<h2>The most impacted industries</h2>
		<p>
			The chart below compares the number of companies that announced layoff events and the number
			of jobs eliminated in each industry.
		</p>
	</div>

	<ComparisonBarIndustry />

	<div class="main-content">
		<h2>Startups disappear quietly.<br /> Big Tech cuts loudly.</h2>
	</div>
	<div class="main-content">
		<p>
			The chart below compares the number of companies and the number of jobs eliminated at
			different funding stages.
		</p>
		<h3>The top 3 made up nearly 10% of the entire job loss.</h3>
		<p>
			Publicly traded companies are often large employers, and they could also eliminate the largest
			number of jobs in times of uncertainty.
		</p>
		<p>
			In the past 5 years, {layoffByCompany[0].company} eliminated {d3.format(',')(
				layoffByCompany[0].layoff
			)} jobs, making it the top for job loss, followed by {layoffByCompany[1].company}, which
			eliminated {d3.format(',')(layoffByCompany[1].layoff)} jobs, and {layoffByCompany[2].company},
			{d3.format(',')(layoffByCompany[2].layoff)}.
		</p>
		<h3>1 in 3 companies that announced a 100%-layoff is at an early funding stage.</h3>
		<p>
			Early-stage companies are more susceptible to social-economical shifts and, hence, more likely
			to announce layoffs or even go bankrupt, but they tend to have much less impact on the total
			job loss. Of {bankrupted.length} companies that announced 100% layoffs, presumably bankrupted,
			{bankrupted.filter((d) => d.stage === 'Early Stage').length} are at an early funding stage.
		</p>
	</div>
	<aside>
		<p class="insight">
			Among all the tech giants, Apple only eliminated {layoffByCompany.find(
				(d) => d.company === 'Apple'
			)?.layoff} jobs, and
			<a
				href="https://www.macrumors.com/2024/11/05/apple-employee-count-grew-this-year/"
				target="_blank"
			>
				MacRumors says
			</a> Apple's employee count had grown slightly despite the layoffs.
		</p>
	</aside>

	<ComparisonBarStage />
	<div class="main-content">
		<h2>How industry and funding stage cross-compare</h2>
		<p>
			Although public companies make the headlines, the rise and fall of startups is more indicative
			of innovation trends.
		</p>
		<p>
			Assuming “100% layoff” as bankruptcy, the number of bankrupt companies took up about 4% of the
			entire set. While 4% is negligible, bankruptcy alone could be an indicator to understand the
			industry shift.
		</p>
		<p>
			The chart below provides options to observe the layoff impact based on companies, jobs, or
			bankruptcy.
		</p>
	</div>

	<HeatMapChart data={layoffByCompany} />
	<aside>
		<p class="insight">
			Many companies in an “Early” funding stage and the “Food” industry have announced a 100%
			layoff. Further research shows these companies are startups innovating on supply chain and
			food delivery services, mostly non-US companies.
		</p>
		<p class="insight">
			Across funding stages, companies in the finance industry have announced layoffs, and many are
			Fintech startups. Similar patterns can be observed in Healthcare and Retail.
		</p>
		<p class="insight">
			The publicly traded companies in “Retail,” “Consumer," “Hardware," “Other,” and
			“Transportation” eliminated most jobs.
		</p>
	</aside>
	<DeepDiveCompanies {relationships} {layoffByCompany} />

	<div style="margin-top: 3em;">
		<h2>Closing thoughts</h2>
		<p>
			In the 2010s, being a tech company meant rapid growth, high valuation, modern culture, and
			investor hype. But in the 2020s, that label carries more scrutiny: platform monopolies,
			information silos, fake news… and existential questions about AI, data, and power.
		</p>
		<p>
			The ground beneath the industry is shifting—and with it, so are the stories we tell about
			work, security, and progress. We can’t predict what the next five years will look like, but
			one thing is clear: we’ll need to keep adapting—our skills, our assumptions, and our
			expectations.
		</p>
		<p>
			The charts you just explored show trends and numbers, but behind every datapoint is a
			decision, a departure, a disruption.
		</p>
		<h3>
			<i
				>So what did you feel as you moved through this data? What do you take away from all this?</i
			>
		</h3>
		<p>
			For details on how this project came into being, read <a
				href="the-fuzzy-work/behind-the-scenes">Behind The Scenes</a
			>
			of this project.
		</p>
	</div>
</div>

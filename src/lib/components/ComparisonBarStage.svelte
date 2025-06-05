<script>
	//@ts-nocheck
	import { getContext } from 'svelte';
	import './style.css';
	import ComparisonBar from './ComparisonBar.svelte';
	import ComparisonBarBulletin from './ComparisonBarBulletin.svelte';
	const data = getContext('stageData');
	const measure = 'stage';
	let selected = $state();
</script>

<div class="main-content">
	<ComparisonBar
		{measure}
		{data}
		selectedKey={(key) => {
			selected = key;
		}}
	/>
	<p class="footnote">
		"Unknown" stage companies included many foreign companies such as SoundCloud, ByteDance, and
		Huawei, as well as US companies like Everlane.
	</p>
</div>
<aside>
	<ComparisonBarBulletin {measure} {selected} />
</aside>

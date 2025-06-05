<script>
	// @ts-nocheck
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();

	let theme = $derived($page.data?.theme ?? 'light');
	let bgColor = $derived($page.data?.pageBg ?? 'var(--color-light-bg)');
	let currentRoute = $derived($page.route.id);
</script>

<div class="app {theme}">
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<script>
	//@ts-nocheck
	import Prism from 'prismjs';
	import 'prismjs/components/prism-javascript';
	import 'prismjs/components/prism-css';
	import 'prismjs/components/prism-markup';
	import 'prismjs/themes/prism-tomorrow.css';
	let { codeSnippet, language } = $props();
</script>

<pre class="language-{language}">
	<code>
		{@html Prism.highlight(codeSnippet, Prism.languages[language])}
	</code>
</pre>

<style>
	pre {
		position: relative;
		min-height: 30em;
	}
	code {
		position: absolute;
		top: -2em;
		left: 1em;
	}
</style>

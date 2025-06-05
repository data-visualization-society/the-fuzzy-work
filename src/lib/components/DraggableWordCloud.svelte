<script>
	// @ts-nocheck
	import * as d3 from 'd3';
	import { getContext } from 'svelte';

	const industries = getContext('industryData');
	const relationships = getContext('relationships');
	let selectedIndustries = $state([]);

	let nodeData = industries.map(({ key, ...rest }) => ({
		id: key,
		...rest,
		isSelected: false
	}));
	let linkData = relationships.map((l, i) => ({
		source: l.Source,
		target: l.Target,
		value: l.Strength,
		isSelected: false
	}));

	const dimensions = {
		width: 900,
		height: 450,
		marginTop: 30,
		marginLeft: 0,
		marginRight: 60,
		marginBottom: 10
	};
	const boundRect = {
		width: dimensions.width - dimensions.marginLeft - dimensions.marginRight,
		height: dimensions.height - dimensions.marginTop - dimensions.marginBottom
	};

	const fontSizeAccessor = (d) => d.companies;

	let fontSizeScale = d3
		.scaleLinear()
		.domain(d3.extent(nodeData, fontSizeAccessor))
		.range([14, 32]);

	function findSelection(n) {
		const linkedIndustries = {
			[n.id]: true
		};

		links.forEach((link) => {
			if (link.value == 2 && (link.source.id === n.id || link.target.id === n.id)) {
				link.isSelected = true;
				linkedIndustries[link.target.id] = true;
				linkedIndustries[link.source.id] = true;
			} else {
				link.isSelected = false;
			}
		});

		nodes.forEach((node) => {
			if (linkedIndustries[node.id]) {
				node.isSelected = true;
			} else {
				node.isSelected = false;
			}
		});

		selectedIndustries = Object.keys(linkedIndustries);
	}

	function keyDownNode(e, n) {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			findSelection(node);
		}
	}

	let nodes = $state(nodeData),
		links = $state(linkData);

	const simulation = d3.forceSimulation(nodes).force(
		'link',
		d3
			.forceLink(links)
			.id((d) => d.id)
			.distance((d) => (d.value === 2 ? boundRect.height / 2 : boundRect.height))
	);

	/**
	 * Action: make an element draggable inside a D3 force‑simulation.
	 *
	 * Usage:
	 * <text use:handleDrag={{ datum: node }}>…</text>
	 */
	function handleDrag(el, datum) {
		// Attach this node’s datum so D3 can read/write to it
		d3.select(el).datum(datum);

		$effect(() => {
			// ─── Setup (runs on mount) ──────
			const behavior = d3
				.drag()
				.on('start', (event) => {
					if (!event.active) simulation.alphaTarget(0.3).restart();
					datum.fx = datum.x;
					datum.fy = datum.y;
				})
				.on('drag', (event) => {
					datum.fx = event.x;
					datum.fy = event.y;
				})
				.on('end', (event) => {
					if (!event.active) simulation.alphaTarget(0);
					datum.fx = datum.fy = null;
				});

			// Apply the drag behaviour
			d3.select(el).call(behavior);

			// ─── Teardown (runs on unmount) ──────
			return () => {
				// Remove every listener in the `.drag` namespace
				d3.select(el).on('.drag', null);
			};
		});
	}

	$effect(() => {
		simulation
			.force('center', d3.forceCenter(boundRect.width * 0.6, boundRect.height / 2))
			.force('y', d3.forceY(boundRect.height / 2).strength(0.2))
			.force('collide', d3.forceCollide((d) => fontSizeScale(fontSizeAccessor(d))).strength(0.9));

		return () => {
			simulation.stop();
		};
	});
</script>

<svg width="100%" viewBox="0, 0, {dimensions.width}, {dimensions.height}">
	<text
		text-anchor="middle"
		alignment-baseline="middle"
		x={dimensions.width / 2}
		y={dimensions.height / 2}
		fill="var(--dark)"
		font-size={dimensions.height * 0.8}
		font-weight="900"
	>
		TECH
	</text>
	<g class="links" transform="translate({dimensions.marginLeft}, {dimensions.marginTop})">
		{#each links as link}
			{#if link.value > 0}
				<line
					x1={link.source.x}
					y1={link.source.y}
					x2={link.target.x}
					y2={link.target.y}
					stroke-width="1"
					stroke={link.isSelected ? 'var(--lighter)' : 'var(--light)'}
					opacity={link.value === 2 ? 1 : 0.75}
				/>
			{/if}
		{/each}
	</g>
	<g class="nodes" transform="translate({dimensions.marginLeft}, {dimensions.marginTop})">
		{#each nodes as node}
			<text
				text-anchor="middle"
				alignment-baseline="middle"
				x={node.x}
				y={node.y}
				font-size={fontSizeScale(fontSizeAccessor(node))}
				fill={node.isSelected ? 'var(--lightest)' : 'var(--lighter)'}
				role="button"
				aria-label={'industry: ' + node.id}
				tabindex="0"
				onclick={() => findSelection(node)}
				onkeydown={(event) => keyDownNode(node, event)}
				use:handleDrag={node}
			>
				{node.id}
			</text>
		{/each}
	</g>
</svg>

<style>
	svg {
		--dark: #221d4f;
		--lightest: var(--color-light-bg);
		--lighter: var(--color-lighter-blue);
		--light: var(--color-light-blue);
		background: var(--color-dark-bg);
	}

	text {
		user-select: none;
	}

	.nodes {
		text-transform: lowercase;
		font-family: var(--font-mono);
		mix-blend-mode: lighten;
	}

	.nodes text:hover {
		cursor: pointer;
		fill: var(--lightest);
	}
	.nodes text:focus {
		outline: none;
	}
	.links {
		mix-blend-mode: lighten;
	}
</style>

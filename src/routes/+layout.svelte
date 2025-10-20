<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/@davepagurek/p5.filterrenderer@0.0.17/p5.filterRenderer.min.js"></script>
</svelte:head>

{@render children?.()}

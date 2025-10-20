<script>
	import { onMount } from 'svelte';
	import { Web } from '$lib/Web.js';

	let p5Instance;
	let web;
	let canvasWidth = 0;
	let canvasHeight = 0;

	function setup(p) {
		p.createCanvas(p.windowWidth, p.windowHeight);
		web = new Web(p, p.windowWidth / 2, p.windowHeight / 2);
	}

	function draw(p) {
		p.background(255, 255, 245);
		web.update();
		web.draw();
	}

	function windowResized(p) {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}

	function sketch(p) {
		p.setup = () => setup(p);
		p.draw = () => draw(p);
		p.windowResized = () => windowResized(p);
	}

	onMount(() => {
		const P5 = window.p5;
		if (P5) {
			p5Instance = new P5(sketch);
		}

		return () => {
			if (p5Instance) p5Instance.remove();
		};
	});
</script>
<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';

	let font = 'monospace';
	let fontSize = 16;
	let textColor;
	let windowHeight;
	let windowWidth;
	let interval = 66;
	let c: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let columns;
	let drops = [];

	const chars = ['M', 'E', 'R', 'R', 'Y', 'C', 'H', 'R', 'I', 'S', 'T', 'M', 'A', 'S'];

	beforeUpdate(() => {
		if (c) {
			c.height = windowHeight;
			c.width = windowWidth;

			columns = c.width / fontSize;
      initialiseDrops()
      
		}
	});

  const initialiseDrops = () => {
    for (let x = 0; x < columns; x++) {
			drops[x] = 1;
		}
  }
	onMount(() => {
		c = <HTMLCanvasElement>document.getElementById('c');
		ctx = c.getContext('2d');

		// initialise dimensions
		c.height = windowHeight;
		c.width = windowWidth;

		columns = c.width / fontSize; //number of columns for the rain

		//an array of drops - one per column
		//1 = y co-ordinate of the drop(same for every drop initially)
		initialiseDrops()

    if(c) {
    setInterval(draw, interval);
  }
	});

	//drawing the characters
	function draw() {

		ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
		ctx.fillRect(0, 0, c.width, c.height);
		ctx.fillStyle = 'red';

		ctx.font = fontSize + `px ${font}`;
		//looping over drops
		for (let i = 0; i < drops.length; i++) {
			//a random char
			const text = chars[Math.floor(Math.random() * chars.length)];
			ctx.fillText(text, i * fontSize, drops[i] * fontSize);

			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;

			//incrementing Y coordinate
			drops[i]++;
		}
	}


</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<body>
	<canvas id="c" />
</body>

<style>
	/*basic reset*/
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	body {
		background: black;
	}
	canvas {
		display: block;
	}
</style>

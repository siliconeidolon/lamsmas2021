<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	import SettingsIcon from '../settings.svg'

	let font = 'monospace';
	let fontSize = 16;
	let windowHeight;
	let windowWidth;
	let interval = 66;
	let c: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let columns;
	let drops = [];

	// controls
	let colorSchemeIdx = 0;

	interface ColorScheme {
		bgColor: string;
		colors: string[];
	}

	const xmasColors: ColorScheme = {
		bgColor: 'rgba(0, 0, 0, 0.05)',
		colors: ['red', 'green']
	};
	const matrix: ColorScheme = {
		bgColor: 'rgba(0, 0, 0, 0.05)',
		colors: ['#03A062']
	};
	const colorSchemes: ColorScheme[] = [xmasColors, matrix];
	const chars = ['M', 'E', 'R', 'R', 'Y', 'C', 'H', 'R', 'I', 'S', 'T', 'M', 'A', 'S'];
	const matrixChars = [
		'ﾊ',
		'ﾐ',
		'ﾋ',
		'ｰ',
		'ｳ',
		'ｼ',
		'ﾅ',
		'ﾓ',
		'ﾆ',
		'ｻ',
		'ﾜ',
		'ﾂ',
		'ｵ',
		'ﾘ',
		'ｱ',
		'ﾎ',
		'ﾃ',
		'ﾏ',
		'ｹ',
		'ﾒ',
		'ｴ',
		'ｶ',
		'ｷ',
		'ﾑ',
		'ﾕ',
		'ﾗ',
		'ｾ',
		'ﾈ',
		'ｽ',
		'ﾀ',
		'ﾇ',
		'ﾍ',
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'7',
		'8',
		'9',
		'Z',
		'|',
		'/'
	];

	beforeUpdate(() => {
		if (c) {
			c.height = windowHeight;
			c.width = windowWidth;

			columns = c.width / fontSize;
			initialiseDrops();
		}
	});

	//an array of drops - one per column
	//1 = y co-ordinate of the drop(same for every drop initially)
	const initialiseDrops = () => {
		for (let x = 0; x < columns; x++) {
			drops[x] = 1;
		}
	};
	onMount(() => {
		c = <HTMLCanvasElement>document.getElementById('c');
		ctx = c.getContext('2d');

		// initialise dimensions
		c.height = windowHeight;
		c.width = windowWidth;

		columns = c.width / fontSize; //number of columns for the rain

		initialiseDrops();

		if (c) {
			setInterval(draw, interval);
		}
	});

	//drawing the characters
	function draw() {
		ctx.fillStyle = colorSchemes[colorSchemeIdx].bgColor;
		ctx.fillRect(0, 0, c.width, c.height);
		if (colorSchemes[colorSchemeIdx].colors.length > 1) {
			ctx.fillStyle =
				colorSchemes[colorSchemeIdx].colors[Math.floor(Math.random() * colorSchemes.length)];
		} else {
			ctx.fillStyle = colorSchemes[colorSchemeIdx].colors[0];
		}
		ctx.font = fontSize + `px ${font}`;

		let charIdx = 0;
		for (let i = 0; i < drops.length; i++) {
			let text = '';
			if (colorSchemeIdx === 0) {
				if (charIdx > chars.length - 1) {
					charIdx = 0;
				}
				if (Math.random() < 0.85) {
					text = chars[charIdx];
				}
				charIdx++;
			} else {
				text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
			}

			ctx.fillText(text, i * fontSize, drops[i] * fontSize);

			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;

			//incrementing Y coordinate
			drops[i]++;
		}
	}
</script>

<svelte:window 
	bind:innerHeight={windowHeight}
	bind:innerWidth={windowWidth}
/>

<body style={`background: ${colorSchemes[colorSchemeIdx].bgColor}`}>
	<div class="icon">
		<SettingsIcon />
	</div>
	<canvas id="c" />
</body>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body {
		position: relative;
	}

	.icon {
		position: absolute;
		top: 1rem;
		right: 1rem;
		height: 2rem;
		width: 2rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: aliceblue;	
	}
	canvas {
		display: block;
	}
</style>

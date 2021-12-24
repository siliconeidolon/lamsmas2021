<svelte:head>
	<title>lamsmas2021</title>
</svelte:head>
<script lang="ts">
	import { beforeUpdate, onMount } from 'svelte';
	import SettingsIcon from '../settings.svg'
	import { fade } from 'svelte/transition';

	let font = 'monospace';
	let fontSize = 16;
	let windowHeight;
	let windowWidth;
	let interval = 66;
	let c: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let columns;
	let drops = [];
	let showMenu = false
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
			const newCols = windowWidth / fontSize;
			if(columns !== newCols) {
				c.height = windowHeight;
				c.width = windowWidth;
	
				columns = newCols;
				initialiseDrops();
			}
		}
	});
 /**
	* Bring the drops back up to the top
	*/
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

	function toggleMenu() {
		showMenu = !showMenu
	}

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
	<button class="icon" on:click={toggleMenu}>
		<SettingsIcon />
	</button>
	{#if showMenu}
	<div class="menu" in:fade out:fade>
		<div class="buttons">
			<button class={colorSchemeIdx === 1 && 'active'} on:click={() => colorSchemeIdx = 1}>Matrix</button>
			<button class={colorSchemeIdx === 0 && 'active'} on:click={() => colorSchemeIdx = 0}>Xmas</button>
		</div>

	</div>
{/if}

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

	button {
		outline: none;
		border: none;
		cursor: pointer;
		background: none;
		align-items: center;
		display: flex;
	}
	
	.menu button {
		padding: 1rem;
		height: 2rem;
	}
	
	.menu button.active {
		box-shadow: 0 0 0 1px grey;
		border-radius: .5rem;
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
		z-index: 1;
	}

	.menu {
		position: absolute;
		top: 1rem;
		right: 1rem;
		padding-top: 2.5rem;
		background: aliceblue;
		border-top-right-radius: 1rem;
		height: 5rem;
		width: 10rem;
		display: flex;
		justify-content: space-around;
	}

	.buttons {
		display: flex;
	}
	canvas {
		display: block;
	}
</style>

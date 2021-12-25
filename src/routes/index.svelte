<svelte:head>
	<title>lamsmas2021</title>
</svelte:head>
<script lang="ts">
	import { chars, matrixChars } from '../data/chars';
	import { beforeUpdate, onMount } from 'svelte';
	import SettingsIcon from '../settings.svg'
	import { fly } from 'svelte/transition';

	let font = 'monospace';
	let fontSize = 16;
	let windowHeight: number;
	let windowWidth: number;
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
		colors: ['red', '#03A062']
	};
	const matrix: ColorScheme = {
		bgColor: 'rgba(0, 0, 0, 0.05)',
		colors: ['#03A062']
	};
	const colorSchemes: ColorScheme[] = [xmasColors, matrix];


	beforeUpdate(() => {
		if (c) {
			const newCols = windowWidth / fontSize;
			if (columns !== newCols) {
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

		columns = c.width / fontSize;

		initialiseDrops();
		
		if (c) {
			setInterval(draw, interval);
		}
	});

	function toggleMenu() {
		showMenu = !showMenu
	}

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
			if (Math.random() < 0.85) {
				if (colorSchemeIdx === 0) {
					if (charIdx > chars.length - 1) {
						charIdx = 0;
					}
						text = chars[charIdx];
					} else {
						text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
					}
				}
				charIdx++;

			ctx.fillText(text, i * fontSize, drops[i] * fontSize);

			if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
				drops[i] = 0;
			}

			drops[i]++;
		}
	}
</script>

<svelte:window 
	bind:innerHeight={windowHeight}
	bind:innerWidth={windowWidth}
/>

<body>
	<button class="icon" on:click={toggleMenu} title="Show colour options">
		<SettingsIcon />
	</button>
	{#if showMenu}
		<div class="menu" transition:fly="{{x: 200, duration: 500}}">
			<div class="buttons">
				<button class={colorSchemeIdx === 1 && 'active'} on:click={() => colorSchemeIdx = 1}>Matrix</button>
				<button class={colorSchemeIdx === 0 && 'active'} on:click={() => colorSchemeIdx = 0}>Xmas</button>
			</div>
		</div>
	{/if}

	<canvas id="c" style={`background-color: black`} />
</body>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body {
		position: relative;
		background-color: black;
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
		transition: all 300ms ease;
		box-shadow: none;
	}
	
	.menu button.active {
		box-shadow: inset 0 -4px 0 0 #03A062;
	}

	.icon {
		position: absolute;
		top: 1rem;
		right: .1rem;
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
		right: 0rem;
		padding-right: 2.5rem;
		background: aliceblue;

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

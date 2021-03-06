import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import svg from '@poppanator/sveltekit-svg'
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
      // Options are optional
      plugins: [svg()]
    },

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;

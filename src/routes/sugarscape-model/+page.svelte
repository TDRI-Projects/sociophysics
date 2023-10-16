<script lang="ts">
    // @ts-ignore
    import RangeSlider from 'svelte-range-slider-pips'
    import { Sugarscape } from '$lib/models/sugarscape'

    let delay_slider: number[] = [200]

    let sugarscape_model: Sugarscape
    let sugar_array: number[][] = []
    let agent_array: number[][] = []
    function update_grid() {
        sugar_array = sugarscape_model.cells.map(row => row.map(cell => cell.sugar))
        agent_array = sugarscape_model.get_agent_locations()
    }

    function reset() {
        sugarscape_model = new Sugarscape()
        update_grid()
    }
    reset()

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    let is_running: boolean
    async function start() {
        is_running = true
        while (is_running) {
            sugarscape_model.iterate()
            update_grid()
            await sleep(delay_slider[0])
            break
        }
    }

    function stop() {
        is_running = false
    }
</script>

<svelte:head>
	<title>Sugarscape Model</title>
</svelte:head>

<h1>Sugarscape Model</h1>
<div class="grid lg:grid-cols-2 gap-2 my-2">
    <div 
        class="w-full max-w-lg mx-auto aspect-square grid"
        style="grid-template-columns: repeat(50, minmax(0, 1fr));"
    >
        {#each Array(50) as _, j}
            {#each Array(50) as _, i}
                <div class={'flex justify-center items-center ' + ['bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-700', 'bg-green-900'][sugar_array[49-j][i]]}>
                    {#if agent_array.some(([x, y]) => x === i && y === 49-j)}
                        <div class="w-3/4 h-3/4 rounded-full bg-red-500" />
                    {/if}
                </div>
            {/each}
        {/each}
    </div>

    <div class="flex flex-col lg:m-5">
        <div id="button-row" class="flex flex-row justify-center gap-3">
            <button on:click={start}>Start</button>
            <button on:click={stop}>Stop</button>
            <button on:click={reset}>Reset</button>
        </div>
        <div>
            <p class="font-bold text-xl text-center">Delay: {delay_slider[0]} ms</p>
            <RangeSlider
                min={20}
                max={200}
                step={10}
                first=label
                last=label
                suffix=" ms"
                pips
                bind:values={delay_slider}
            />
        </div>
    </div>
</div>

<style lang="postcss">
    #button-row button {
        @apply bg-tdri-main text-white font-bold py-2 px-4 rounded-lg;
    }
</style>
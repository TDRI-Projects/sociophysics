<script lang="ts">
    // @ts-ignore
    import RangeSlider from 'svelte-range-slider-pips'
    import { Sugarscape } from '$lib/models/sugarscape'
    import { browser } from '$app/environment'
    import { Chart, registerables } from 'chart.js'
    import { onMount } from 'svelte'
    import { cdf } from '$lib/utils/cdf'

    Chart.register(...registerables)
    let sugarChartElement: HTMLCanvasElement
    let chart: any
    onMount(() => {
        if (browser) {
            chart = new Chart(sugarChartElement, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Sugar Distribution',
                        data: []
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'logarithmic',
                            title: {
                                display: true,
                                text: 'Sugar'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Probability'
                            }
                        }
                    },
                    aspectRatio: 1
                }
            })
        }
    })
    
    let delay_slider: number[] = [300]

    let sugarscape_model: Sugarscape
    let sugar_array: number[][] = []
    let agent_array: number[][] = []
    function update_grid() {
        sugar_array = sugarscape_model.cells.map(row => row.map(cell => cell.sugar))
        agent_array = sugarscape_model.get_agent_locations()
    }

    function update_chart() {
        chart.data.datasets[0].data = cdf(sugarscape_model.get_agent_sugar())
        chart.update()
    }

    let is_running: boolean
    function reset() {
        is_running = false
        sugarscape_model = new Sugarscape()
        update_grid()
    }
    reset()

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function start() {
        is_running = true
        while (is_running) {
            sugarscape_model.iterate()
            update_grid()
            update_chart()
            await sleep(delay_slider[0])
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
                min={100}
                max={300}
                step={50}
                first=label
                last=label
                suffix=" ms"
                pips
                bind:values={delay_slider}
            />
        </div>
        <canvas bind:this={sugarChartElement} />
    </div>
</div>

<style lang="postcss">
    #button-row button {
        @apply bg-tdri-main text-white font-bold py-2 px-4 rounded-lg;
    }
</style>
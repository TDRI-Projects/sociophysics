<script lang="ts">
    // @ts-ignore
    import RangeSlider from 'svelte-range-slider-pips'

    let L_slider: number[] = [10]
    let T_slider: number[] = [0.3]
    let rho_slider: number[] = [0.1]
    let delay_slider: number[] = [50]

    type Cell = 'red' | 'blue' | 'empty'

    function generate_cell(): Cell {
        const x = Math.random()
        if (x <= rho_slider[0]) {
            return 'empty'
        } else if (x > (1 + rho_slider[0]) / 2) {
            return 'red'
        } else {
            return 'blue'
        }
    }

    let is_running: boolean
    function stop() {
        is_running = false
    }

    let grid: Cell[][]
    function reset() {
        stop()
        grid = Array(L_slider[0]).fill(0).map(() => Array(L_slider[0]).fill(0).map(() => generate_cell()))
    }
    reset()

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function is_happy(i: number, j: number): boolean {
        const cell = grid[i][j]
        const neighbors = [
            grid[i - 1]?.[j - 1],
            grid[i - 1]?.[j],
            grid[i - 1]?.[j + 1],
            grid[i]?.[j - 1],
            grid[i]?.[j + 1],
            grid[i + 1]?.[j - 1],
            grid[i + 1]?.[j],
            grid[i + 1]?.[j + 1],
        ].filter(x => x !== 'empty')
        const num_same = neighbors.filter(neighbor => neighbor === cell).length
        return num_same / neighbors.length >= T_slider[0]
    }

    function get_empty_cells(): [number, number][] {
        return grid.map((row, i) => row.map((_, j) => grid[i][j] === 'empty' ? [i, j] : false)).flat().filter(x => x !== false) as [number, number][]
    }

    function shuffleArray(array: any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]
        }
    }

    async function start() {
        is_running = true
        while (is_running) {
            const unhappy_cells = grid.map((row, i) => row.map((_, j) => is_happy(i, j) ? false : [i, j])).flat().filter(x => x !== false)
            if (unhappy_cells.length == 0) {
                break
            }

            shuffleArray(unhappy_cells)
            for (const unhappy_cell of unhappy_cells) {
                const [origin_i, origin_j] = unhappy_cell as [number, number]
                const empty_cells = get_empty_cells()
                const [target_i, target_j] = empty_cells[Math.floor(Math.random() * empty_cells.length)] as [number, number]
                grid[target_i][target_j] = grid[origin_i][origin_j]
                grid[origin_i][origin_j] = 'empty'
            }
            await sleep(delay_slider[0])
        }
    }
</script>

<h1>Schelling Model</h1>
<div class="grid lg:grid-cols-2 gap-2 my-2">
    <div 
        class="w-full mx-auto aspect-square grid gap-1"
        style="grid-template-columns: repeat({L_slider[0]}, minmax(0, 1fr));"
    >
        {#each Array(L_slider[0]) as _, j}
            {#each Array(L_slider[0]) as _, i}
                <div class={'cell-' + grid[L_slider[0] - j - 1][i]}>
                    <!-- ({i}, {L_slider[0] - j - 1}) -->
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
            <p class="font-bold text-xl text-center">L: {L_slider[0]}</p>
            <RangeSlider
                min={10}
                max={50}
                first=label
                last=label
                pips
                bind:values={L_slider}
                on:change={reset}
            />
        </div>
        <div>
            <p class="font-bold text-xl text-center">T: {T_slider[0]}</p>
            <RangeSlider
                min={0}
                max={1}
                step={0.05}
                first=label
                last=label
                pips
                bind:values={T_slider}
                on:change={reset}
            />
        </div>
        <div>
            <p class="font-bold text-xl text-center">ρ: {rho_slider[0]}</p>
            <RangeSlider
                min={0}
                max={1}
                step={0.05}
                first=label
                last=label
                pips
                bind:values={rho_slider}
                on:change={reset}
            />
        </div>
        <div>
            <p class="font-bold text-xl text-center">Delay: {delay_slider[0]} ms</p>
            <RangeSlider
                min={1}
                max={50}
                step={1}
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

    .cell-red {
        @apply bg-red-500;
    }

    .cell-blue {
        @apply bg-blue-500;
    }

    .cell-empty {
        @apply bg-white;
    }
</style>
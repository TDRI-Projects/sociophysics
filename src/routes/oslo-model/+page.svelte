<script lang="ts">
    // @ts-ignore
    import RangeSlider from 'svelte-range-slider-pips'
    let L_slider: number[] = [10]
    let p_slider: number[] = [0.5]

    let z: number[]
    let z_th: number[]
    function calculate_h(z: number[]) {
        let h = Array(L_slider[0]).fill(0)
        h[h.length - 1] = z[h.length - 1]
        for (let i = h.length - 2; i >= 0; i--) {
            h[i] = h[i + 1] + z[i]
        }

        return h
    }
    $: h = calculate_h(z)

    function generate_z_th(): number {
        return Math.random() < p_slider[0] ? 1 : 2
    }

    function reset() {
        z = Array(L_slider[0]).fill(0)
        z_th = [...Array(L_slider[0])].map(_ => generate_z_th())
    }
    reset()

    let relax_sites: number[]
    function is_relaxed(): boolean {
        relax_sites = z_th.map((z_th_i, i) => z[i] > z_th_i ? i : -1).filter(i => i != -1)
        return relax_sites.length == 0
    }

    function relax(): number {
        let s_t = 0 // avalanche size: number of relaxations at time t

        while (!is_relaxed()) {
            s_t += relax_sites.length

            for (let i of relax_sites) {
                if (i == 0) {
                    z[0] -= 2
                    z[1] += 1
                } else if (i == z.length - 1) {
                    z[i] -= 1
                    z[i - 1] += 1
                } else {
                    z[i] -= 2
                    z[i - 1] += 1
                    z[i + 1] += 1
                }
                z_th[i] = generate_z_th()
            }
        }

        return s_t
    }

    function start() {
        z[0] += 1
        relax()
    }
</script>

<h1>Oslo Model</h1>
<div class="grid lg:grid-cols-2 gap-2 my-2">
    <div 
        class="w-full max-w-sm mx-auto aspect-[1/2] grid gap-1"
        style="grid-template-columns: repeat({L_slider[0]}, minmax(0, 1fr));"
    >
        {#each Array(2 * L_slider[0]) as _, j}
            {#each Array(L_slider[0]) as _, i}
                <div
                    class={'h-full w-full ' + (h[i] > (2 * L_slider[0] - j - 1) ? 'bg-tdri-main' : 'bg-white')}
                >
                    <!-- ({i}, {2 * L_slider[0] - j - 1}) -->
                </div>
            {/each}
        {/each}
    </div>

    <div class="flex flex-col lg:m-5">
        <div id="button-row" class="flex flex-row justify-center gap-3">
            <button on:click={start}>Start</button>
            <button>Stop</button>
            <button on:click={reset} >Reset</button>
        </div>
        <div>
            <p class="font-bold text-xl text-center">L: {L_slider[0]}</p>
            <RangeSlider
                min={10}
                max={20}
                first=label
                last=label
                pips
                bind:values={L_slider}
                on:change={reset}
            />
        </div>
        <div>
            <p class="font-bold text-xl text-center">p: {p_slider[0]}</p>
            <RangeSlider
                min={0}
                max={1}
                step={0.1}
                first=label
                last=label
                pips
                bind:values={p_slider}
                on:change={reset}
            />
        </div>
    </div>
</div>

<style lang="postcss">
    #button-row button {
        @apply bg-tdri-main text-white font-bold py-2 px-4 rounded-lg;
    }
</style>
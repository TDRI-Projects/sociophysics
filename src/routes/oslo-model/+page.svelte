<script lang="ts">
    // @ts-ignore
    import RangeSlider from 'svelte-range-slider-pips'
    let L_slider: number[] = [10]
</script>

<h1>Oslo Model</h1>
<div class="grid lg:grid-cols-2 gap-5 my-2">
    <div 
        class="w-full aspect-square grid gap-3"
        style="grid-template-columns: repeat({L_slider[0]}, minmax(0, 1fr));"
    >
        {#each Array(L_slider[0]) as _}
            {#each Array(L_slider[0]) as _}
                <div class="h-full w-full bg-white"/>
            {/each}
        {/each}
    </div>

    <div class="flex flex-col lg:m-5">
        <div>
            <p class="font-bold text-xl text-center">L: {L_slider[0]}</p>
            <RangeSlider min={10} max={20} first=label last=label pips bind:values={L_slider} />
        </div>
    </div>
</div>
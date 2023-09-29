<script lang="ts">
    let L = 10
</script>

<h1>Oslo Model</h1>

<div 
    class="w-full aspect-square grid gap-3"
    style="grid-template-columns: repeat({L}, minmax(0, 1fr));"
>
    {#each Array(L) as _}
        {#each Array(L) as _}
            <div class="h-full w-full bg-white"/>
        {/each}
	{/each}
</div>

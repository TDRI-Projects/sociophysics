<script lang="ts">
    import Showcase from '$lib/components/Showcase.svelte'
</script>

<svelte:head>
	<title>Sociophysics • TDRI</title>
</svelte:head>

<h1>Sociophysics</h1>

<div class="flex flex-col items-center gap-3 m-5">
    <Showcase
        name="Oslo Model"
        path="/oslo-model"
    />
    <Showcase
        name="Schelling Model"
        path="/schelling-model"
    />
    <Showcase
        name="Sugarscape Model"
        path="/sugarscape-model"
    />
</div>
<script lang="ts">
    export let name: string
    export let path: string
</script>

<a href={path} class="bg-tdri-main w-40 p-3 rounded-lg">
    <p class="text-xl text-white font-bold">{name}</p>
</a>
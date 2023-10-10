<script lang="ts">
    export let name: string
    export let path: string
</script>

<a href={path} class="bg-tdri-main w-60 p-3 rounded-lg">
    <p class="text-xl text-center text-white font-bold">{name}</p>
</a>
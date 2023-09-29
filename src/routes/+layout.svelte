<script lang="ts">
    import '../app.css'
</script>

<div class="w-full min-h-screen p-5 bg-tdri-light">
    <a href="/">
        <img 
            src="$lib/assets/logo/logo_long.png"
            alt="TDRI Logo"
            class="w-40"
        />
    </a>
    
    <div class="max-w-screen-md mx-auto">
        <slot />
    </div>
</div>

<style lang="postcss">
    :global(h1) {
        @apply text-4xl text-center font-bold font-lovelo-black;
    }
</style>
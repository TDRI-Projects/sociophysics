<script lang="ts">
    import '../app.css'
</script>

<div class="w-full min-h-screen p-5 bg-tdri-light flex flex-col">
    <a href="/">
        <img 
            src="$lib/assets/logo/logo_long.png"
            alt="TDRI Logo"
            class="w-40"
        />
    </a>
    
    <div class="max-w-screen-lg mx-auto flex-auto">
        <slot />
    </div>
    <div class="flex justify-center">
        <a href="https://www.netlify.com">
            <img src="https://www.netlify.com/v3/img/components/netlify-color-accent.svg" alt="Deploys by Netlify" />
        </a>
    </div>
</div>

<style lang="postcss">
    :global(h1) {
        @apply text-4xl text-center font-bold font-lovelo-black m-2;
    }
    :root {
        --range-handle-focus: theme(colors.tdri.main);
        --range-handle-border: theme(colors.tdri.main);
    }
</style>
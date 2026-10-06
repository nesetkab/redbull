<script lang="ts">
  import Shelf from "$lib/shelf.svelte";
  import Stats from "$lib/stats.svelte";

  let { data } = $props();
</script>

<div class="bg-bg min-h-screen sm:overflow-hidden flex font-body flex-col p-8">
  <div class="flex flex-col gap-1 min-w-full rise">
    <h1 class="text-4xl text-text font-bold font-header">
      neset's caffeine wall <img
        src="muganim.gif"
        alt="mug"
        class="ml-2 -mt-6 hidden sm:inline max-h-14"
      />
    </h1>
    <a href="/" class="text-xl text-text opacity-60 hover:opacity-100 transition-opacity">
      track ur own →
    </a>
  </div>
  <div class="min-w-full flex flex-col md:flex-row sm gap">
    <Shelf redbulls={data.events} readonly />
    <div class="flex-grow"></div>
    <Stats drinks={data.events} />
  </div>
</div>

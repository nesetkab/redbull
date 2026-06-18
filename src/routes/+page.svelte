<script>
  let open = $state(false);
  import { slide, fly } from "svelte/transition";
  import Redbull from "$lib/redbull.svelte";
  import Picker from "$lib/picker.svelte";
  import Shelf from "$lib/shelf.svelte";
  let { data } = $props();
</script>

<div class="bg-bg min-h-screen flex flex-col p-8">
  <div class="flex flex-col gap-3 md:flex-row min-w-full">
    <div class="flex-grow">
      <h1 class="text-4xl text-text font-bold">Red Bull Tracker</h1>
      <h2 class="text-xl text-text">to track how unhealthy i am :3</h2>
    </div>
    <h2 class="text-xl text-text">Today's Red Bulls: {0}</h2>
  </div>
  <Picker />
  <Shelf redbulls={data.events} />
</div>

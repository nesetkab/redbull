<script lang="ts">
  import Picker from "$lib/picker.svelte";
  import Shelf from "$lib/shelf.svelte";
  import Stats from "$lib/stats.svelte";
  import { getCaffeine } from "$lib/drinks";

  let { data } = $props();
  let todayCount = $derived(
    data.events.filter((e) => isSameDate(e.createdAt, new Date())).length,
  );

  function isSameDate(a: Date, b: Date) {
    return (
      a.getMonth() == b.getMonth() &&
      a.getDate() == b.getDate() &&
      a.getFullYear() == b.getFullYear()
    );
  }
</script>

<div class="bg-bg min-h-screen flex flex-col p-8">
  <div class="flex flex-col gap-3 sm:flex-row min-w-full rise">
    <div class="flex-grow">
      <h1 class="text-4xl text-text font-bold">Red Bull Tracker</h1>
      <h2 class="text-xl text-text">to track how unhealthy i am :3</h2>
    </div>
    <h2 class="text-xl text-text">
      Today's Red Bulls: {todayCount}
    </h2>
  </div>
  <Picker />
  <div class="min-w-full flex flex-col md:flex-row sm gap">
    <Shelf redbulls={data.events} />
    <div class="flex-grow"></div>
    <Stats drinks={data.events} />
  </div>
</div>

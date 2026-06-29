<script lang="ts">
  import Picker from "$lib/picker.svelte";
  import Shelf from "$lib/shelf.svelte";
  import Stats from "$lib/stats.svelte";

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

  function drinkMessage() {
    if (todayCount === 0) return "still asleep.. no caffeine";
    if (todayCount < 3) return "mmmm yummy caffeine";
    if (todayCount < 4 || todayCount === 5)
      return "alright, i think thats enough >:(";
    if (todayCount === 4) return "an entire 4-pack ??";
    if (todayCount === 6) return "an entire 6-pack ??????";
    return "that is DEFINETELY enough for today >:(";
  }
</script>

<div class="bg-bg min-h-screen sm:overflow-hidden flex font-body flex-col p-8">
  <div class="flex flex-col gap-3 sm:flex-row min-w-full rise">
    <div class="flex-grow">
      <h1 class="text-4xl text-text font-bold font-header">
        Caffeine Tracker <img
          src="muganim.gif"
          alt="mug"
          class="ml-2 -mt-6 hidden sm:inline max-h-14"
        />
      </h1>
      <h2 class="text-xl text-text">to track my caffeine addiction</h2>
    </div>
    <div class="flex flex-col">
      <h2 class="text-xl text-text min-w-fit">
        today: {todayCount} drinks!
      </h2>
      <span class="text-text text-md opacity-60 hidden sm:inline">
        {drinkMessage()}
      </span>
    </div>
  </div>
  <Picker />
  <div class="min-w-full flex flex-col md:flex-row sm gap">
    <Shelf redbulls={data.events} />
    <div class="flex-grow"></div>
    <Stats drinks={data.events} />
  </div>
</div>

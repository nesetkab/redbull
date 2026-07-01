<script lang="ts">
  import drinksJSONr from "$lib/drinks.json";
  import Drink from "./drink.svelte";
  import { enhance } from "$app/forms";
  import { fly, slide } from "svelte/transition";
  import { rbState } from "./deleting.svelte";
  import PickerCat from "./pickerCat.svelte";

  type Drink = {
    label: string;
    caffeine: number;
    sfOnly?: boolean;
  };

  const drinksJSON = drinksJSONr as unknown as Record<string, Drink[]>;

  const drinks = Object.entries(drinksJSON);
  const catOpen = $state<Record<string, boolean>>({});
  let open = $state(false);

  const allDrinks = Object.values(drinksJSON).flat();
  const labels = allDrinks.map((d) => d.label);

  let sfState = $state<Record<string, boolean>>({});

  let enabled = $state(false);

  const drinkCats = $state(
    new Map(drinks.map((drink) => [drink[0], [enabled, drink[1]]])),
  );

  function toggleCat(key: string) {
    catOpen[key] = !catOpen[key];
  }
  function isCatOpen(key: string) {
    return catOpen[key] ?? false;
  }

  function getCatEnabled(key: string) {
    return drinkCats.get(key)?.[0] ?? false;
  }

  function isSfOnly(label: string) {
    return allDrinks.find((d) => d.label === label)?.sfOnly ?? false;
  }

  function toggleSf(label: string) {
    if (isSfOnly(label)) return true;
    const newSf = !(sfState[label] ?? false);
    sfState[label] = newSf;
    for (const c of chosen) {
      if (c.label === label) c.sf = newSf;
    }
  }

  function currentSf(label: string) {
    if (isSfOnly(label)) return true;
    return sfState[label] ?? false;
  }

  function count(label: string) {
    const sf = currentSf(label);
    return chosen.filter((c) => c.label === label && c.sf === sf).length;
  }

  function plus(label: string) {
    chosen.push({ label, sf: currentSf(label) });
  }

  function minus(label: string) {
    const sf = currentSf(label);
    const i = chosen.findIndex((c) => c.label === label && c.sf === sf);
    if (i >= 0) chosen.splice(i, 1);
  }
  let chosen = $state<{ label: string; sf: boolean }[]>([]);
  let formEl: HTMLFormElement;
</script>

<form
  class="rise"
  bind:this={formEl}
  method="POST"
  action="?/create"
  use:enhance={() => {
    return async ({ update }) => {
      await update();
      chosen = [];
      open = false;
    };
  }}
>
  <button
    type={"button"}
    onclick={() => {
      if (!open) open = true;
      else if (chosen.length === 0) open = false;
      else formEl.requestSubmit();
    }}
    class="border-accent bg-accent/30 border-[2px] mr-2 mt-4 max-w-fit hover:bg-accent hover:cursor-pointer transition-colors p-3 rounded-2xl text-xl text-text"
    >{open ? "submit drinks" : "add a drink"}
  </button>
  <button
    type={"button"}
    onclick={() => {
      rbState.deleting = !rbState.deleting;
    }}
    class="border-5 bg-5/30 border-[2px] mt-4 max-w-fit hover:bg-5/80 hover:cursor-pointer transition-colors p-3 rounded-2xl text-xl text-text"
    >{rbState.deleting ? "stop editing" : "edit drinks"}
  </button>

  {#if open}
    <div
      in:slide={{ duration: 400 }}
      out:slide={{ duration: 400 }}
      class="min-w-full flex-row flex border-accent bg-accent/30 border-[2px] p-4 mt-4 rounded-2xl overflow-scroll gap-2"
    >
      {#each drinks as [key, items], n}
        <PickerCat onClick={() => toggleCat(key)} cat={key} num={n + 3} />

        {#if isCatOpen(key)}
          {#each items as item, i}
            <div
              in:fly|global={{ y: 50, duration: 300, delay: i * 40 }}
              out:fly|global={{ y: -20, duration: 300 / ((i ^ 2) + 1) }}
            >
              <Drink
                category={key}
                picker={true}
                label={item.label}
                sf={currentSf(item.label)}
                onsf={() => toggleSf(item.label)}
                count={count(item.label)}
                onplus={() => plus(item.label)}
                onminus={() => minus(item.label)}
                canToggleSf={item.label !== "zero" && key === "redbull"}
              />
            </div>
          {/each}
        {/if}
      {/each}
      {#each labels as label (label)}{/each}
    </div>
    <input type="hidden" name="picks" value={JSON.stringify(chosen)} />
  {/if}
</form>

<script lang="ts">
  import drinksJSONr from "$lib/drinks.json";
  import Drink from "./drink.svelte";
  import { enhance } from "$app/forms";
  import { slide } from "svelte/transition";
  import { backOut, cubicOut } from "svelte/easing";
  import { rbState } from "./deleting.svelte";
  import PickerCat from "./pickerCat.svelte";
  import { onMount } from "svelte";

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

  onMount(() => {
    const srcs = new Set(["plus", "minus", "s", "sf", "sfhidden"]);
    for (const [key, items] of drinks) {
      srcs.add(key);
      for (const item of items) {
        if (!item.sfOnly) srcs.add(item.label);
        if (item.sfOnly || key === "redbull") srcs.add(`${item.label}sf`);
      }
    }
    for (const src of srcs) new Image().src = `${src}.svg`;
  });

  function reducedMotion() {
    return matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function panel(node: HTMLElement) {
    if (reducedMotion()) return { duration: 0 };
    const base = slide(node, { duration: 320, easing: cubicOut });
    return {
      ...base,
      css: (t: number, u: number) => `${base.css!(t, u)};opacity:${t};`,
    };
  }

  function unfold(node: HTMLElement, { delay = 0, duration = 380 } = {}) {
    if (reducedMotion()) return { duration: 0 };
    const width = node.offsetWidth;
    const gap = parseFloat(getComputedStyle(node.parentElement!).columnGap) || 0;
    return {
      delay,
      duration,
      css: (t: number) => {
        const grow = cubicOut(t);
        const pop = backOut(t);
        return `
          width:${grow * width}px;
          margin-left:${(grow - 1) * gap}px;
          overflow-x:clip;
          opacity:${Math.min(t * 2, 1)};
          transform:translateY(${(1 - pop) * 16}px) scale(${0.6 + 0.4 * pop});
          transform-origin:left bottom;
        `;
      },
    };
  }
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
      transition:panel
      class="min-w-full flex-row flex border-accent bg-accent/30 border-[2px] p-4 mt-4 rounded-2xl overflow-scroll gap-2"
    >
      {#each drinks as [key, items], n}
        <PickerCat onClick={() => toggleCat(key)} cat={key} num={n + 3} />

        {#each items as item, i}
          {#if isCatOpen(key)}
            <div
              class="shrink-0"
              in:unfold={{ delay: i * 35 }}
              out:unfold={{ delay: (items.length - 1 - i) * 20, duration: 240 }}
            >
              <div class="w-max">
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
            </div>
          {/if}
        {/each}
      {/each}
      {#each labels as label (label)}{/each}
    </div>
    <input type="hidden" name="picks" value={JSON.stringify(chosen)} />
  {/if}
</form>

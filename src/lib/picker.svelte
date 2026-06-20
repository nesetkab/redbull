<script lang="ts">
  import rbtypes from "$lib/rbtypes.json";
  import Redbull from "./redbull.svelte";
  import { enhance } from "$app/forms";
  import { slide } from "svelte/transition";

  let open = $state(false);
  const labels = [...new Set(rbtypes.map((r) => r.label))];
  let sfState = $state<Record<string, boolean>>({});

  function toggleSf(label: string) {
    if (label === "zero") return;
    const newSf = !(sfState[label] ?? false);
    sfState[label] = newSf;
    for (const c of chosen) {
      if (c.label === label) c.sf = newSf;
    }
  }

  function currentSf(label: string) {
    if (label === "zero") return true;
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
    class="border-accent mt-4 max-w-fit hover:bg-accent hover:cursor-pointer transition-colors border p-3 rounded-2xl text-xl text-text"
    >{open ? "Close" : "Add a drink"}
  </button>

  {#if open}
    <div
      in:slide={{ duration: 400 }}
      out:slide={{ duration: 400 }}
      class="min-w-full flex-row flex bg-accent p-4 mt-4 rounded-2xl overflow-scroll gap-2"
    >
      {#each labels as label (label)}
        <Redbull
          picker={true}
          {label}
          sf={currentSf(label)}
          onsf={() => toggleSf(label)}
          count={count(label)}
          onplus={() => plus(label)}
          onminus={() => minus(label)}
          canToggleSf={label !== "zero"}
        />
      {/each}
    </div>
    <input type="hidden" name="picks" value={JSON.stringify(chosen)} />
  {/if}
</form>

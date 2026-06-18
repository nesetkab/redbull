<script lang="ts">
  import rbtypes from "$lib/rbtypes.json";
  import Redbull from "./redbull.svelte";
  import { enhance } from "$app/forms";
  import { slide } from "svelte/transition";

  let open = $state(false);
  let chosen = $state<{ label: string; sf: boolean }[]>([]);
  let formEl: HTMLFormElement;
</script>

<form
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
    class="border-accent mt-8 max-w-fit hover:bg-accent hover:cursor-pointer transition-colors border p-3 rounded-2xl text-xl text-text"
    >{open ? "Close" : "Add a drink"}
  </button>

  {#if open}
    <div
      in:slide={{ duration: 400 }}
      out:slide={{ duration: 400 }}
      class="min-w-full flex-row flex bg-accent p-8 mt-4 rounded-2xl overflow-scroll gap-2"
    >
      {#each rbtypes as rbtype}
        <Redbull
          picker={true}
          label={rbtype.label}
          sf={rbtype.sf}
          onselect={() => {
            const i = chosen.findIndex(
              (c) => c.label === rbtype.label && c.sf === rbtype.sf,
            );
            if (i >= 0) chosen.splice(i, 1);
            else chosen.push({ label: rbtype.label, sf: rbtype.sf });
          }}
          selected={chosen.some(
            (c) => c.label === rbtype.label && c.sf === rbtype.sf,
          )}
        />
      {/each}
    </div>
    <input type="hidden" name="picks" value={JSON.stringify(chosen)} />
  {/if}
</form>

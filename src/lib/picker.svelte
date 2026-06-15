<script lang="ts">
  import rbtypes from "$lib/rbtypes.json";
  import Redbull from "./redbull.svelte";
  import { slide } from "svelte/transition";

  let open = $state(false);
</script>

<button
  onclick={() => (open = !open)}
  class="border-accent mt-8 max-w-fit hover:bg-accent hover:cursor-pointer transition-colors border p-3 rounded-2xl"
>
  <h2 class="text-xl text-text">
    {#if open}
      Close
    {:else}
      Add a drink
    {/if}
  </h2>
</button>
{#if open}
  <div
    in:slide={{ duration: 400 }}
    out:slide={{ duration: 400 }}
    class="min-w-full flex-row flex bg-accent p-8 mt-4 rounded-2xl overflow-scroll gap-8"
  >
    {#each rbtypes as rbtype}
      <Redbull label={rbtype.label} sf={rbtype.sf} />
    {/each}
  </div>
{/if}

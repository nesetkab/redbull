<script lang="ts">
  import Redbull from "./redbull.svelte";
  import { slide } from "svelte/transition";
  import { invalidateAll } from "$app/navigation";

  interface Props {
    redbulls: { id: number; label: string; sf: boolean; createdAt: Date }[];
  }

  let { redbulls }: Props = $props();
  let deleting = $state(false);

  async function deleteOne(id: number) {
    const form = new FormData();
    form.set("id", String(id));
    await fetch("/?/delete", { method: "POST", body: form });
    await invalidateAll();
  }
</script>

<div class="flex flex-row flex-wrap min-w-full mt-5">
  {#each redbulls as redbull (redbull.id)}
    <Redbull
      label={redbull.label}
      sf={redbull.sf}
      picker={false}
      {deleting}
      onselect={() => deleteOne(redbull.id)}
    />
  {/each}
</div>

<div class="fixed left-0 max-w-full flex justify-center bottom-2 right-0">
  <button
    onclick={() => {
      deleting = !deleting;
    }}
    class={[
      "hover:cursor-pointer rounded-xl px-2 bg-black max-w-fit text-text",
      deleting && "bg-red-500",
    ]}
  >
    delete
  </button>
</div>

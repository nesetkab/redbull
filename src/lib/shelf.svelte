<script lang="ts">
  import Drink from "./drink.svelte";
  import { invalidateAll } from "$app/navigation";
  import { rbState } from "./deleting.svelte";

  interface Props {
    redbulls: { id: number; label: string; sf: boolean; createdAt: Date }[];
  }

  let { redbulls }: Props = $props();

  let deleting = $derived(rbState.deleting);

  async function deleteOne(id: number) {
    const form = new FormData();
    form.set("id", String(id));
    await fetch("/?/delete", { method: "POST", body: form });
    await invalidateAll();
  }

  function label(d: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(d);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((+today - +day) / 86_400_000);

    if (diff === 0) return "today!!";
    if (diff === 1) return "yesterday";

    const start = new Date(day);
    start.setDate(day.getDate() - day.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`;
  }

  let groups = $derived.by(() => {
    const map = new Map<string, typeof redbulls>();
    for (const rb of redbulls) {
      const key = label(rb.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(rb);
    }
    return [...map];
  });
</script>

<div class="flex flex-col overflow-y-scroll gap-6 mt-5 rise">
  {#each groups as [label, items] (label)}
    <section>
      <h3 class="text-text text-xl mb-2">{label}</h3>
      <div class="flex flex-row flex-wrap gap-2">
        {#each items as redbull (redbull.id)}
          <Drink
            label={redbull.label}
            sf={redbull.sf}
            picker={false}
            {deleting}
            onselect={() => deleteOne(redbull.id)}
          />
        {/each}
      </div>
    </section>
  {/each}
</div>

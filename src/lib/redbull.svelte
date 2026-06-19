<script lang="ts">
  interface Props {
    label: string;
    sf: boolean;
    selected?: boolean;
    picker: boolean;
    onselect?: () => void;
    deleting?: boolean;
  }

  let { label, sf, selected, picker, onselect, deleting }: Props = $props();
  let labelNorm = $derived(
    label.at(0)?.toUpperCase() + label.slice(1) + (sf ? " SF" : ""),
  );
  let labelPath = $derived(sf ? label + "sf" : label);
</script>

{#if picker}
  <div>
    <button
      type="button"
      class={[
        "flex flex-col hover:cursor-pointer hover:-translate-y-4 transition-all overflow-visible",
        selected && "-translate-y-4",
      ]}
      onclick={onselect}
    >
      <img src="{labelPath}.svg" alt="redbull" class="max-w-26" />
      <span class="text-text text-center">{labelNorm}</span>
    </button>
  </div>
{:else}
  <div>
    <div
      class={[
        "relative flex flex-col transition-all overflow-visible",
        deleting && "animate-pulse hover:animate-none",
        !deleting && "hover:-translate-y-4",
      ]}
    >
      <img src="{labelPath}.svg" alt="redbull" class="max-w-26" />
      <span class="text-text text-center">{labelNorm}</span>
      {#if deleting}
        <button
          class="absolute top-0 right-0 bg-red-500 hover:cursor-pointer px-1.5 text-text rounded-full"
          aria-label="delete"
          onclick={onselect}
        >
          ×
        </button>
      {/if}
    </div>
  </div>
{/if}

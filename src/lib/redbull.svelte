<script lang="ts">
  interface Props {
    label: string;
    sf: boolean;
    selected?: boolean;
    picker: boolean;
    onselect?: () => void;
    onplus?: () => void;
    onminus?: () => void;
    count?: number;
    deleting?: boolean;
  }

  let {
    label,
    sf,
    selected,
    picker,
    onselect,
    onplus,
    onminus,
    count,
    deleting,
  }: Props = $props();
  let labelNorm = $derived(
    label.at(0)?.toUpperCase() + label.slice(1) + (sf ? " SF" : ""),
  );
  let labelPath = $derived(sf ? label + "sf" : label);
</script>

{#if picker}
  <div>
    <div
      class={["flex flex-col justify-center items-center   overflow-visible"]}
    >
      <button
        type="button"
        class={[
          "  hover:cursor-pointer transition-all",
          selected && "-translate-y-4",
          !selected && "hover:-translate-y-4",
        ]}
        onclick={onselect}
        ><img src="{labelPath}.svg" alt="redbull" class="max-w-26" />
      </button>
      <div
        class="bg-bg gap-2 text-text rounded-2xl max-w-fit justify-self-center flex flex-row"
      >
        <button
          type="button"
          class="bg-red-600 hover:cursor-pointer text-text px-2 rounded-2xl"
          onclick={onminus}>-</button
        >
        {count}
        <button
          type="button"
          class="bg-green-600 hover:cursor-pointer text-text px-2 rounded-2xl"
          onclick={onplus}>+</button
        >
      </div>
    </div>
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

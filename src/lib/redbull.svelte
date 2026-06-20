<script lang="ts">
  interface Props {
    label: string;
    sf: boolean;
    selected?: boolean;
    picker: boolean;
    onselect?: () => void;
    onplus?: () => void;
    onminus?: () => void;
    onsf?: () => void;
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
    onsf,
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
      class={[
        "flex flex-row justify-center items-center gap-0 max-w-fit  overflow-visible",
      ]}
    >
      <button type="button"
        ><img src="{labelPath}.svg" alt="redbull" class="max-w-26" />
      </button>
      <div
        class="-rotate-75 gap-2 -ml-12 flex flex-row max-w-fit justify-self-center"
      >
        <div class="bg-bg gap-2 text-text flex flex-row rounded-2xl">
          <button
            type="button"
            class="bg-red-600 rotate-75 hover:cursor-pointer text-text px-2 rounded-2xl"
            onclick={onminus}>-</button
          >
          <span class="rotate-75">{count}</span>
          <button
            type="button"
            class="bg-green-600 rotate-75 hover:cursor-pointer text-text px-2 rounded-2xl"
            onclick={onplus}>+</button
          >
        </div>
        <button
          type="button"
          class={[
            "bg-blue-400 px-1 text-text rounded-2xl rotate-75",
            sf && "bg-blue-600",
          ]}
          onclick={onsf}>SF</button
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

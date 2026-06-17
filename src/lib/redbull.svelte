<script lang="ts">
  interface Props {
    label: string;
    sf: boolean;
    selected: boolean;
    onselect: () => void;
  }

  let { label, sf, selected, onselect }: Props = $props();
  let labelNorm =
    label.at(0)?.toUpperCase() + label.slice(1) + (sf ? " SF" : "");
  let labelPath = sf ? label + "sf" : label;
</script>

<div>
  <button
    type="button"
    class={[
      "flex flex-col hover:cursor-pointer hover:-translate-y-4 transition-all overflow-visible",
      selected && "-translate-y-4",
    ]}
    onclick={onselect}
  >
    <img src="{labelPath}.svg" alt="redbull" class="max-w-18" />
    <span class="text-text text-center">{labelNorm}</span>
  </button>
</div>

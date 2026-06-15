<script lang="ts">
  interface Props {
    label: string;
    sf: boolean;
  }

  let { label, sf }: Props = $props();
  let labelNorm =
    label.at(0)?.toUpperCase() + label.slice(1) + (sf ? " SF" : "");
  let labelPath = sf ? label + "sf" : label;

  let selected = $state(false);
</script>

<div>
  <button
    class="flex flex-col hover:cursor-pointer hover:translate-y-2 transition-all overflow-visible"
    onclick={() => (selected = !selected)}
  >
    <img src="{labelPath}.svg" alt="redbull" class="max-w-18" />
    <span class="text-text text-center">{labelNorm}</span>
  </button>
</div>

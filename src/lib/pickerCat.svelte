<script lang="ts">
  interface Props {
    onClick: () => void;
    cat: string;
    num: number;
  }
  let { onClick, cat, num }: Props = $props();
</script>

<button
  type="button"
  onclick={onClick}
  class="p-2 border my-1.5 cursor-pointer hover:scale-105 transition-all rounded-2xl max-w-26"
  style:background-color="color-mix(in srgb, var(--color-{num}) 60%,
  transparent)"
  style:border-color="var(--color-{num})"
>
  <img src="{cat}.svg" alt="drink category" />
</button>

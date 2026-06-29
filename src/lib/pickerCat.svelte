<script lang="ts">
  interface Props {
    onClick: () => void;
    cat: string;
  }
  let { onClick, cat }: Props = $props();
</script>

<button type="button" onclick={onClick}>
  <img
    src="{cat}.svg"
    alt="drink category"
    class="p-2 bg-2/60 border border-2 rounded-2xl max-w-26"
  />
</button>

<script lang="ts">
  import { enhance } from "$app/forms";

  let { form } = $props();
</script>

<div class="bg-bg min-h-screen font-body flex flex-col gap-4 p-8 rise">
  <h1 class="text-4xl text-text font-bold font-header">owner login</h1>
  <form method="POST" use:enhance class="flex flex-row gap-2 max-w-md">
    <input
      type="password"
      name="password"
      autocomplete="current-password"
      required
      class="min-w-0 flex-1 bg-bg border-accent border-[2px] focus:border-5 focus:outline-none transition-colors rounded-2xl p-3 text-xl text-text"
    />
    <button
      class="border-accent bg-accent/30 border-[2px] hover:bg-accent hover:cursor-pointer transition-colors p-3 rounded-2xl text-xl text-text"
      >log in</button
    >
  </form>
  {#if form?.error}
    <p class="text-text opacity-60">{form.error}</p>
  {/if}
</div>

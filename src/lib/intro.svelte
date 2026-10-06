<script lang="ts">
  import { onMount } from "svelte";

  let dialog: HTMLDialogElement;
  let goButton: HTMLButtonElement;

  function markSeen() {
    try {
      localStorage.setItem("seenIntro", "1");
    } catch {}
  }

  onMount(() => {
    let seen = false;
    try {
      seen = localStorage.getItem("seenIntro") === "1";
    } catch {}
    if (seen) return;
    dialog.showModal();
    goButton.focus();
  });
</script>

<dialog
  bind:this={dialog}
  onclose={markSeen}
  onclick={(e) => e.target === dialog && dialog.close()}
  aria-labelledby="intro-title"
  class="m-auto w-[calc(100%-2rem)] max-w-md bg-transparent overflow-visible backdrop:bg-black/60"
>
  <div
    class="rise flex flex-col gap-4 p-6 border-2 border-accent shadow-[4px_4px_0_0_var(--color-accent)] rotate-[-1deg] bg-stats rounded-2xl font-body text-text sm:text-lg"
  >
    <h2 id="intro-title" class="text-3xl font-header">hi !! welcome</h2>
    <p>
      log every coffee, red bull and monster you drink, and watch the numbers
      add up.
    </p>
    <ul class="flex flex-col gap-2 opacity-80">
      <li>
        tap <b class="text-5">add a drink</b>, pick a category, hit + on what
        you had, then <b class="text-5">submit drinks</b>
      </li>
      <li>
        forgot one? change the <b class="text-5">when?</b> time before you submit
      </li>
      <li>no account needed. ur drinks live in this browser and only u can see them</li>
    </ul>
    <div class="flex flex-row items-center justify-between gap-4 mt-2">
      <a
        href="/neset"
        onclick={markSeen}
        class="opacity-60 hover:opacity-100 transition-opacity"
      >
        see neset's wall →
      </a>
      <button
        bind:this={goButton}
        onclick={() => dialog.close()}
        class="border-accent bg-accent/30 border-[2px] hover:bg-accent focus-visible:bg-accent focus-visible:outline-none hover:cursor-pointer transition-colors p-3 rounded-2xl text-xl"
        >let's go</button
      >
    </div>
  </div>
</dialog>

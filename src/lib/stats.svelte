<script lang="ts">
  import { getCaffeine } from "./drinks";
  import { Chart, Svg, Axis, Spline, Points, Tooltip } from "layerchart";
  import { scaleTime, scaleLinear } from "d3-scale";
  import { onMount } from "svelte";

  let isMobile = $state(false);

  onMount(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    isMobile = mq.matches;
    const handler = (e: MediaQueryListEvent) => (isMobile = e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  });

  interface Props {
    drinks: { id: number; label: string; sf: boolean; createdAt: Date }[];
  }

  let { drinks }: Props = $props();

  let totalCount = $derived(drinks.length);

  let totalCaffeine = $derived(
    drinks.reduce((sum, e) => sum + getCaffeine(e.label), 0),
  );

  function getDaysAscending() {
    return [
      ...new Set(
        drinks.map((e) => {
          const d = new Date(e.createdAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
      ),
    ].sort((a, b) => a - b);
  }

  let currentStreak = $derived.by(() => {
    if (drinks.length === 0) return 0;

    let days = getDaysAscending();
    let today = new Date().setHours(0, 0, 0, 0);

    if (days[days.length - 1] !== today) return 0;
    let streak = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (days[i] - days[i - 1] === 86_400_000) streak++;
      else break;
    }
    return streak;
  });

  let longestStreak = $derived.by(() => {
    if (drinks.length === 0) return 0;

    let days = getDaysAscending();

    let best = 1,
      run = 1;
    for (let i = 1; i < days.length; i++) {
      if (days[i] - days[i - 1] === 86_400_000) run++;
      else run = 1;
      if (run > best) best = run;
    }
    return best;
  });

  let days = $state(10);

  let daily = $derived.by(() => {
    const DAYS = days;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const buckets: { day: Date; count: number; caffeine: number }[] = [];

    for (let i = DAYS - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      buckets.push({ day: d, count: 0, caffeine: 0 });
    }

    const index = new Map(buckets.map((b, i) => [b.day.getTime(), i]));

    for (const e of drinks) {
      const d = new Date(e.createdAt);
      d.setHours(0, 0, 0, 0);
      const i = index.get(d.getTime());
      if (i !== undefined) {
        buckets[i].count++;
        buckets[i].caffeine += getCaffeine(e.label);
      }
    }
    return buckets;
  });
</script>

<div class="min-w-fit h-fit rise p-4 flex flex-col gap-4 bg-stats rounded-2xl">
  <h1 class="text-text text-3xl">statistics:</h1>
  <div class="grid grid-cols-2 gap-4">
    <div
      class="hover:bg-blue-400 bg-blue-600 rounded-2xl transition-all max-w-full p-4"
    >
      <h1 class="text-text text-5xl">
        {currentStreak} days
      </h1>
      <h1 class="text-xl text-text">current streak</h1>
    </div>
    <div
      class="hover:bg-blue-400 bg-blue-600 rounded-2xl transition-all max-w-full p-4"
    >
      <h1 class="text-text text-5xl">
        {longestStreak} days
      </h1>
      <h1 class="text-xl text-text">longest streak</h1>
    </div>
    <div
      class="hover:bg-blue-400 bg-blue-600 rounded-2xl transition-all max-w-full p-4"
    >
      <h1 class="text-text text-5xl">
        {totalCount} drinks
      </h1>
      <h1 class="text-xl text-text">total drinks</h1>
    </div>

    <div
      class="hover:bg-blue-400 bg-blue-600 rounded-2xl transition-all max-w-full p-4"
    >
      <h1 class="text-text text-5xl">
        {totalCaffeine} mg
      </h1>
      <h1 class="text-xl text-text">total caffeine</h1>
    </div>
  </div>
  <div class="flex justify-between flex-row">
    <h1 class="text-xl -mb-3 text-text">drinks in the last {days} days</h1>
    <div class="flex flex-row gap-1">
      <span class="text-text opacity-70">days:</span>
      <input
        bind:value={days}
        class="text-text border-white/40 rounded max-w-10 text-center truncate flex border"
      />
    </div>
  </div>

  <div
    class="sm:w-120 xs:w-60 h-64 px-4 py-4 bg-bg rounded-2xl border border-accent"
  >
    <Chart
      data={daily}
      x="day"
      xScale={scaleTime()}
      y="count"
      yScale={scaleLinear()}
      yDomain={[0, null]}
      yNice
      padding={{
        top: 8,
        right: 8,
        bottom: isMobile || days > 24 ? 28 : 12,
        left: 24,
      }}
      tooltip={{ mode: "bisect-x" }}
    >
      <Svg>
        <Axis
          placement="left"
          grid
          tickLength={10}
          rule={{ class: "stroke-white/40" }}
          classes={{
            tickLabel: "fill-white",
          }}
        />
        <Axis
          placement="bottom"
          tickLength={10}
          format={(d) =>
            d.toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
            })}
          rule={{ class: "stroke-white/40 mt-2" }}
          classes={{
            tickLabel: "fill-white",
          }}
          tickLabelProps={isMobile || (days > 24 && days < 31)
            ? { rotate: -45, textAnchor: "end" }
            : days > 30
              ? { rotate: -90, textAnchor: "end" }
              : {}}
        />
        <Spline class="stroke-accent stroke-2 fill-none" />
        <Points class="fill-white" />
      </Svg>
      <Tooltip.Root
        variant="none"
        let:data
        class="bg-bg/50 px-2 text-text border border-accent rounded"
      >
        <div class="font-semibold min-w-full text-center">
          {data.day.toLocaleDateString(undefined, {
            month: "numeric",
            day: "numeric",
          })}
        </div>
        <div class="flex gap-1">
          <span>{data.count}</span><span class="opacity-70">drinks</span>
        </div>
        <div class="flex gap-4">
          <span>{data.caffeine} mg</span>
        </div>
      </Tooltip.Root>
    </Chart>
  </div>
</div>

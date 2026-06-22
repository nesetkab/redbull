<script lang="ts">
  import { getCaffeine } from "./drinks";
  import { Chart, Svg, Axis, Spline, Points, Tooltip } from "layerchart";
  import { scaleTime, scaleLinear } from "d3-scale";

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

  let daily = $derived.by(() => {
    const DAYS = 10;
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

  let maxCount = $derived(Math.max(1, ...daily.map((d) => d.count)));

  function smoothPath(
    data: { count: number }[],
    w: number,
    h: number,
    max: number,
    tension = 0.5,
    yOffset = 0,
  ): string {
    if (data.length === 0) return "";
    const xs = data.map((_, i) => (i * w) / (data.length - 1));
    const ys = data.map((d) => yOffset + h - (d.count / max) * h);
    let d = `M ${xs[0]},${ys[0]}`;
    for (let i = 0; i < xs.length - 1; i++) {
      const x0 = xs[i - 1] ?? xs[i];
      const y0 = ys[i - 1] ?? ys[i];
      const x1 = xs[i],
        y1 = ys[i];
      const x2 = xs[i + 1],
        y2 = ys[i + 1];
      const x3 = xs[i + 2] ?? xs[i + 1];
      const y3 = ys[i + 2] ?? ys[i + 1];

      const cp1x = x1 + ((x2 - x0) / 6) * tension * 2;
      const cp1y = y1 + ((y2 - y0) / 6) * tension * 2;
      const cp2x = x2 - ((x3 - x1) / 6) * tension * 2;
      const cp2y = y2 - ((y3 - y1) / 6) * tension * 2;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }
    return d;
  }
</script>

<div class="min-w-fit rise p-4 flex flex-col gap-4 bg-gray-500 rounded-2xl">
  <h1 class="text-text text-3xl">Statistics:</h1>
  <div
    class="bg-blue-400 hover:bg-blue-600 rounded-2xl transition-all max-w-fit p-4"
  >
    <h1 class="text-text text-2xl">
      Current Streak: <span class="font-bold">{currentStreak} days</span>
    </h1>
  </div>
  <div
    class="bg-blue-400 hover:bg-blue-600 rounded-2xl transition-all max-w-fit p-4"
  >
    <h1 class="text-text text-2xl">
      Longest Streak: <span class="font-bold">{longestStreak} days</span>
    </h1>
  </div>
  <div
    class="bg-blue-400 hover:bg-blue-600 rounded-2xl transition-all max-w-fit p-4"
  >
    <h1 class="text-text text-2xl">
      Total Count: <span class="font-bold">{totalCount} drinks</span>
    </h1>
  </div>

  <div
    class="bg-blue-400 hover:bg-blue-600 rounded-2xl transition-all max-w-fit p-4"
  >
    <h1 class="text-text text-2xl">
      Total Caffeine: <span class="font-bold">{totalCaffeine} mg</span>
    </h1>
  </div>

  <div class="w-120 h-64 px-4 py-4 bg-bg rounded-2xl border border-accent">
    <Chart
      data={daily}
      x="day"
      xScale={scaleTime()}
      y="count"
      yScale={scaleLinear()}
      yDomain={[0, null]}
      yNice
      padding={{ top: 8, right: 8, bottom: 10, left: 24 }}
      tooltip={{ mode: "bisect-x" }}
    >
      <Svg>
        <Axis
          placement="left"
          grid
          rule={{ class: "stroke-white/40" }}
          classes={{
            tickLabel: "fill-white",
          }}
        />
        <Axis
          placement="bottom"
          format={(d) =>
            d.toLocaleDateString(undefined, {
              month: "numeric",
              day: "numeric",
            })}
          rule={{ class: "stroke-white/40" }}
          classes={{
            tickLabel: "fill-white",
          }}
        />
        <Spline class="stroke-accent stroke-2 fill-none" />
        <Points class="fill-white" />
      </Svg>
      <Tooltip.Root let:data>
        <Tooltip.Header>{data.day}</Tooltip.Header>
        <Tooltip.Item label="drinks" value={data.count} />
        <Tooltip.Item label="caffeine" value={`${data.caffeine} mg`} />
      </Tooltip.Root>
    </Chart>
  </div>
</div>

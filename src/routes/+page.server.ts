import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { events } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from './$types';
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  const allEvents = await db.select().from(events);
  return { events: allEvents };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await request.formData();
    const raw = String(form.get('picks') ?? '[]');

    let picks: { label: string; sf: boolean }[];
    try {
      picks = JSON.parse(raw);
    } catch {
      return fail(400, { error: "bad pick payload :(" });
    }
    if (!Array.isArray(picks) || picks.length === 0) {
      return fail(400, { error: "u gotta pick one bucko" });
    }

    const rows = picks.map(p => ({
      label: String(p.label),
      sf: Boolean(p.sf)
    }));

    const [created] = await db
      .insert(events)
      .values(rows)
      .returning();

    return { success: true, created };
  },
  delete: async ({ request }) => {
    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!Number.isFinite(id)) return fail(400, { error: "bad id" })
    await db.delete(events).where(eq(events.id, id));
    return { success: true };
  },
};

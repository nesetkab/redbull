import { db } from "$lib/server/db";
import { eq, desc, and } from "drizzle-orm";
import { events } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from './$types';
import { fail } from "@sveltejs/kit";
import { normalizePick } from "$lib/drinks";

export const load: PageServerLoad = async ({ locals }) => {
  const allEvents = await db.select().from(events).where(eq(events.userId, locals.userId)).orderBy(desc(events.createdAt), desc(events.id));
  return { events: allEvents };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const raw = String(form.get('picks') ?? '[]');

    let picks: unknown;
    try {
      picks = JSON.parse(raw);
    } catch {
      return fail(400, { error: "bad pick payload :(" });
    }
    if (!Array.isArray(picks) || picks.length === 0) {
      return fail(400, { error: "u gotta pick one bucko" });
    }
    if (picks.length > 50) {
      return fail(400, { error: "50 drinks at once?? no" });
    }
    const valid = picks.map(normalizePick);
    if (valid.some((p) => p === null)) {
      return fail(400, { error: "that's not a drink i know :(" });
    }

    const at = String(form.get('at') ?? '');
    const createdAt = at ? new Date(at) : new Date();
    if (Number.isNaN(createdAt.getTime())) {
      return fail(400, { error: "bad time :(" });
    }
    if (createdAt.getTime() > Date.now() + 60_000) {
      return fail(400, { error: "no time traveling >:(" });
    }

    const rows = valid.map((p) => ({
      userId: locals.userId,
      createdAt,
      ...p!,
    }));

    const [created] = await db
      .insert(events)
      .values(rows)
      .returning();

    return { success: true, created };
  },
  delete: async ({ request, locals }) => {
    const form = await request.formData();
    const id = Number(form.get('id'));
    if (!Number.isInteger(id) || id < 1 || id > 2_147_483_647) {
      return fail(400, { error: "bad id" });
    }
    await db.delete(events).where(and(eq(events.id, id), eq(events.userId, locals.userId)));
    return { success: true };
  },
};

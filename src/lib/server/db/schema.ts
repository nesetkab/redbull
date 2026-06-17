import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  sf: boolean('sf').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

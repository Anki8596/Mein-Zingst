import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteContent = sqliteTable("site_content", {
  id: integer("id").primaryKey(),
  content: text("content").notNull(),
  updatedAt: text("updated_at").notNull(),
  updatedBy: text("updated_by"),
});

export const guestRequests = sqliteTable("guest_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(),
  payload: text("payload").notNull(),
  createdAt: text("created_at").notNull(),
});

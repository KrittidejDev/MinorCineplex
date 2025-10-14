import { neon, neonConfig } from "@neondatabase/serverless";
import { WebSocket } from "ws";

neonConfig.webSocketConstructor = WebSocket;
neonConfig.poolQueryViaFetch = true;

async function setupSeats() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS seats (
      id TEXT PRIMARY KEY,
      cinema_id TEXT NOT NULL,
      seat_number TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available',
      locked_by TEXT,
      lock_expiry TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS outbox (
      sequence_id SERIAL PRIMARY KEY,
      mutation_id TEXT NOT NULL,
      channel TEXT NOT NULL,
      name TEXT NOT NULL,
      data JSONB,
      headers JSONB
    );
  `;

  await sql`
    CREATE OR REPLACE FUNCTION public.outbox_notify() RETURNS trigger AS $$
    BEGIN
      PERFORM pg_notify('ably_adbc'::text, ''::text);
      RETURN NULL;
    END; $$ LANGUAGE plpgsql;
  `;

  await sql`
    CREATE OR REPLACE TRIGGER public_outbox_trigger
    AFTER INSERT ON public.outbox
    FOR EACH STATEMENT
    EXECUTE PROCEDURE public.outbox_notify();
  `;

  console.log("Seats schema ready!");
}

setupSeats();

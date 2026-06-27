import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

interface SyncPayload {
  players: unknown[];
  rounds: unknown[];
  currentRoundNumber: number;
  selections: { winners: string[]; earlyArrivals: string[]; payments: string[] };
  updatedAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __leagueSyncState: SyncPayload | null;
}

if (!globalThis.__leagueSyncState) {
  globalThis.__leagueSyncState = null;
}

export async function GET() {
  return NextResponse.json(globalThis.__leagueSyncState ?? { updatedAt: 0 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as SyncPayload;
    if (typeof body.updatedAt !== "number") {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const current = globalThis.__leagueSyncState;
    if (!current || body.updatedAt >= current.updatedAt) {
      globalThis.__leagueSyncState = body;
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}

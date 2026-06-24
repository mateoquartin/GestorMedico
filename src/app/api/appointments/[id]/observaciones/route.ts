// src/app/api/appointments/[id]/observaciones/route.ts
// Versión robusta: sin alias, firma estándar de Next y validaciones claras.

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { NextRequest } from "next/server";

// GET /api/appointments/:id/observaciones
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;
    if (!id) return Response.json({ error: "MISSING_ID" }, { status: 400 });

    const appt = await prisma.appointment.findUnique({
      where: { id },
      select: { observaciones: true, updatedAt: true },
    });

    if (!appt) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

    return Response.json({
      text: appt.observaciones ?? "",
      updatedAt: appt.updatedAt,
    });
  } catch (e) {
    console.error("OBSERVACIONES GET error:", e);
    return Response.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

// PUT /api/appointments/:id/observaciones
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;
    if (!id) return Response.json({ error: "MISSING_ID" }, { status: 400 });

    type ObservacionesBody = { text: string };
    let body: ObservacionesBody;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "INVALID_JSON" }, { status: 400 });
    }

    const text =
      typeof body?.text === "string"
        ? body.text
        : null;
    if (text == null)
      return Response.json({ error: "INVALID_BODY" }, { status: 400 });

    const exists = await prisma.appointment.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

    const updated = await prisma.appointment.update({
      where: { id },
      data: { observaciones: text },
      select: { observaciones: true, updatedAt: true },
    });

    return Response.json({
      text: updated.observaciones ?? "",
      updatedAt: updated.updatedAt,
    });
  } catch (e) {
    console.error("OBSERVACIONES PUT error:", e);
    return Response.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

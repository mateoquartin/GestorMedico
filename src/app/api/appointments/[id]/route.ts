// src/app/api/appointments/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
// usa import RELATIVO si tu alias @ no funciona
import { prisma } from "../../../../lib/prisma";
// Define AppointmentEstado enum here if not exported elsewhere
enum AppointmentEstado {
  CANCELADO = "CANCELADO",
  // Add other possible states if needed
}

// NOTE: In Next.js 15, the generated type validation (RouteHandlerConfig) can wrap route params in a Promise
// so we type the context accordingly and normalize it. This keeps compatibility if Next changes this in future.
type DeleteContext = { params: { id: string } } | { params: Promise<{ id: string }> };

export async function DELETE(
  _req: NextRequest,
  context: DeleteContext
): Promise<Response> {
  // Support both direct object and Promise-wrapped params
  const resolvedParams = 'params' in context && context.params instanceof Promise
    ? await context.params
    : (context as { params: { id: string } }).params;
  const { id } = resolvedParams;
  if (!id) return NextResponse.json({ error: "MISSING_ID" }, { status: 400 });

  try {
    // Soft delete: marcar estado como CANCELADO (lo mostramos como “Eliminado” en la UI)
    const appt = await prisma.appointment.update({
      where: { id },
      data: { estado: AppointmentEstado.CANCELADO }, // si tu enum es distinto (ELIMINADO), cambialo aquí
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: appt.id });
  } catch {
    return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
  }
}

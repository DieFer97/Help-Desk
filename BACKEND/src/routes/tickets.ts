import { PrismaClient } from "@prisma/client"
import { Router, type NextFunction, type Request, type Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import { AppError } from "../middleware/errorHandler"
import { chatService } from "../services/chat.service"

const router = Router()
const prisma = new PrismaClient()

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post(
  "/confirm",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { ticketNumber } = req.body
    const ticket = await chatService.confirmTicket(ticketNumber, Number(req.userId!))
    res.status(200).json({
      success: true,
      ticket,
      message: "Ticket confirmado exitosamente",
    })
  }),
)

router.post(
  "/cancel",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { ticketNumber } = req.body
    await chatService.cancelTicket(ticketNumber, Number(req.userId!))
    res.status(200).json({
      success: true,
      message: "Ticket cancelado",
    })
  }),
)

router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: {
          select: { nombre: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.status(200).json(tickets)
  }),
)

router.get(
  "/recent-queries",
  asyncHandler(async (_req: Request, res: Response) => {
    const recentChats = await prisma.chat.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: { nombre: true, email: true },
        },
      },
    })

    const queries = recentChats.map((chat) => ({
      id: chat.id,
      content: chat.lastMessage || chat.title,
      timestamp: chat.timestamp,
      userName: chat.user.nombre,
      userEmail: chat.user.email,
    }))

    res.status(200).json(queries)
  }),
)

router.get(
  "/stats",
  asyncHandler(async (_req: Request, res: Response) => {
    const totalUsers = await prisma.user.count();
    const totalChats = await prisma.chat.count();

    const criticalTickets = await prisma.ticket.count({
      where: {
        prioridad: { in: ["alta", "crítica"] },
        estado: { not: "resuelto" },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const resolvedToday = await prisma.ticket.count({
      where: {
        estado: "resuelto",
        updatedAt: { gte: today, lt: tomorrow },
      },
    });

    const totalTickets = await prisma.ticket.count();

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const weeklyTickets = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await prisma.ticket.count({
          where: {
            createdAt: { gte: date, lt: nextDay },
          },
        });

        const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
        return {
          name: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
          tickets: count,
        };
      })
    );

    const tickets = await prisma.ticket.findMany({
      select: { asunto: true },
    });

    const categoryCount: Record<string, number> = {
      Técnico: 0,
      Facturación: 0,
      Soporte: 0,
      Ventas: 0,
    };

    tickets.forEach((t) => {
      const key = t.asunto.toLowerCase();
      if (key.includes("factur") || key.includes("pago") || key.includes("cobro"))
        categoryCount["Facturación"]++;
      else if (key.includes("técnico") || key.includes("error") || key.includes("sistema"))
        categoryCount["Técnico"]++;
      else if (key.includes("soporte") || key.includes("ayuda") || key.includes("duda"))
        categoryCount["Soporte"]++;
      else categoryCount["Ventas"]++;
    });

    const categories = Object.entries(categoryCount)
      .map(([name, value]) => ({
        name,
        value,
        color: {
          Técnico: "#8b5cf6",
          Facturación: "#06b6d4",
          Soporte: "#10b981",
          Ventas: "#f59e0b",
        }[name],
      }))
      .filter((c) => c.value > 0);

    res.status(200).json({
      totalUsers,
      totalChats,
      criticalTickets,
      resolvedToday,
      totalTickets,
      weeklyTickets,
      categories,
    });
  })
);

router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { estado, prioridad, adminNota } = req.body

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!ticket) throw new AppError(404, "Ticket no encontrado")

    const updated = await prisma.ticket.update({
      where: { id: Number(req.params.id) },
      data: {
        estado,
        prioridad,
        adminNota,
        updatedAt: new Date(),
      },
    })

    res.status(200).json({
      success: true,
      ticket: updated,
    })
  }),
)

router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!ticket) throw new AppError(404, "Ticket no encontrado")

    await prisma.ticket.delete({
      where: { id: Number(req.params.id) },
    })

    res.status(200).json({
      success: true,
      message: "Ticket eliminado exitosamente",
    })
  }),
)

export default router
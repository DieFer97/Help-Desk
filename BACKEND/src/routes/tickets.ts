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
    const allMessages = await prisma.message.findMany({
      take: 50,
      orderBy: { timestamp: "desc" },
      select: { id: true, sender: true, content: true }
    })
    console.log("🔍 DEBUG - Valores de sender en BD:",
      allMessages.map(m => ({ id: m.id, sender: m.sender, preview: m.content.substring(0, 30) }))
    )

    const recentMessages = await prisma.message.findMany({
      where: {
        sender: "user",
      },
      take: 20,
      orderBy: { timestamp: "desc" },
      include: {
        chat: {
          include: {
            user: {
              select: { nombre: true, email: true },
            },
          },
        },
      },
    })

    console.log(`✅ Mensajes filtrados (sender='user'): ${recentMessages.length}`)

    const queries = recentMessages.map((message) => ({
      id: message.id,
      chatId: message.chatId,
      content: message.content,
      timestamp: message.timestamp,
      userName: message.chat.user.nombre,
      userEmail: message.chat.user.email,
      sender: message.sender,
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

    const weeklyQueries = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await prisma.message.count({
          where: {
            sender: "user",
            timestamp: { gte: date, lt: nextDay },
          },
        });

        const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
        return {
          name: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
          consultas: count,
        };
      })
    );

    console.log("📊 weeklyQueries:", weeklyQueries);

    const tickets = await prisma.ticket.findMany({
      select: { detalle: true },
    });

    const categoryCount: Record<string, number> = {
      Clientes: 0,
      Ventas: 0,
      Productos: 0,
      Otros: 0,
    };

    tickets.forEach((t) => {
      const key = (t.detalle || "").toLowerCase();

      if (key.includes("cliente") || key.includes("clientes")) {
        categoryCount["Clientes"]++;
      } else if (key.includes("venta") || key.includes("ventas")) {
        categoryCount["Ventas"]++;
      } else if (key.includes("producto") || key.includes("productos")) {
        categoryCount["Productos"]++;
      } else {
        categoryCount["Otros"]++;
      }
    });

    const categories = Object.entries(categoryCount)
      .map(([name, value]) => ({
        name,
        value,
        color: {
          Clientes: "#6366f1",
          Ventas: "#f59e0b",
          Productos: "#06b6d4",
          Otros: "#10b981",
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
      weeklyQueries,
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

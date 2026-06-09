import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as notificationService from "../services/notification.service.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user!.userId);
    res.json({ status: "success", data: notifications });
  } catch (error) {
    next(error);
  }
});

router.get("/unread-count", async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.userId);
    res.json({ status: "success", data: count });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/read", async (req, res, next) => {
  try {
    await notificationService.markAsRead(req.user!.userId, req.params.id);
    res.json({ status: "success", message: "Marked as read" });
  } catch (error) {
    next(error);
  }
});

router.post("/mark-all-read", async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user!.userId);
    res.json({ status: "success", message: "All marked as read" });
  } catch (error) {
    next(error);
  }
});

// Seed an example notification for testing
router.post("/test-trigger", async (req, res, next) => {
  try {
    const notif = await notificationService.createNotification(
      req.user!.userId,
      "Welkom bij RebuildYourLife!",
      "Je account is succesvol ingesteld. Ontdek je dashboard.",
      "/dashboard"
    );
    res.json({ status: "success", data: notif });
  } catch (error) {
    next(error);
  }
});

export default router;

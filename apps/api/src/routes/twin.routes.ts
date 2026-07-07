import { Router } from 'express';
import { DigitalTwin } from '../core/twin/DigitalTwin';

const router = Router();

// ==========================================
// V6.0 SOVEREIGN ENTERPRISE CONTROL PLANE
// ==========================================

// GET /api/v1/twin/state
router.get('/state', async (req, res) => {
  try {
    const twin = DigitalTwin.getInstance();
    const state = twin.getStateSnapshot();

    res.status(200).json({
      message: 'Enterprise State retrieved successfully',
      state
    });
  } catch (error: any) {
    console.error('[Digital Twin API Error]', error);
    res.status(500).json({ error: error.message || 'Internal Enterprise Server Error' });
  }
});

export default router;

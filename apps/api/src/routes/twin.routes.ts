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

import { GovernancePlane } from '../core/governance/GovernancePlane';

// POST /api/v1/twin/propose-action
// Used by the execution plane / agents to propose actions
router.post('/propose-action', async (req, res) => {
  try {
    const { actionType, amount, currency, evidence, target, contextEventId } = req.body;
    
    if (!actionType) {
      return res.status(400).json({ error: 'actionType is required' });
    }

    const governance = new GovernancePlane();
    
    const decision = await governance.evaluateProposal({
      actionType,
      amount,
      currency,
      evidence,
      target
    }, contextEventId);

    res.status(200).json({
      message: 'Proposal Evaluated',
      governance: decision
    });

  } catch (error: any) {
    console.error('[Governance API Error]', error);
    res.status(500).json({ error: error.message || 'Internal Enterprise Server Error' });
  }
});

export default router;

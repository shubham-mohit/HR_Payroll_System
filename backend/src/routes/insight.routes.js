import express from "express";

import { getCountryInsights, getJobTitleInsights, getAgeDistribution, getNewHiresThisMonth } from "../controllers/insights.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/country/:country', authenticate, getCountryInsights)

router.get('/jobtitle', authenticate, getJobTitleInsights)

router.get('/age-distribution', authenticate, getAgeDistribution);

router.get('/new-hires', authenticate, getNewHiresThisMonth);

export default router;

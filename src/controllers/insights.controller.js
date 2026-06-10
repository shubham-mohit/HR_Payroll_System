import { get, set } from "../utils/cache.js";
import { getCountryInsightsService, getAgeDistributionService, getJobTitleInsightsService, getNewHiresThisMonthService } from "../services/insight.services.js";
import { NotFoundError, BadrequestError } from "../utils/error.js";


export async function getCountryInsights(req, res, next) {
    let { country } = req.params
    try {
        country = country.trim()
        const cached = await get(country);
        if (cached) {
            return res.status(200).json({
                success: true,
                source: 'cache',
                data: cached,
            });
        }

        const insights = await getCountryInsightsService(country);

        if (!insights) {
            throw new NotFoundError('No employee found for country.')
        }

        await set(country, insights);

        return res.status(200).json({
            success: true,
            source: 'db',
            data: insights,
        });

    } catch (err) {
        next(err)
    }
}

export const getJobTitleInsights = async (req, res, next) => {
    try {
        const { jobTitle } = req.params;

        if (!jobTitle?.trim()) {
            throw new BadrequestError("Job title is required.");
        }

        const insights = await getJobTitleInsightsService(jobTitle.trim());

        if (!insights) {
            throw new NotFoundError(`No employees found for job title: ${jobTitle}`);
        }

        return res.status(200).json({
            success: true,
            data: insights,
        });
    } catch (err) {
        next(err);
    }
};

export const getAgeDistribution = async (req, res, next) => {
    try {
        const data = await getAgeDistributionService();
        if (!data) {
            return res.status(404).json({ success: false, message: 'No data found' })
        }
        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        next(err);
    }
};

export const getNewHiresThisMonth = async (req, res, next) => {
    try {
        const data = await getNewHiresThisMonthService();
        if (!data) {
            throw new NotFoundError('No employee found.')
        }
        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        next(err);
    }
};

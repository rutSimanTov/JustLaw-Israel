import { Request, Response } from 'express';
import { cohortService } from '../services/cohort.service';
import {CohortResponse,CohortsResponse,Cohort} from '@base-project/shared'

export const cohortController = {

//get all active cohorts
  async listCohorts(req: Request, res: Response<CohortsResponse>): Promise<void> {
    try {
      const cohorts: Cohort[] = await cohortService.getAllCohorts()

      const responseBody: CohortsResponse = {
        success: true,
        data: {
          items: cohorts,
          total: cohorts.length,
        },
      }

      res.json(responseBody)
    } catch (err: unknown) {
      // לוכדים שגיאה
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred'

      const errorResponse: CohortsResponse = {
        success: false,
        error: message,
      }

      res.status(500).json(errorResponse)
    }
  },

  //create a new cohort
  async createCohort(
    req: Request,
    res: Response<CohortResponse>
  ): Promise<void> {
    try {
      const cohortData: Omit<Cohort, 'id'> = req.body
      const created = await cohortService.createCohort(cohortData)
      const payload: CohortResponse = {
        success: true,
        data: created,
      }
      res.status(201).json(payload)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      const errorPayload: CohortResponse = {
        success: false,
        error: message,
      }
      res.status(500).json(errorPayload)
    }
  },

  //get cohort details by id
  async getCohortById(
    req: Request,
    res: Response<CohortResponse>
  ): Promise<void> {
    try {
      const { id } = req.params
      const cohort = await cohortService.getCohortById(id)
      if (cohort) {
        const payload: CohortResponse = {
          success: true,
          data: cohort,
        }
        res.json(payload)
      } else {
        const errorPayload: CohortResponse = {
          success: false,
          error: 'Cohort not found',
        }
        res.status(404).json(errorPayload)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      const errorPayload: CohortResponse = {
        success: false,
        error: message,
      }
      res.status(500).json(errorPayload)
    }
  },

  //update cohort details
  async updateCohort(
    req: Request,
    res: Response<CohortResponse>
  ): Promise<void> {
    try {
      const { id } = req.params
      const updates: Partial<Cohort> = req.body
      const updated = await cohortService.updateCohort(id, updates)
      if (updated) {
        const payload: CohortResponse = {
          success: true,
          data: updated,
        }
        res.json(payload)
      } else {
        const errorPayload: CohortResponse = {
          success: false,
          error: 'Cohort not found',
        }
        res.status(404).json(errorPayload)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      const errorPayload: CohortResponse = {
        success: false,
        error: message,
      }
      res.status(500).json(errorPayload)
    }
  },

  //delete a cohort
    async archiveCohort(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await cohortService.deleteCohort(id);
            res.status(204).send(); // No content
        } catch (error: unknown) {
    if (error instanceof Error) {
        res.status(500).json({error:error.message}); // Accessing the message property of the Error
    } else {
        res.status(500).json({error:'An unknown error occurred'});
    }
  }},
}


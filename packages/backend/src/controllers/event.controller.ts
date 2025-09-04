import { Request, Response } from 'express'
import { cohortEventService } from '../services/cohortEvent.service'
import {
  ApiResponse,
  EventResponse,
  EventsResponse,
  CohortEvent,
  Cohort,
} from '@base-project/shared'

export interface CohortWithEvents {
  cohort: Cohort; 
  events: CohortEvent[];
}

export const eventController = {
  async createEvent(
    req: Request,
    res: Response<EventResponse>
  ): Promise<void> {
    try {
      const payload: Omit<CohortEvent, 'id'> = req.body
      const created = await cohortEventService.createCohortEvent(payload)
      const response: EventResponse = {
        success: true,
        data: created,
      }
      res.status(201).json(response)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      const errorResponse: EventResponse = {
        success: false,
        error: msg,
      }
      res.status(500).json(errorResponse)
    }
  },

  async getEventById(
    req: Request,
    res: Response<EventResponse>
  ): Promise<void> {
    try {
      const { id } = req.params
      const ev = await cohortEventService.getCohortEventById(id)
      if (ev) {
        const response: EventResponse = {
          success: true,
          data: ev,
        }
        res.json(response)
      } else {
        const errorResponse: EventResponse = {
          success: false,
          error: 'Event not found',
        }
        res.status(404).json(errorResponse)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      const errorResponse: EventResponse = {
        success: false,
        error: msg,
      }
      res.status(500).json(errorResponse)
    }
  },

  async updateEvent(
    req: Request,
    res: Response<EventResponse>
  ): Promise<void> {
    try {
      const { id } = req.params
      const updates: Partial<CohortEvent> = req.body
      const updated = await cohortEventService.updateCohrtEvent(id, updates)
      if (updated) {
        const response: EventResponse = {
          success: true,
          data: updated,
        }
        res.json(response)
      } else {
        const errorResponse: EventResponse = {
          success: false,
          error: 'Event not found',
        }
        res.status(404).json(errorResponse)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      const errorResponse: EventResponse = {
        success: false,
        error: msg,
      }
      res.status(500).json(errorResponse)
    }
  },

  async listEventsForUserCohort(
    req: Request,
    res: Response<EventsResponse>
  ): Promise<void> {
    try {
      const userCohortId = req.body.user?.cohort_id
      if (!userCohortId) {
        const errorResponse: EventsResponse = {
          success: false,
          error: 'No cohort assigned to user',
        }
        res.status(403).json(errorResponse)
      }

      const events = await cohortEventService.getEventsByCohort(userCohortId)
      const response: EventsResponse = {
        success: true,
        data: {
          items: events,
          total: events.length,
        },
      }
      res.json(response)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      const errorResponse: EventsResponse = {
        success: false,
        error: msg,
      }
      res.status(500).json(errorResponse)
    }
  },


//fetch all past events details for the one current active cohort
  async listPastEventsForActiveCohort(
    req: Request,
    res: Response<ApiResponse<CohortWithEvents>>
  ): Promise<void> {
    try {
      const cohortWithEvents:CohortWithEvents=await cohortEventService.fetchActiveCohortEvents()
      const response:ApiResponse<CohortWithEvents>  = {
        success: true,
        data: cohortWithEvents,
      };
      console.log(cohortWithEvents)
      res.json(response)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      const errorResponse: ApiResponse<CohortWithEvents> = {
        success: false,
        error: msg,
      }
      res.status(500).json(errorResponse)
    }
  },
}


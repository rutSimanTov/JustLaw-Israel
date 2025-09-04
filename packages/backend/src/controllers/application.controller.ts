import { ApplicationResponse, ApplicationsResponse } from '@base-project/shared';
import { Request, Response } from 'express';
import { acceleratorService } from '../services/accelerator.service';

export const applicationController = {
//add an application
  async submitApplication(req: Request, res: Response) {
    const applicationData = req.body;
    try {
      const submittedApplication = await acceleratorService.submitApplication(applicationData);
      const response: ApplicationsResponse = {
        success: !!submittedApplication,
        data: {
          items: submittedApplication,
          total: submittedApplication.length
        },
        error: submittedApplication ? undefined : 'Failed to submit application'
      };
      console.log(submittedApplication)
      res.status(submittedApplication ? 201 : 400).json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationResponse);
    }
  },

  //get an application by id
  async getApplicationById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const application = await acceleratorService.getApplicationById(id);
      const response: ApplicationResponse = {
        success: !!application,
        data: application|| undefined,
        error: application ? undefined : 'Application not found'
      };
      res.status(application ? 200 : 404).json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationResponse);
    }
  },

//get participant's details by cohort
  async getParticipantsNamesByCohort(req: Request, res: Response) {
    const  cohortId  = req.params.id;
    try {
      console.log(req.params)
        const participants = await acceleratorService.getApplicationsNamesByCohortId(cohortId);
        console.log("participants:" ,participants)
        const response = {
        success: !!participants,
        data: participants|| undefined,
        error: participants ? undefined : 'Application not found'
      };
      res.status(!response.error ? 200 : 404).json(response);
      } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationResponse);
    }
},

  //update application details
  async updateApplication(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;
    try {
      const updatedApplication = await acceleratorService.updateApplication(id, updates);
      const response: ApplicationResponse = {
        success: !!updatedApplication,
        data: updatedApplication|| undefined,
        error: updatedApplication ? undefined : 'Application not found'
      };
      res.status(updatedApplication ? 200 : 404).json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationResponse);
    }
  },

  //get all applications
  async listAllApplications(req: Request, res: Response) {
    try {
      const applications = await acceleratorService.getAllApplications();
      const response: ApplicationsResponse = {
        success: true,
        data: {
          items: applications,
          total: applications.length
        }
      };
      res.json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationsResponse);
    }
  },


    //get applications by cohort id
  async fetchApplicationsByCohortId(req: Request, res: Response) {
    try {
      const cohortId=req.params.id;
      console.log(req.params)
      const applications = await acceleratorService.getApplicationsByCohort(cohortId);
      const response: ApplicationsResponse = {
        success: true,
        data: {
          items: applications,
          total: applications.length
        }
      };
      res.json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationsResponse);
    }
  },

  //update an applicator status to be approved
  async approveApplication(req: Request, res: Response) {
    const { id } = req.params;
    const { adminId } = req.body;
    try {
      const approvedApplication = await acceleratorService.approveApplication(id, adminId);
      const response: ApplicationResponse = {
        success: !!approvedApplication,
        data: approvedApplication,
        error: approvedApplication ? undefined : 'Failed to approve application'
      };
      res.status(approvedApplication ? 200 : 400).json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationResponse);
    }
  },

  //update an applicator status to be rejected
  async rejectApplication(req: Request, res: Response) {
    const { id } = req.params;
    const { reason, adminId } = req.body;
    try {
      const rejectedApplication = await acceleratorService.rejectApplication(id, reason, adminId);
      const response: ApplicationResponse = {
        success: !!rejectedApplication,
        data: rejectedApplication,
        error: rejectedApplication ? undefined : 'Failed to reject application'
      };
      res.status(rejectedApplication ? 200 : 400).json(response);
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      } as ApplicationResponse);
    }
  },
};

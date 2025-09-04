// const logEntry: ILogger = {
//   RequestId: 12345,
//   UserId: 'user123',
//   Service: 'AuthService',
//   Level: 'INFO',
//   Message: 'User logged in successfully.',
//   Exception: ''
// };
// Logger(logEntry)

// import ILogger, { Logger } from '../log/logger';
import { string } from 'joi';
import { logfrombackend } from '../services/loggerService';
import * as zoomService from '../services/zoom.service';
export const getAllUserEvent1 = async (req: any, res: any) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const events = await zoomService.getAllUserEvent(userId);

    if (!events || events.length === 0) {
      logfrombackend(req.user.id, 'ZoomController', 'ERROR', 'no upcoming event found for the user', 'error fetching the meeting');

      return res.status(404).json({ success: false, message: 'No upcoming event found for the user' });

    }
    logfrombackend(req.user.id, 'ZoomController', 'INFO', 'successfully fetched all upcoming events for the user', 'success fetching the meeting');
    return res.status(200).json({ success: true, data: events });
  } catch (error: any) {
    logfrombackend(req.user.id, 'ZoomController', 'ERROR','dudrjsrj', 'error fetching the meeting');

    return res.status(500).json({ success: false, message: 'Server error' });
  }
};




// export const getUserEvent1 = async (req: any, res: any) => {
//   try {
//     debugger
//     const userId = req.user.id; // Assuming user ID is available in req.user
//     const event = await zoomService.getUserEvent(userId);
//     // console.log('event', event);

//     if (!event) {
//       return res.status(404).json({ success: false, message: 'No upcoming event found for the user' });
//     }
//     return res.status(200).json({ success: true, data: event });
//   } catch (error) {
//     console.error('Error in controller:', error);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };
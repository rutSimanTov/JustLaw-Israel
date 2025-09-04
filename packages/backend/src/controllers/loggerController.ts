import ILogger,{ Logger } from "../services/loggerService";

export const logError = async (req: any, res: any) => {
  try {
        const userId = req.user.id; // Assuming user ID is available in req.user
const { service, level, message, exception } = req.body;
const logEntrytoservice: ILogger = {
    UserId:userId,
    Service: service,
    Level: level,
    Message: message,
    Exception: exception,
    
}
    const log = await Logger(logEntrytoservice);
    return res.status(200).json({ success: true, message: 'Log entry created successfully' });
   
    
  } catch (error) {
    console.error('Error in controller:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
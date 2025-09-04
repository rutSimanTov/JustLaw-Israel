import * as fs from 'fs';
import * as path from 'path';

export default interface ILogger {
    RequestId: number;
    UserId: string;
    Service: string;
    Level: string;
    Message: string;
    Exception: string;
}
export function Logger(newEntry:ILogger){ 
debugger
   console.log("gggtttt");
   
const date = new Date().toISOString().split('T')[0]; // פורמט YYYY-MM-DD
const logFilePath = `./logs/log_${date}.txt`;

// אם הקובץ לא קיים, יוצרים אותו עם שורת התחלה
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '{date}\n');
}
else{
    // אם הקובץ קיים, מוסיפים את השורה החדשה
    const logEntry = `${new Date().toISOString()} | RequestId: ${newEntry.RequestId} | UserId: ${newEntry.UserId} | Service: ${newEntry.Service} | Level: ${newEntry.Level} | Message: ${newEntry.Message} | Exception: ${newEntry.Exception}\n`;
    
    try {
        fs.appendFileSync(logFilePath, logEntry);
    } catch (error) {
        console.error('Error writing to log file:', error);}

}
    }

    //import ILogger, { Logger } from '../log/logger';
    
    // const logEntry: ILogger = {
    //   RequestId: 12345,
    //   UserId: 'user123',
    //   Service: 'AuthService',
    //   Level: 'INFO',
    //   Message: 'User logged in successfully.',
    //   Exception: ''
    // };
    // Logger(logEntry)
import * as fs from 'fs';
import * as path from 'path';

export default interface ILogger {
    UserId: string;
    Service: string;
    Level: string;
    Message: string;
    Exception: string;
}
export function logfrombackend(userId: string, service: string, level: string, message: string, exception: string) {
    debugger
    const newEntry: ILogger = {
        UserId: userId, // ניתן לשנות בהתאם לצורך 
        Service: service,
        Level: level,
        Message: message,
        Exception: exception,
    }
    Logger(newEntry, true);
}
export function Logger(newEntry: ILogger, isback: boolean = false) {
    debugger
    let logsDir: string;
    isback ? logsDir = path.join(__dirname, '../log/logsBackend') : logsDir = path.join(__dirname, '../log/logsFrontend');


    // בדוק אם התיקייה קיימת, אם לא, צור אותה
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true }); // צור את תיקיית הלוגים
    }


   const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false // או true אם אתה מעדיף פורמט של 12 שעות
};

const date = new Date().toISOString().split('T')[0];

const formattedDate = (new Date()).toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem', ...options });
    const logFilePath = path.join(logsDir, `log_${date}.txt`); // נתיב לקובץ הלוג

    // אם הקובץ לא קיים, צור אותו עם שורת התחלה
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, `Log created on ${date}\n`); // שורת התחלה
    }

    // יצירת רישום הלוג
    const logEntry = `${formattedDate}| UserId: ${newEntry.UserId} | Service: ${newEntry.Service} | Level: ${newEntry.Level} | Message: ${newEntry.Message} | Exception: ${newEntry.Exception}\n`;

    // ניסיון להוסיף את הרישום לקובץ
    try {
        fs.appendFileSync(logFilePath, logEntry); // הוסף את הרישום לקובץ
    } catch (error) {
        console.error('Error writing to log file:', error); // טיפול בשגיאות
    }
}


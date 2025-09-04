import { sendReportEmail } from '../src/controllers/emailController';
import { Request, Response } from 'express';

jest.mock('../src/services/emailService', () => ({
  sendEmail: jest.fn(() => Promise.resolve()),
}));

describe('sendReportEmail', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    req = {
      body: {},
    };
    res = {
      status: statusMock,
      send: sendMock,
    } as unknown as Response;
    process.env.EMAIL = 'test@example.com';
  });


  it('should return 400 if category is missing', () => {
    req.body = { text: 'some text' };
    sendReportEmail(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ error: 'Missing category or text' });
  });

  it('should return 400 if text is missing', () => {
    req.body = { category: 'פוגעני' };
    sendReportEmail(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ error: 'Missing category or text' });
  });

  it('should return 400 if both category and text are missing', () => {
    req.body = {};
    sendReportEmail(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ error: 'Missing category or text' });
  });

  it('should return 400 if category or text are empty strings', () => {
    req.body = { category: '', text: '' };
    sendReportEmail(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith({ error: 'Missing category or text' });
  });

  it('should return 202 and call sendEmail if data is valid', () => {
    req.body = { category: 'פוגעני', text: 'תוכן' };
    sendReportEmail(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(202);
    expect(sendMock).toHaveBeenCalledWith({ message: 'Report received. Email is being sent.' });
    const { sendEmail } = require('../src/services/emailService');
    expect(sendEmail).toHaveBeenCalledWith('test@example.com', 'Report on content type: פוגעני', 'תוכן');
  });

  it('should handle special charactשers in category and text', () => {
    req.body = { category: 'מיוחד!@#$', text: 'טקסט עם תווים מיוחדים !@#$%^&*()' };
    sendReportEmail(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(202);
    expect(sendMock).toHaveBeenCalledWith({ message: 'Report received. Email is being sent.' });
    const { sendEmail } = require('../src/services/emailService');
    expect(sendEmail).toHaveBeenCalledWith('test@example.com', 'Report on content type: מיוחד!@#$', 'טקסט עם תווים מיוחדים !@#$%^&*()');
  });

  it('should use process.env.EMAIL as recipient', () => {
    process.env.EMAIL = 'another@example.com';
    req.body = { category: 'אחר', text: 'בדיקה' };
    sendReportEmail(req as Request, res as Response);
    const { sendEmail } = require('../src/services/emailService');
    expect(sendEmail).toHaveBeenCalledWith('another@example.com', expect.any(String), expect.any(String));
  });
});


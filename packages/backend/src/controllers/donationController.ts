// import { Request, Response } from 'express';
// import { sendReceiptEmail } from '../utils/email';

// export async function sendDonationReceipt(req: Request, res: Response) {
//   try {
//     const {
//       donorEmail,
//       donorName,
//       amount,
//       date,
//       receiptNumber,
//       transactionId,
//       isAnonymous,
//     } = req.body;

//     await sendReceiptEmail(
//       donorEmail,
//       {
//         donorName,
//         amount,
//         date,
//         receiptNumber,
//         transactionId,
//         isAnonymous,
//         currency: 'ILS'
//       },
//       true // PDF
//     );

//     res.status(200).json({ success: true, message: 'Receipt sent!' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: (error as Error).message });
//   }
// }
export{};
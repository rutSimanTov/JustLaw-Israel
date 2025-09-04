
import dotenv from 'dotenv';
dotenv.config();

import 'dotenv/config';
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // 🚨 רק לפיתוח

import express from 'express';
import cors from 'cors';
import path from 'path';
import uploadRouter from './routes/uploadImages';
import formsRouter from './routes/Forms.routes';
import EmailContactFrmRouter from './routes/EmailContactFormRouter';
import faqRouter from './routes/faqRouter';
import scrollRoutes from './routes/scroll';
import draftRoutes from './routes/draft';
import profileRouter from './routes/profileRouter';
import healthRoutes from './routes/health.routes';
import { databaseService } from './services/database';
import contributionRoutes from './routes/Contribution';
import pillarsRoutes from './routes/pillar';
import contentRoutes from './routes/contentRoutes';
import usersRoutes from './routes/user.routes';
import authRoutes from './routes/authRoutes';
import OurTeamRoutes from './routes/teamRoutes';
import eventRegistrationRouter from './routes/eventsRegistrationRoutes';
import cohortRoute from './routes/cohortRoutes';
import cohortEventRoute from './routes/cohortEventRoutes';
import EventRoute from './routes/events';
import profileSearchRoutes from './routes/profileSearchRoutes';
import createDonationRouter from './routes/donationRoutes';
// import uploadFileRoutes from './routes/uploadFile'; // Uncomment if needed

import resetRoutes from './routes/resetRoutes';
import DonationRoute from './routes/donationsRouter';
import bodyParser from 'body-parser';
import subscriptionRoutes from './routes/subscription.routes';
import cron from 'node-cron';
import { cancelSubscription } from './services/paypal.service';
import { handlePayPalWebhook } from './utils/paypal.webhook';
import { checkAndCancelExpiredSubscriptions } from "./utils/subscriptionChecker";
import atjRoutes from './routes/atjRoutes';
import getPaypalClient from './utils/paypalClient';
import zoomRoutes from './routes/zoom.routes';
import contributionFormsRouter from './routes/ContribtionForm';
import cohortRoutes from './routes/cohorts';
import applicationRoutes from './routes/applications';

import receiptRouter from './routes/receiptRoutes';
import contentAuthRouter from './routes/contentAuth';
import routerEmail from './routes/emailRout';
import { cleanupOldDrafts, cleanupOldVersions } from './services/draftService';
import usersCommentsRoutes from './routes/usersComments';
import calendarEventsRouter from './routes/calendarEventsRouter';
import searchArticleRoutes from './routes/indexContentRoutes';
import loggerRoute from './routes/logger.route';
import cancelRoute from './routes/cancelDonationRoutes';
import uploadFileRouter from './routes/uploadFile';
import uploadImages from './routes/uploadImages';
const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());
import uploadImageRouter from './routes/uploadImages';
app.use('/api', uploadImageRouter);
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
// Static folders
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/picture', express.static(path.join(__dirname, '../picture')));
// Extra routes (from both branches)
app.use('/api/access-calendar-events', calendarEventsRouter);
app.use('/api/upload', uploadFileRouter);
app.use('/api', uploadImages);
/**************************** */
// Routes setup
app.use('/api/send-report', routerEmail);
app.use('/api/forms', formsRouter);
app.use('/api/content-auth', contentAuthRouter);
app.use('/api/health', healthRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/faqs', faqRouter);
app.use('/api/contribution', contributionRoutes);
app.use('/api/contact', EmailContactFrmRouter);
app.use('/api/eventsregistration', eventRegistrationRouter);
app.use('/auth', authRoutes);
app.use('/api/scroll', scrollRoutes);
app.use('/api/draft', draftRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/profile', profileRouter);
app.use('/api/pillars', pillarsRoutes);
app.use('/api/our-team', OurTeamRoutes);
app.use('/api/cohorts', cohortRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/forms', formsRouter);
app.use('/api/contribution-forms', contributionFormsRouter);
app.use('/api/reset', resetRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/cohort', cohortRoute);
app.use('/api/cohortevent', cohortEventRoute);
app.use('/api/events', EventRoute);
app.use('/api/profile-search', profileSearchRoutes);
app.use('/api/contribution-forms', contributionFormsRouter);
app.use('/api/donations', DonationRoute);
app.use('/api/donations/receipt', receiptRouter);
// app.use('/api/uploadFile', uploadFileRoutes); // אם תרצי להפעיל, תוציאי את הקומנט
 const paypalClientInstance = getPaypalClient();
    app.use('/api/donations', createDonationRouter(paypalClientInstance));
// אתחול PayPal ושימוש בנתיב ה-donations עם האינסטנס שלו
app.use('/api/contribution-forms', contributionFormsRouter);
app.use('/api/reset', resetRoutes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/cohort', cohortRoute);
app.use('/api/cohortevent', cohortEventRoute);
app.use('/api/events', EventRoute);
app.use('/api/profile-search', profileSearchRoutes);
app.use('/api/donations', DonationRoute);
app.use('/api/atj', atjRoutes);
app.use('/api/donations/receipt', receiptRouter);
app.use('/api/usersComments', usersCommentsRoutes);
app.use('/api/searchArticle', searchArticleRoutes);
app.use('/api/logger', loggerRoute);
app.use('/api/cancel-standing-order', cancelRoute);
// app.use('/api/uploadFile', uploadFileRoutes); // Uncomment if needed

// PayPal and dynamic donation route
app.use('/api/subscriptions', subscriptionRoutes);
app.post('/api/paypal/webhook', handlePayPalWebhook); 

// Clean up old drafts and versions every 24 hours
setInterval(() => {
  cleanupOldDrafts();
  cleanupOldVersions();
}, 24 * 60 * 60 * 1000);



// הפעלת קרון כל יום ב־00:00
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running subscription auto-cancel check...");
  await checkAndCancelExpiredSubscriptions();
});


// Server and DB initialization
(async () => {
  try {
    console.log('✅ PayPal client and donation routes initialized.');
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);

      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        console.log('🗄️ Initializing database...');
        try {
          databaseService.canInitialize();
          try {
            await databaseService.initializeSampleData();
            console.log('✅ Database initialized successfully');
          } catch {
            console.error('❌ Database sample-data initialization failed');
          }
        } catch {
          console.error('❌ Database not connected');
        }
      } else {
        console.log('📝 Using mock data - Supabase not configured');
      }
    });
  } catch (error: any) {
    console.error('❌ Failed to initialize PayPal client:', error.message);
    console.error('Please check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.');
    process.exit(1);
  }
})();


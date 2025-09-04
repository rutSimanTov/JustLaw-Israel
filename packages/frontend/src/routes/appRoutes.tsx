import AdminTagsPage from '../pages/AdminTags';
import { Routes, Route } from 'react-router-dom';
import App from '../App';
import SignupForm from '../features/auth/RegisterPage';
import LoginForm from '../features/auth/LoginPage';
import ResetPasswordForm from '../features/auth/ResetPasswordPage';
import Logout from '../features/auth/LogoutPage'; // :point_left: הוספה
import Header from '../components/Header'; // ייבוא הכותרת
import JusticeTechMapComponent from '../components/JusticeTechMapComponent'; // ייבוא רכיב המפה
import AboutComponent from '../components/AboutComponent'; // ייבוא רכיב ה"אודות" אם יש צורך
import ATJTreaty from '../pages/ATJTreaty'; // ייבוא רכיב אמנת ATJ אם יש צורך
// import ContributeIdeas from '../pages/Contribute/ContributeIdeas';
// import ContributeTime from "../pages/Contribute/ContributeTime";
import ContributeFunding from "../pages/Contribute/ContributeFunding";
// import ContributeProblems from "../pages/Contribute/ContributeProblems";
// import ContributeConnections from "../pages/Contribute/ContributeConnections";
// import ContributionSection from '../components/ContributionSection';
// import EmailContactForm from "../components/EmailContactForm"; // ייבוא רכיב יצירת קשר בדוא"ל
import DynamicFormPage from "../pages/DynamicFormPage"; // ייבוא רכיב דינמי לתרומות
// import ContributeProblems from "../pages/Contribute/ContributeProblems";
// import ContributeConnections from "../pages/Contribute/ContributeConnections";
// import ContributionSection from '../components/ContributionSection';
// import EmailContactForm from "../components/EmailContactForm"; // ייבוא רכיב יצירת קשר בדוא"ל
import RegisterPage from '../features/auth/RegisterPage'; // ייבוא רכיב רישום משתמשים
import ComingSoon from '../components/ComingSoon'; // ייבוא רכיב ComingSoon אם יש צורך
import Footer from '../components/Footer';
// import RegisterPage from '../features/auth/RegisterPage'; // ייבוא רכיב רישום משתמשים
// import MainForm from '../features/profile/MainForm'; //
import { KnowledgeHubPage } from '../components/KnowledgeHubPage';
import { AddArticlePage } from '../components/AddArticlePage';
import { AddLinkOrDocumentPage } from '../components/AddLinkOrDocumentPage';
import EditArticlePage from '../components/EditArticlePage';
import ArticlePage from '../components/ArticlePage';
import MainFormCeateProfile from '../features/profile/MainFormCeateProfile';
// import MainForm from '../features/profile/MainForm'; //
import MeetingComponent from '../components/Zoom';
import { AddContentTypeSelector } from '../components/AddContentTypeSelector';
import Draft from '../features/content/Draft';
import { Toaster } from '../components/UI/toaster'; // **ודא שהנתיב נכון לאצלך!**
import AddGoogleEventForm from '../features/event/AddGoogleEventForm';
import LoginToCalenderPage from '../features/auth/LoginToCalenderPage';
import ProfileDetails from '../features/profile/ProfileDetails';
import ImageUploader from '../components/ImageUploader/ImageUploader'; // ייבוא רכיב העלאת תמונה


/*
import ContributeFunding from "../pages/Contribute/ContributeFunding";
import ContributionSection from '../components/ContributionSection';
import RegisterPage from '../features/auth/RegisterPage'; // ייבוא רכיב רישום משתמשים
import MainForm from '../features/profile/MainForm'; // ייבוא רכיב הטופס הראשי של הפרופיל
import Footer from '../components/Footer';
import ComingSoon from '../components/ComingSoon'; // ייבוא רכיב ComingSoon אם יש צורך
import DynamicContributeFormPage from '../pages/Contribute/DynamicContributeFormPage';
import ContributeLanding from '../pages/Contribute/ContributeLanding';
*/

import ProfilesPage from '../features/profile/ProfilesPage';

// import DonationPage from '../pages/DonationPage'; // ייבוא רכיב תרומה
import Accelerator from '../components/Accelerator';
import DonationPage from '../pages/DonationPage'; // ייבוא רכיב תרומה
import { MyAccelarator } from '../components/myAccelarator';
import { runLiveTranslation } from '../i18n/liveTranslator';
import CancelStandingOrderPage from '../pages/CancelStandingOrderPage';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// כאן אמור להיות המשתמש מהקונטקסט/סטייט, כרגע דוגמה:
// const user = { role: 'admin' };


// import DonationPage from '../pages/';

// כאן אמור להיות המשתמש מהקונטקסט/סטייט, כרגע דוגמה:
export default function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    const lang = localStorage.getItem('lang') || 'en';
    runLiveTranslation(lang);
  }, [location]);
  return (
    <>
      <Header />
      <div className="pt-36"></div>
      <Routes>
        {/* Admin Tag Management (Admin only) */}
        <Route path="/admin/tags" element={<AdminTagsPage />} />
        <Route path="/justicetech-map" element={<JusticeTechMapComponent />} />
        <Route path="/about" element={<AboutComponent />} />
        {/* <Route path="/contact" element={<LoginPage/>} /> */}
        <Route path="/treaty" element={<ATJTreaty />} />
        <Route path="/" element={<App />} />
        <Route path="/edit-draft" element={<Draft />} />
        <Route path='/accelerator' element={<Accelerator />}></Route>
        <Route path='/zoom' element={<MeetingComponent />}></Route>

        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/logout" element={<Logout />} /> {/* :point_left: הוספה */}
        <Route path="/signUp" element={<RegisterPage />} /> {/* :point_left: הוספה */}
        {/* <Route path="/contribute/ideas" element={<ContributeIdeas />} />
        <Route path="/contribute/time" element={<ContributeTime />} /> */}
        <Route path="/funding" element={<ContributeFunding />} />
        {/* <Route path="/contribute/problems" element={<ContributeProblems />} />
        <Route path="/contribute/connections" element={<ContributeConnections />} /> */}
        {/* <Route path="/contact" element={<EmailContactForm />} /> */}
        <Route path="/:type" element={<DynamicFormPage />} />

        {/* <Route path='/stakeholders-directory' element={<MainFormCeateProfile />} /> */}
        <Route path='/coming-soon' element={<ComingSoon />} />
        { /* <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/logout" element={<Logout />} /> {/* :point_left: הוספה */}

        <Route path="/signUp" element={<RegisterPage />} /> {/* :point_left: הוספה */}
        {/*} <Route path='/stakeholders-directory' element={<MainForm />} />
        <Route path='/coming-soon' element={<ComingSoon />} />
        <Route path="/contribute" element={<ContributeLanding />} />
        <Route path="/contribute/:type" element={<DynamicContributeFormPage />} /> */}
        <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
        <Route path="/add-article" element={<AddArticlePage />} />
        <Route path="/edit-article/:id" element={<EditArticlePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/add-content-type" element={<AddContentTypeSelector />} />
        <Route path="/add-link-or-document" element={<AddLinkOrDocumentPage />} />
        <Route path='/stakeholders-directory' element={<ProfilesPage />} />
        <Route path='/create-profile' element={<MainFormCeateProfile />} />

        <Route path='/update-profile' element={<MainFormCeateProfile />} />
        <Route path="/donation-page" element={<DonationPage />} />
        <Route path='add-event' element={<AddGoogleEventForm />} />
        <Route path='/meetings-calendar' element={<MyAccelarator />} />
        <Route path="/profile/:id" element={<ProfileDetails />} />
        <Route path='/cancel-standing-order' element={<CancelStandingOrderPage />} />
      </Routes>
      <Footer />
      <Toaster /> {/* **הוסף את זה כאן, בתוך הקומפוננטה הראשית שמרונדרת ע"י הראוטר, אבל מחוץ ל-Routes!** */}
    </>
  );
}
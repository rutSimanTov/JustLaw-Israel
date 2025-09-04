import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Step1 from "./Step1-BasicInfo";
import Step2 from "./Step2-TheValueYouBring";
import Step3 from "./Step3-theconnectionYouAreSeeking";
import ReviewAndSubmitStep from "./step4-ReviewAndSubmitStep";
import { useAutoSave } from "../../hooks/useAutoSave";
const LoadingDots: React.FC = () => (
  <div className="flex justify-center items-center gap-3 py-10">
    {[0, 1, 2].map((i) => (
      <span key={i} className="dot" style={{ animationDelay: `${i * 0.3}s` }} />
    ))}
    <style>{`
      .dot {
        width: 12px;
        height: 12px;
        background-color: #6b7280; /* gray-500 for visibility */
        border-radius: 50%;
        transform: scale(1);
        animation: pulseScale 1.2s infinite ease-in-out;
      }
      @keyframes pulseScale {
        0%, 100% {
          transform: scale(0.8);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.8);
          opacity: 1;
        }
      }
    `}</style>
  </div>
);

type FormData = {
  step1: {
    name: string;
    projectLink: string;
    image?: File | string;
    previewUrl?: string; // אם דרוש
  };
  step2: {
    role_description: string;
    countryRegion: string;
    valueSentence: string;
    keywords: string[];
    currentChallenge: string;
  };
  step3: {
    connectionTypes: string[];
    engagementTypes: string[];
    contactInfo: {
      phone: string;
      linkedInUrl: string;
      websiteUrl: string;
      other: string;
    };
    isVisible: boolean;
  };
};

const initialFormData: FormData = {
  step1: { name: "", projectLink: "", image: undefined },
  step2: {
    role_description: "",
    countryRegion: "",
    valueSentence: "",
    keywords: [],
    currentChallenge: "",
  },
  step3: {
    connectionTypes: [],
    engagementTypes: [],
    contactInfo: { phone: "", linkedInUrl: "", websiteUrl: "", other: "" },
    isVisible: false,
  },
};

const mapServerDataToFormData = (data: any): FormData => ({
  step1: {
    name: data.full_name || "",
    projectLink: data.project_link || "",
    image: data.image || undefined,
  },
  step2: {
    role_description: data.role_description || "",
    countryRegion: data.country_region || "",
    valueSentence: data.value_sentence || "",
    keywords: data.keywords || [],
    currentChallenge: data.current_challenge || "",
  },
  step3: {
    connectionTypes: data.connection_types || [],
    engagementTypes: data.engagement_types || [],
    contactInfo: {
      phone: data.contact_info?.phone || "",
      linkedInUrl: data.contact_info?.linkedInUrl || "",
      websiteUrl: data.contact_info?.websiteUrl || "",
      other: data.contact_info?.other || "",
    },
    isVisible: data.is_visible ?? false,
  },
});

const MainFormCreateProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUpdate = location.pathname.includes("update-profile");
  const initialStep = isUpdate ? 4 : 1;

  const [formData, setFormData] = useState<FormData>();
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [editingFromReview, setEditingFromReview] = useState<null | number>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      if (isUpdate) {
        // עדכון: טעינה מהשרת
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("❌ userId לא נמצא");
          setFormData(initialFormData);
          setIsLoading(false);
          return;
        }
        try {
          const res = await fetch(`/api/profile/${userId}`);
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const data = await res.json();
          const mapped = mapServerDataToFormData(data.data);
          setFormData(mapped);
        } catch (err) {
          console.error("⚠️ שגיאה בטעינת הפרופיל:", err);
          setFormData(initialFormData);
        } finally {
          setIsLoading(false);
        }
      } else {
        // הוספה חדשה: טעינה מ-localStorage עבור פרופיל חדש
        const userId = localStorage.getItem("userId") || "anonymous";
        const draftKey = `profile_form_draft_${userId}`;
        
        // בדיקה אם הפרופיל נמחק לאחרונה
        const deletedFlag = localStorage.getItem(`${draftKey}_deleted`);
        if (deletedFlag) {
          console.log("🗑️ הפרופיל נמחק לאחרונה - לא נטען מ-localStorage");
          setFormData(initialFormData);
          // מחיקת ה-flag
          localStorage.removeItem(`${draftKey}_deleted`);
        } else {
          const savedDraft = localStorage.getItem(draftKey);
          if (savedDraft) {
            try {
              console.log("📋 טוען טיוטה מ-localStorage עבור פרופיל חדש");
              setFormData(JSON.parse(savedDraft));
            } catch {
              console.log("⚠️ שגיאה בטעינת טיוטה - משתמש בנתונים ריקים");
              setFormData(initialFormData);
            }
          } else {
            console.log("📋 אין טיוטה - משתמש בנתונים ריקים");
            setFormData(initialFormData);
          }
        }
        setIsLoading(false);
      }
    };

    loadData();
  }, [isUpdate]);

  // שימוש ב-autoSave עם debounce והפעלה רק לאחר טעינת הנתונים
  useAutoSave(formData, {
    key: `profile_form_draft_${localStorage.getItem("userId") || "anonymous"}`,
    interval: 0,
    debounceMs: 5000,
    enabled: !isLoading && !!formData,
    setData: setFormData,
  });

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));
  const goToStep = (s: number) => setCurrentStep(s);
  const handleSkip = () => navigate("/stakeholders-directory");

  const handleDataChange = (data: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [`step${currentStep}`]: data } as FormData;
    });
  };

  if (isLoading || !formData) {
return (
  <div className="flex flex-col items-center justify-center py-10 text-gray-600">
    <LoadingDots />
  </div>
);
}

  const stepLabels = ["Basic Info", "Your Value", "Connection", "Review"];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {stepLabels.map((label, index) => {
        const step = index + 1;
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;

        return (
          <div className="flex items-center" key={step}>
            <div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${
                isActive
                  ? "bg-pink-500 text-white"
                  : isCompleted
                  ? "bg-pink-300 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {index < stepLabels.length - 1 && (
              <div className="w-10 h-0.5 bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            nextStep={nextStep}
            handleDataChange={handleDataChange}
            initialData={formData.step1}
            editingFromReview={editingFromReview}
            setStep={setCurrentStep}
            setEditingFromReview={setEditingFromReview}
          />
        );
      case 2:
        return (
          <Step2
            nextStep={nextStep}
            prevStep={prevStep}
            handleDataChange={handleDataChange}
            initialData={formData.step2}
            editingFromReview={editingFromReview}
            setStep={setCurrentStep}
            setEditingFromReview={setEditingFromReview}
          />
        );
      case 3:
        return (
          <Step3
            nextStep={nextStep}
            prevStep={prevStep}
            handleDataChange={handleDataChange}
            initialData={formData.step3}
          />
        );
      case 4:
        return (
          <ReviewAndSubmitStep
            formData={formData}
            prevStep={prevStep}
            setStep={(s) => {
              setEditingFromReview(4);
              goToStep(s);
            }}
            isUpdate={isUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-32 pb-10">
      {renderStepIndicator()}
      {renderCurrentStep()}
      <button
        onClick={handleSkip}
        className="mt-8 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition-colors duration-200"
      >
        Skip and complete later
      </button>
    </div>
  );
};

export default MainFormCreateProfile;

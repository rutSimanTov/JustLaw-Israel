import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  UserIcon,
  BriefcaseIcon,
  UsersIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import { PencilLine } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormData {
  step1: {
    name: string;
    projectLink: string;
    image?: File | string;
    previewUrl?: string;
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
}

interface Props {
  formData: FormData;
  prevStep: () => void;
  setStep: (stepNumber: number) => void;
  isUpdate: boolean;
}

const ReviewAndSubmitStep: React.FC<Props> = ({ formData, setStep, isUpdate }) => {
  console.log(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ field: string; message: string }[]>([]);

  const { step1, step2, step3 } = formData || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, navigate]);

  const isFormValid = () => {
    return (
      step1?.name.trim().length > 0 &&
      step2?.role_description.trim().length > 0 &&
      step2?.countryRegion.trim().length > 0 &&
      step2?.valueSentence.trim().length > 0 &&
      Array.isArray(step2?.keywords) &&
      step2.keywords.length > 0 &&
      step2?.currentChallenge.trim().length > 0 &&
      Array.isArray(step3?.connectionTypes) &&
      step3.connectionTypes.length > 0 &&
      Array.isArray(step3?.engagementTypes) &&
      step3.engagementTypes.length > 0
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setFieldErrors([]);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setErrorMessage("User ID is missing. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = isUpdate
        ? `http://localhost:3001/api/profile/${userId}`
        : "http://localhost:3001/api/profile";
      const method = isUpdate ? "put" : "post";

      if (formData.step1.image instanceof File) {
        const form = new FormData();
        form.append("user_id", userId);
        form.append("image", formData.step1.image);
        form.append("full_name", formData.step1.name);
        form.append("project_link", formData.step1.projectLink || "");
        form.append("role_description", formData.step2.role_description);
        form.append("country_region", formData.step2.countryRegion);
        form.append("value_sentence", formData.step2.valueSentence);
        form.append("keywords", JSON.stringify(formData.step2.keywords));
        form.append("current_challenge", formData.step2.currentChallenge);
        form.append("connection_types", JSON.stringify(formData.step3.connectionTypes));
        form.append("engagement_types", JSON.stringify(formData.step3.engagementTypes));
        form.append("contact_info", JSON.stringify(formData.step3.contactInfo));
        form.append("is_visible", String(formData.step3.isVisible));

        const response = await axios({
          method,
          url: apiUrl,
          data: form,
          headers: { "Content-Type": "multipart/form-data" },
        });

        setSuccessMessage(response.data.message || "Profile submitted successfully!");
      } else {
        const flattenedData = {
          user_id: userId,
          full_name: formData.step1.name,
          project_link: formData.step1.projectLink || "",
          image: typeof formData.step1.image === "string" ? formData.step1.image : undefined,
          role_description: formData.step2.role_description,
          country_region: formData.step2.countryRegion,
          value_sentence: formData.step2.valueSentence,
          keywords: formData.step2.keywords,
          current_challenge: formData.step2.currentChallenge,
          connection_types: formData.step3.connectionTypes,
          engagement_types: formData.step3.engagementTypes,
          contact_info: formData.step3.contactInfo,
          is_visible: formData.step3.isVisible,
        };

        const response = await axios({
          method,
          url: apiUrl,
          data: flattenedData,
        });

        setSuccessMessage(response.data.message || "Profile submitted successfully!");
      }

      // ניקוי טיוטה וגיבוי מה-localStorage
      const draftKey = `profile_form_draft_${userId}`;
      localStorage.removeItem(draftKey);
      localStorage.removeItem(`${draftKey}_last_saved`);
      localStorage.removeItem(`${draftKey}_backup`);
      localStorage.removeItem(`${draftKey}_deleted`);
      console.log(`🗑️ נוקה localStorage וגיבוי עבור ${draftKey} אחרי שמירה מוצלחת`);

     } catch (err: any) {
    if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
      setErrorMessage("Validation failed");
      setFieldErrors(err.response.data.errors);

    } else if (err.response?.data?.message) {
      setErrorMessage(err.response.data.message);

    } else if (err.response?.data?.error) {
      setErrorMessage(err.response.data.error);

    } else if (err.request) {
      setErrorMessage("Could not connect to the server. Please check your internet connection.");

    } else {
      setErrorMessage("An unexpected error occurred.");
    }
  } finally {
    setIsSubmitting(false);
  }
};


  const imageSrc =
    step1?.image
      ? typeof step1.image === "string"
        ? step1.image
        : URL.createObjectURL(step1.image)
      : null;

  return (
    <div className="space-y-10">
      <h2 className="text-3xl font-oswald text-white text-center font-bold flex items-center justify-center gap-2">
        <SparklesIcon className="h-8 w-8 text-white" />
        Review & Submit
      </h2>

      {/* --- STEP 1 --- */}
      <section className="border-2 border-pink-600 p-6 rounded-md transition-transform transform hover:scale-105 text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-oswald font-bold flex items-center gap-2">
            <UserIcon className="h-6 w-6 text-white" />
            Basic Information
          </h3>
          <button onClick={() => setStep(1)} className="flex items-center text-sm text-white hover:underline gap-1">
            <PencilLine className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex items-center gap-5">
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border border-gray-300"
            />
          )}
          <div className="space-y-1">
            <p><strong>Name:</strong> {step1?.name}</p>
            <p>
              <strong>Project Link:</strong>{" "}
              <a
                href={step1?.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {step1?.projectLink}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* --- STEP 2 --- */}
      <section className="border-2 border-pink-600 p-6 rounded-md transition-transform transform hover:scale-105 text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-oswald font-bold flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-white" />
            The Value You Bring
          </h3>
          <button onClick={() => setStep(2)} className="flex items-center text-sm text-white hover:underline gap-1">
            <PencilLine className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="space-y-1">
          <p><strong>Role Description:</strong> {step2?.role_description}</p>
          <p><strong>Region:</strong> {step2?.countryRegion}</p>
          <p><strong>Value Sentence:</strong> {step2?.valueSentence}</p>
          <p><strong>Keywords:</strong> {step2?.keywords.join(", ")}</p>
          <p><strong>Current Challenge:</strong> {step2?.currentChallenge}</p>
        </div>
      </section>

      {/* --- STEP 3 --- */}
      <section className="border-2 border-pink-600 p-6 rounded-md transition-transform transform hover:scale-105 text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-oswald font-bold flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-white" />
            Connection Preferences
          </h3>
          <button onClick={() => setStep(3)} className="flex items-center text-sm text-white hover:underline gap-1">
            <PencilLine className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="space-y-1">
          <p><strong>Connection Types:</strong> {step3?.connectionTypes.join(", ")}</p>
          <p><strong>Engagement Types:</strong> {step3?.engagementTypes.join(", ")}</p>
          <p><strong>Phone:</strong> {step3?.contactInfo.phone}</p>
          <p><strong>LinkedIn:</strong> {step3?.contactInfo.linkedInUrl}</p>
          <p><strong>Website:</strong> {step3?.contactInfo.websiteUrl}</p>
          <p><strong>Other Contact:</strong> {step3?.contactInfo.other}</p>
          <p><strong>Visibility:</strong> {step3?.isVisible ? "Visible" : "Hidden"}</p>
        </div>
      </section>

      {/* הודעות הצלחה ושגיאה */}
      {successMessage && (
        <div className="text-pink-500 font-semibold">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="text-red-500 font-semibold">{errorMessage}</div>
      )}
      {fieldErrors.length > 0 && (
        <ul className="text-red-500 list-disc ml-5">
          {fieldErrors.map(({ field, message }, idx) => (
            <li key={idx}>
              <strong>{field}:</strong> {message}
            </li>
          ))}
        </ul>
      )}

      {/* כפתור שליחה */}
      <div className="text-center">
        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="px-8 py-3 bg-pink-600 text-white font-semibold rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ReviewAndSubmitStep;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/UI/Button/button";

export const AddContentTypeSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto py-10 text-white text-center pb-40">
      <h1 className="text-3xl font-bold mb-6">Choose Content Type</h1>
      <div className="space-y-4">
        <Button
          variant="default"
          className="w-full"
          onClick={() => navigate("/add-article")}
        >
          Regular Article
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/add-link-or-document")}
        >
          Document / Link
        </Button>
          <Button
          
          variant="ghost"
          className="w-full"
          
          onClick={() => navigate("/edit-draft")}
        >
          Edit Draft
        </Button>
      </div>
    </div>
  );
};

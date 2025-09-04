import React from "react";
import { Button } from "./UI/Button/button";

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
//   onDelete?: () => void; // Optional callback for delete action
}

const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card text-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold text-pink-600 mb-4">Delete Profile</h2>
        <p className="text-sm mb-6">
          Are you sure you want to delete this profile? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-pink-600 hover:bg-pink-700">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfileModal;

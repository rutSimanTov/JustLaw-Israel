import React, { useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "@base-project/shared/src/models/Profile";
import { Box, Button, Typography, Alert, CircularProgress } from "@mui/material";

const DeleteProfileForm: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // טוען את פרטי המשתמש שמחובר כרגע
  useEffect(() => {
    const fetchUser = async () => {
      try {
         const res = await axios.get<Profile>(`/api/profiles/${user?.id}`);
        // const res = await axios.get<UserProfile>("/api/user-profile/550e8400-e29b-41d4-a716-446655440000"); 
        setUser(res.data);
      } catch {
        setError("Error loading user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // מחיקת המשתמש לפי ה-ID
  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
       await axios.delete(`/api/profiles/${user.id}`);
      // ניקוי localStorage אחרי מחיקת פרופיל
      const userId = user.id;
      const draftKey = `profile_form_draft_${userId}`;
      localStorage.removeItem(draftKey);
      localStorage.removeItem(`${draftKey}_last_saved`);
      localStorage.removeItem(`${draftKey}_backup`);
      localStorage.removeItem(`${draftKey}_deleted`);
      // הוספת flag שמציינת שהפרופיל נמחק
      localStorage.setItem(`${draftKey}_deleted`, Date.now().toString());
      console.log(`🗑️ נוקה localStorage אחרי מחיקת פרופיל עבור ${draftKey}`);
      setSuccess("Profile deleted successfully ✅");
      setUser(null); // או לנווט החוצה
      setError("");
    } catch {
      setError("Error deleting profile");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading user data...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No user found</Typography>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    );
  }

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h5" gutterBottom>
        Delete Your Profile
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Typography mb={2}>
        Are you sure you want to delete the profile of <strong>{user.fullName}</strong>?
      </Typography>

      <Button variant="contained" color="error" onClick={handleDelete}>
        Delete Profile
      </Button>
    </Box>
  );
};

export default DeleteProfileForm;

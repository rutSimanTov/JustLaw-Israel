// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Profile,
//   ConnectionType,
//   EngagementType,
//   ContactInfo
// } from "../../../shared/src/models/Profile";
// import {
//   Box,
//   Button,
//   IconButton,
//   TextField,
//   Typography,
//   Alert,
//   CircularProgress,
//   Stack,
//   FormControlLabel,
//   Checkbox,
//   Switch
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// const UpdateProfileForm: React.FC = () => {
//   const [user, setUser] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string>("");
//   const [success, setSuccess] = useState<string>("");

//   // Form fields
//   const [fullName, setFullName] = useState("");
//   const [roleDescription, setRoleDescription] = useState("");
//   const [countryRegion, setCountryRegion] = useState("");
//   const [valueSentence, setValueSentence] = useState("");
//   const [keywords, setKeywords] = useState<string[]>([]);
//   const [currentChallenge, setCurrentChallenge] = useState("");
//   const [connectionTypes, setConnectionTypes] = useState<ConnectionType[]>([]);
//   const [engagementTypes, setEngagementTypes] = useState<EngagementType[]>([]);
//   const [contactInfo, setContactInfo] = useState<ContactInfo>({});
//   const [projectLink, setProjectLink] = useState<string>("");
//   const [otherConnectionText, setOtherConnectionText] = useState<string>("");
//   const [isVisible, setIsVisible] = useState<boolean>(true);

//   // Handle keyword input change
//   const handleChange = (idx: number, value: string) => {
//     const newKeywords = [...keywords];
//     newKeywords[idx] = value;
//     setKeywords(newKeywords);
//   };

//   // Add new keyword input
//   const handleAdd = () => {
//     if (keywords.length < 3) setKeywords([...keywords, ""]);
//   };

//   // Enum values for checkboxes
//   const allConnectionTypes = Object.values(ConnectionType);
//   const allEngagementTypes = Object.values(EngagementType);

//   // Toggle check for ConnectionType
//   const toggleConnectionType = (type: ConnectionType) => {
//     setConnectionTypes(prev =>
//       prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
//     );
//   };

//   // Toggle check for EngagementType
//   const toggleEngagementType = (type: EngagementType) => {
//     setEngagementTypes(prev =>
//       prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
//     );
//   };

//   // Load user data from server
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
  
//          const res = await axios.get<Profile>(`/api/profiles/${user?.id}`);
//         // const res = await axios.get<UserProfile>(`/api/profiles/550e8400-e29b-41d4-a716-446655440000`);

//         const data = res.data;
//         setUser(data);
//         setFullName(data.fullName);
//         setRoleDescription(data.roleDescription);
//         setCountryRegion(data.countryRegion);
//         setValueSentence(data.valueSentence);
//         setKeywords(data.keywords);
//         setCurrentChallenge(data.currentChallenge);
//         setConnectionTypes(data.connectionTypes);
//         setEngagementTypes(data.engagementTypes);
//         setContactInfo(data.contactInfo || {});
//         setProjectLink(data.projectLink || "");
//         setOtherConnectionText(data.otherConnectionText || "");
//         setIsVisible(data.isVisible);
//       } catch (err) {
//         setError("Error loading data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Submit updated form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return;

//     try {
//       const updatedUser: Profile = {
//         ...user,
//         fullName,
//         roleDescription,
//         countryRegion,
//         valueSentence,
//         keywords,
//         currentChallenge,
//         connectionTypes,
//         engagementTypes,
//         contactInfo,
//         projectLink,
//         otherConnectionText,
//         isVisible,
//         updatedAt: new Date()
//       };

// const res = await axios.put(`/api/api/profiles/${updatedUser.id}`, updatedUser);
//       setUser(res.data);
//       setSuccess("Details saved successfully ✅");
//       setError("");
//     } catch (err) {
//       setError("Error saving data");
//       setSuccess("");
//     }
//   };

//   if (loading) {
//     return (
//       <Box textAlign="center" mt={4}>
//         <CircularProgress />
//         <Typography mt={2}>Loading data...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
//       <Typography variant="h5" gutterBottom>
//         Profile Update
//       </Typography>

//       <Stack spacing={2}>
//         {error && <Alert severity="error">{error}</Alert>}
//         {success && <Alert severity="success">{success}</Alert>}

//         <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
//         <TextField label="Job Title" value={roleDescription} onChange={(e) => setRoleDescription(e.target.value)} fullWidth />
//         <TextField label="Country" value={countryRegion} onChange={(e) => setCountryRegion(e.target.value)} fullWidth />
//         <TextField label="Value Sentence" value={valueSentence} onChange={(e) => setValueSentence(e.target.value)} fullWidth />
          
//      <Box>
//   <Stack spacing={2} direction="row" alignItems="center">
//     <Typography>Keywords:</Typography>

//     <IconButton
//       color="primary"
//       onClick={handleAdd}
//       disabled={keywords.length >= 3}
//       aria-label="Add keyword"
//     >
//       <AddIcon />
//     </IconButton>

//     <IconButton
//       color="secondary"
//       onClick={() => setKeywords(prev => prev.slice(0, prev.length - 1))}
//       disabled={keywords.length === 0}
//       aria-label="Remove keyword"
//     >
//       <Typography variant="h4" sx={{ lineHeight: 1, userSelect: "none" }}>
//         -
//       </Typography>
//     </IconButton>
//   </Stack>

//   <Stack spacing={2} mt={1}>
//     {keywords.map((word, idx) => (
//       <TextField
//         key={idx}
//         value={word}
//         onChange={e => handleChange(idx, e.target.value)}
//         label={`Keyword ${idx + 1}`}
//         variant="outlined"
//         fullWidth
//       />
//     ))}
//   </Stack>
// </Box>


//         <TextField label="Current Challenge" value={currentChallenge} onChange={(e) => setCurrentChallenge(e.target.value)} fullWidth />

// <Box>
//   <Typography variant="h6" gutterBottom>
//     Connection Types
//   </Typography>
//   <Box
//     sx={{
//       display: "grid",
//       gridTemplateColumns: "repeat(2, 1fr)", // 2 items per row, לשנות ל-3 ל-3 בעמודות
//       gap: 1,
//     }}
//   >
//     {allConnectionTypes.map((type) => (
//       <FormControlLabel
//         key={type}
//         control={
//           <Checkbox
//             checked={connectionTypes.includes(type)}
//             onChange={() => toggleConnectionType(type)}
//           />
//         }
//         label={type}
//         sx={{ justifyContent: "flex-start" }} // יישור שמאלי לתיבה + טקסט
//       />
//     ))}
//   </Box>
// </Box>


// <Box mt={3}>
//   <Typography variant="h6" gutterBottom>
//     Engagement Types
//   </Typography>
//   <Box
//     sx={{
//       display: "grid",
//       gridTemplateColumns: "repeat(2, 1fr)", // גם כאן 2 פריטים לשורה
//       gap: 1,
//     }}
//   >
//     {allEngagementTypes.map((type) => (
//       <FormControlLabel
//         key={type}
//         control={
//           <Checkbox
//             checked={engagementTypes.includes(type)}
//             onChange={() => toggleEngagementType(type)}
//           />
//         }
//         label={type}
//         sx={{ justifyContent: "flex-start" }}
//       />
//     ))}
//   </Box>
// </Box>


//         <Typography variant="h6">Contact Info</Typography>
//         <TextField label="Email" value={contactInfo?.email || ""} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} fullWidth />
//         <TextField label="Phone" value={contactInfo?.phone || ""} onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })} fullWidth />
//         <TextField label="LinkedIn URL" value={contactInfo?.linkedInUrl || ""} onChange={e => setContactInfo({ ...contactInfo, linkedInUrl: e.target.value })} fullWidth />
//         <TextField label="Website URL" value={contactInfo?.websiteUrl || ""} onChange={e => setContactInfo({ ...contactInfo, websiteUrl: e.target.value })} fullWidth />

//         <TextField label="Project Link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} fullWidth />
//         <TextField label="Other Connection Text" value={otherConnectionText} onChange={(e) => setOtherConnectionText(e.target.value)} fullWidth />

//         <FormControlLabel
//           control={<Switch checked={isVisible} onChange={() => setIsVisible(!isVisible)} />}
//           label="Profile Visible"
//         />

//         <Button type="submit" variant="contained" color="primary">
//           Save Changes
//         </Button>
//       </Stack>
//     </Box>
//   );
// };

// export default UpdateProfileForm;
export{}
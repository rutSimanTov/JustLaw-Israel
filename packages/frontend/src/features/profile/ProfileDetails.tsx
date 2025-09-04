
// // עם עיצוב של חלונית קופצת
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { Button } from "../../components/UI/Button/button"; // Ensure this path is correct for your Button component
// import { X,User } from "lucide-react"; // Import the X icon for the close button

// // Updated Profile type to include all relevant fields from your database schema
// export type Profile = {
//     id: string;
//     user_id?: string;
//     full_name: string;
//     role_description?: string;
//     country_region: string;
//     value_sentence: string;
//     keywords: string[];
//     profile_image_url?: string;
//     created_at?: string;
//     updated_at?: string;
//     image?: string; // Assuming profile_image_url maps to this
//     current_challenge?: string;
//     connection_types?: string[];
//     engagement_types?: string[];
//     contact_info?: {
//         phone?: string;
//         linkedin?: string;
//         website?: string;
//         other?: string;
//     };
//     project_link?: string;
//     other_connection_text?: string;
//     is_visible?: boolean;
//     contact_phone_visible?: boolean;
//     contact_linkedin_visible?: boolean;
//     contact_website_visible?: boolean;
//     contact_other_visible?: boolean;
//     profile_search_vector?: any;
//     search_vector?: any;
// };

// const ProfileDetails: React.FC = () => {
//     const { id } = useParams<{ id: string }>(); // Get profile ID from URL
//     const navigate = useNavigate();
//     const location = useLocation(); // Get the location object to access navigation state

//     // Initialize profile state from location.state, or null if not available
//     const [profile, setProfile] = useState<Profile | null>(location.state?.profile || null);
//     // Initialize loading to false if profile data is already available from state
//     const [loading, setLoading] = useState(false); 
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         // If the profile is already available in the navigation state, no need to fetch again.
//         // Otherwise, fetch from the server as a fallback (e.g., if user directly accessed the URL).
//         if (!profile && id) { 
//             setLoading(true); // Set loading to true only if a fetch is needed
//             setError(null);
//             const fetchProfileDetails = async () => {
//                 try {
//                     // Assumed API endpoint to fetch a single profile by ID.
//                     // You might need to adjust this path based on your backend.
//                     const res = await fetch(`/api/profile-search/profile/${id}`);
                    
//                     if (!res.ok) {
//                         throw new Error(`Failed to fetch profile: ${res.statusText}`);
//                     }
//                     const json = await res.json();
//                     setProfile(json.data.profile); // Adjust this based on your API response structure
//                             console.log(profile)


//                 } catch (err) {
//                     console.error("Error fetching profile details:", err);
//                     setError("Failed to load profile details. Please try again.");
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//             fetchProfileDetails();
            
//         }
//     }, [id, profile, location.state]); // Dependencies: re-run effect if id, profile, or location.state changes

//     // Function to close the modal by navigating back
//     const handleCloseModal = () => {
//         navigate(-1); // Navigates back to the previous page (ProfilesPage)
//     };

//     if (loading) {
//         return (
//             // Full screen overlay for loading state
//             <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                 <div className="bg-background rounded-xl p-8 shadow-lg text-white text-xl">
//                     Loading profile details...
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             // Full screen overlay for error state
//             <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                 <div className="bg-background rounded-xl p-8 shadow-lg text-red-400 text-xl flex flex-col items-center">
//                     <p>{error}</p>
//                     <Button onClick={handleCloseModal} className="mt-4">
//                         Go Back
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     if (!profile) {
//         return (
//             // Full screen overlay for not found state
//             <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                 <div className="bg-background rounded-xl p-8 shadow-lg text-white text-xl flex flex-col items-center">
//                     <p>Profile not found.</p>
//                     <Button onClick={() => navigate("/profiles")} className="mt-4">
//                         Back to Profiles
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     return (
        
//         // Main modal overlay - fixed position, covers screen, semi-transparent background
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//             {/* Modal content container - the "window" */}
//             <div className="relative w-full max-w-2xl bg-background rounded-xl p-8 shadow-lg text-white max-h-[90vh] overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar class */}
//                 {/* Close button (X icon) */}
//                 <button
//                     onClick={handleCloseModal}
//                     className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
//                     aria-label="Close"
//                 >
//                     <X size={24} />
//                 </button>

//                 <h1 className="text-4xl font-oswald font-bold text-primary mb-6 text-center break-words pr-10 pl-10"> {/* Added padding for X button */}
//                     {profile.full_name}'s Profile
//                 </h1>

//                 {/* Profile image section */}
//                 <div className="flex justify-center mb-8">
//                     <div className="w-64 h-64 bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden  shadow-lg">
//                         {(profile.profile_image_url || profile.image) ? (
//                             <img
//                                 src={profile.profile_image_url || profile.image}
//                                 alt={profile.full_name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                     e.currentTarget.src = "https://placehold.co/256x256/334155/E2E8F0?text=No+Image"; 
//                                 }}
//                             />
//                         ) : (
//             <User color="black" size={64} />

//                         )}
//                     </div>
//                 </div>

//                 {/* All fields in a single column */}
//                 <div className="flex flex-col gap-4 mb-6"> 
//                     {/* Full Name */}
//                     <p className="text-lg">
//                         <span className="font-semibold text-white">Full Name:</span>{" "}
//                         <span className="text-gray-100">{profile.full_name}</span>
//                     </p>

//                     {/* Location */}
//                     <p className="text-lg">
//                         <span className="font-semibold text-white">Location:</span>{" "}
//                         <span className="text-gray-100">{profile.country_region}</span>
//                     </p>

//                     {/* Value Sentence */}
//                     <p className="text-lg">
//                         <span className="font-semibold text-white">Value Sentence:</span>{" "}
//                         <span className="text-gray-100 break-words whitespace-pre-wrap">{profile.value_sentence}</span>
//                     </p>

//                     {/* Current Challenge */}
//                     {profile.current_challenge && (
//                         <p className="text-lg">
//                             <span className="font-semibold text-white">Current Challenge:</span>{" "}
//                             <span className="text-gray-100 break-words whitespace-pre-wrap">{profile.current_challenge}</span>
//                         </p>
//                     )}

//                     {/* Project Link */}
//                     {profile.project_link && (
//                         <p className="text-lg">
//                             <span className="font-semibold text-white">Project Link:</span>{" "}
//                             <a href={profile.project_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
//                                 {profile.project_link}
//                             </a>
//                         </p>
//                     )}

//                     {/* Contact Info (Conditional Display based on visibility flags) */}
//                     {profile.contact_info && (
//                         <div className="mb-3">
//                             <p className="text-lg mb-2">
//                                 <span className="font-semibold text-white">Contact Information:</span>
//                             </p>
//                             <div className="pl-4">
//                                 {/* profile.contact_phone_visible && */}
//                                 { profile.contact_info.phone && (
//                                     <p className="text-base text-gray-100 mb-1">
//                                         <span className="font-medium text-gray-300">Phone:</span> {profile.contact_info.phone}
//                                     </p>
//                                 )}
                                
//                                 {/* profile.contact_linkedin_visible && */}
//                                 { profile.contact_info.linkedin && (
//                                     <p className="text-base text-gray-100 mb-1">
//                                         <span className="font-medium text-gray-300">LinkedIn:</span>{" "}
//                                         <a href={profile.contact_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
//                                             {profile.contact_info.linkedin}
//                                         </a>
//                                     </p>
//                                 )}
//                                 {/* profile.contact_website_visible &&  */}
//                                 {profile.contact_info.website && (
//                                     <p className="text-base text-gray-100 mb-1">
//                                         <span className="font-medium text-gray-300">Website:</span>{" "}
//                                         <a href={profile.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
//                                             {profile.contact_info.website}
//                                         </a>
//                                     </p>
//                                 )}
//                                 {/* profile.contact_other_visible &&  */}
//                                 {profile.contact_info.other && (
//                                     <p className="text-base text-gray-100 mb-1">
//                                         <span className="font-medium text-gray-300">Other Contact:</span> {profile.contact_info.other}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Keywords (styled correctly) */}
//                 {profile.keywords && profile.keywords.length > 0 && (
//                     <div className="mb-6">
//                         <p className="text-lg mb-2">
//                             {/* <span className="font-semibold text-white">Keywords:</span>{" "} */}
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                             {profile.keywords.map((keyword) => (
//                                 <span
//                                     key={keyword}
//                                     className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium"
//                                 >
//                                     {keyword}
//                                 </span>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex justify-center mt-8">
//                     <Button onClick={handleCloseModal} className="px-6 py-3 text-lg">
//                         Back to Profiles
//                     </Button>
//                 </div>
//             </div>
//             {/* Custom CSS for transparent scrollbar */}
//             <style>{`
//                 /* For Webkit browsers (Chrome, Safari) */
//                 .custom-scrollbar::-webkit-scrollbar {
//                     width: 0px; /* Hide scrollbar width */
//                     background: transparent; /* Make scrollbar background transparent */
//                 }

//                 .custom-scrollbar::-webkit-scrollbar-thumb {
//                     background: transparent; /* Make scrollbar thumb transparent */
//                 }

//                 /* For Firefox */
//                 .custom-scrollbar {
//                     scrollbar-width: none; /* Hide scrollbar */
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default ProfileDetails;





// עם עיצוב של חלונית קופצת
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/UI/Button/button"; // Ensure this path is correct for your Button component
import { X,User } from "lucide-react"; // Import the X icon for the close button

// Updated Profile type to include all relevant fields from your database schema
export type Profile = {
    id: string;
    user_id?: string;
    full_name: string;
    role_description?: string;
    country_region: string;
    value_sentence: string;
    keywords: string[];
    profile_image_url?: string;
    created_at?: string;
    updated_at?: string;
    image?: string; // Assuming profile_image_url maps to this
    current_challenge?: string;
    connection_types?: string[];
    engagement_types?: string[];
    contact_info?: {
        phone?: string;
        linkedin?: string;
        website?: string;
        other?: string;
    };
    project_link?: string;
    other_connection_text?: string;
    is_visible?: boolean;
    contact_phone_visible?: boolean;
    contact_linkedin_visible?: boolean;
    contact_website_visible?: boolean;
    contact_other_visible?: boolean;
    profile_search_vector?: any;
    search_vector?: any;
};

const ProfileDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get profile ID from URL
    const navigate = useNavigate();
    const location = useLocation(); // Get the location object to access navigation state

    // Initialize profile state from location.state, or null if not available
    const [profile, setProfile] = useState<Profile | null>(location.state?.profile || null);
    // Initialize loading to false if profile data is already available from state
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If the profile is already available in the navigation state, no need to fetch again.
        // Otherwise, fetch from the server as a fallback (e.g., if user directly accessed the URL).
        if (!profile && id) { 
            setLoading(true); // Set loading to true only if a fetch is needed
            setError(null);
            const fetchProfileDetails = async () => {
                try {
                    // Assumed API endpoint to fetch a single profile by ID.
                    // You might need to adjust this path based on your backend.
                    const res = await fetch(`/api/profile-search/profile/${id}`);
                    
                    if (!res.ok) {
                        throw new Error(`Failed to fetch profile: ${res.statusText}`);
                    }
                    const json = await res.json();
                    setProfile(json.data.profile); // Adjust this based on your API response structure
                    // console.log(profile) // This console.log would show the previous state of profile, not the newly set one.
                                        // If you want to log the new state, do it after this useEffect or in another useEffect that depends on 'profile'

                } catch (err) {
                    console.error("Error fetching profile details:", err);
                    setError("Failed to load profile details. Please try again.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProfileDetails();
            
        }
    }, [id, profile, location.state]); // Dependencies: re-run effect if id, profile, or location.state changes

    // Function to close the modal by navigating back
    const handleCloseModal = () => {
        navigate(-1); // Navigates back to the previous page (ProfilesPage)
    };

    if (loading) {
        return (
            // Full screen overlay for loading state
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-background rounded-xl p-8 shadow-lg text-white text-xl">
                    Loading profile details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            // Full screen overlay for error state
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-background rounded-xl p-8 shadow-lg text-red-400 text-xl flex flex-col items-center">
                    <p>{error}</p>
                    <Button onClick={handleCloseModal} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            // Full screen overlay for not found state
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                <div className="bg-background rounded-xl p-8 shadow-lg text-white text-xl flex flex-col items-center">
                    <p>Profile not found.</p>
                    <Button onClick={() => navigate("/profiles")} className="mt-4">
                        Back to Profiles
                    </Button>
                </div>
            </div>
        );
    }

    return (
        
        // Main modal overlay - fixed position, covers screen, semi-transparent background
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            {/* Modal content container - the "window" */}
            <div className="relative w-full max-w-2xl bg-background rounded-xl p-8 shadow-lg text-white max-h-[90vh] overflow-y-auto custom-scrollbar"> {/* Added custom-scrollbar class */}
                {/* Close button (X icon) */}
                <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                    aria-label="Close"
                >
                    <X size={24} />
                </button>

                <h1 className="text-4xl font-oswald font-bold text-primary mb-6 text-center break-words pr-10 pl-10"> {/* Added padding for X button */}
                    {profile.full_name}'s Profile
                </h1>

                {/* Profile image section */}
                <div className="flex justify-center mb-8">
                    <div className="w-64 h-64 bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden  shadow-lg">
                        {(profile.profile_image_url || profile.image) ? (
                            <img
                                src={profile.profile_image_url || profile.image}
                                alt={profile.full_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/256x256/334155/E2E8F0?text=No+Image"; 
                                }}
                            />
                        ) : (
                            <User color="black" size={64} />

                        )}
                    </div>
                </div>

                {/* All fields in a single column */}
                <div className="flex flex-col gap-4 mb-6"> 
                    {/* Full Name */}
                    <p className="text-lg">
                        <span className="font-semibold text-white">Full Name:</span>{" "}
                        <span className="text-gray-100">{profile.full_name}</span>
                    </p>

                    {/* Location */}
                    <p className="text-lg">
                        <span className="font-semibold text-white">Location:</span>{" "}
                        <span className="text-gray-100">{profile.country_region}</span>
                    </p>

                    {/* Value Sentence */}
                    <p className="text-lg">
                        <span className="font-semibold text-white">Value Sentence:</span>{" "}
                        <span className="text-gray-100 break-words whitespace-pre-wrap">{profile.value_sentence}</span>
                    </p>

                    {/* Current Challenge */}
                    {profile.current_challenge && (
                        <p className="text-lg">
                            <span className="font-semibold text-white">Current Challenge:</span>{" "}
                            <span className="text-gray-100 break-words whitespace-pre-wrap">{profile.current_challenge}</span>
                        </p>
                    )}

                    {/* Project Link */}
                    {profile.project_link && (
                        <p className="text-lg">
                            <span className="font-semibold text-white">Project Link:</span>{" "}
                            <a href={profile.project_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                                {profile.project_link}
                            </a>
                        </p>
                    )}

                    {/* Contact Info: Show section only if contact_info exists AND at least one contact field has a value */}
                    {profile.contact_info && (profile.contact_info.phone || profile.contact_info.linkedin || profile.contact_info.website || profile.contact_info.other) && (
                        <div className="mb-3">
                            <p className="text-lg mb-2">
                                <span className="font-semibold text-white">Contact Information:</span>
                            </p>
                            <div className="pl-4">
                                {profile.contact_info.phone && (
                                    <p className="text-base text-gray-100 mb-1">
                                        <span className="font-medium text-gray-300">Phone:</span> {profile.contact_info.phone}
                                    </p>
                                )}
                                
                                {profile.contact_info.linkedin && (
                                    <p className="text-base text-gray-100 mb-1">
                                        <span className="font-medium text-gray-300">LinkedIn:</span>{" "}
                                        <a href={profile.contact_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                                            {profile.contact_info.linkedin}
                                        </a>
                                    </p>
                                )}
                                
                                {profile.contact_info.website && (
                                    <p className="text-base text-gray-100 mb-1">
                                        <span className="font-medium text-gray-300">Website:</span>{" "}
                                        <a href={profile.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                                            {profile.contact_info.website}
                                        </a>
                                    </p>
                                )}
                                
                                {profile.contact_info.other && (
                                    <p className="text-base text-gray-100 mb-1">
                                        <span className="font-medium text-gray-300">Other Contact:</span> {profile.contact_info.other}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Keywords (styled correctly) */}
                {profile.keywords && profile.keywords.length > 0 && (
                    <div className="mb-6">
                        <p className="text-lg mb-2">
                            {/* <span className="font-semibold text-white">Keywords:</span>{" "} */}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {profile.keywords.map((keyword) => (
                                <span
                                    key={keyword}
                                    className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-8">
                    <Button onClick={handleCloseModal} className="px-6 py-3 text-lg">
                        Back to Profiles
                    </Button>
                </div>
            </div>
            {/* Custom CSS for transparent scrollbar */}
            <style>{`
                /* For Webkit browsers (Chrome, Safari) */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px; /* Hide scrollbar width */
                    background: transparent; /* Make scrollbar background transparent */
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: transparent; /* Make scrollbar thumb transparent */
                }

                /* For Firefox */
                .custom-scrollbar {
                    scrollbar-width: none; /* Hide scrollbar */
                }
            `}</style>
        </div>
    );
};

export default ProfileDetails;
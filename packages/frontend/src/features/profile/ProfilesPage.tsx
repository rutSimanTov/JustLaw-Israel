

import React, { useEffect, useRef, useState, useCallback } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI/Button/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/UI/tooltip";
import DeleteProfileModal from "../../components/DeleteProfileModal";
import { User } from "lucide-react";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  role_description: string;
  country_region: string;
  value_sentence: string;
  image?: string;
  keywords: string[];
  profile_image_url?: string;
  created_at?: string;
};

const LoadingDots: React.FC = () => (
  <div className="flex justify-center items-center gap-3 py-10">
    {[0, 1, 2].map((i) => (
      <span key={i} className="dot" style={{ animationDelay: `${i * 0.3}s` }} />
    ))}
    <style>{`
      .dot {
        width: 12px;
        height: 12px;
        background-color: white;
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

const ProfilesPage: React.FC = () => {
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [connectionTypes, setConnectionTypes] = useState<string[]>([]);
  const [engagementTypes, setEngagementTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("");
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);

  // const pageSize = 6;

  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  console.log("Current User ID:", currentUserId);
  
  // שרהלה
  // State למודל של הודעת פרופיל קיים
  const [showExistingProfileModal, setShowExistingProfileModal] = useState(false);
  
  // שרהלה
  // פונקציה שתבדוק אם יש פרופיל קיים למשתמש הנוכחי
  const checkExistingProfile = () => {
    if (!currentUserId) return false;
    
    // בודק אם יש פרופיל של המשתמש הנוכחי ברשימה
    const existingProfile = profiles.find(profile => profile.user_id === currentUserId);
    
    if (existingProfile) {
      setShowExistingProfileModal(true);
      return true;
    }
    
    return false;
  };
  
  // שרהלה
  // פונקציה לטיפול בלחיצה על Add Profile
  const handleAddProfile = () => {
    if (!checkExistingProfile()) {
      navigate("/create-profile");
    }
  };
 
  //פונקציה שקשורה לעמודים -פגימנציה
  // const observer = useRef<IntersectionObserver | null>(null);
  // const lastProfileRef = useCallback(
  //   (node: HTMLDivElement | null) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         setPage((prev) => prev + 1);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [loading, hasMore]
  // );

  const fetchProfiles = useCallback(async (pageToLoad: number) => {
    setLoading(true);
    try {
      
      const params = new URLSearchParams();

      const nameQuery = query.trim();
      const roleQuery = connectionTypes.join(",");
      const countryQuery = country.trim();
      const keywordArray = engagementTypes.map((s) => s.trim()).filter(Boolean);

      params.set("q", nameQuery); // full_name
      params.set("role_description", roleQuery);
      params.set("country", countryQuery);
      params.set("keywords", keywordArray.join(","));

      params.set("sort_by", sortBy);

      // params.set("page", pageToLoad.toString());
      // params.set("pageSize", pageSize.toString());


      const res = await fetch(`/api/profile-search/search?${params.toString()}`);
      const json = await res.json();


      //א שאין בזה צורך
      if (pageToLoad === 1) {
        setProfiles(json.data.profiles);
      } else {
        setProfiles((prev) => [...prev, ...json.data.profiles]);
      }


       //קשור לעמודים
      // if (json.data.profiles.length < pageSize) {
      //   setHasMore(false);
      // }




      let sortedProfiles = [...json.data.profiles];

      if (sortBy === 'name') {
        sortedProfiles.sort((a, b) => {
          const nameA = a.full_name.toLowerCase();
          const nameB = b.full_name.toLowerCase();
          return nameA.localeCompare(nameB);
        });
      } else if (sortBy === 'country') {
        sortedProfiles.sort((a, b) => {
          const countryA = a.country_region.toLowerCase();
          const countryB = b.country_region.toLowerCase();
          return countryA.localeCompare(countryB);
        });
      } else if (sortBy === 'role') {
        sortedProfiles.sort((a, b) => {
          const roleA = a.role_description.toLowerCase();
          const roleB = b.role_description.toLowerCase();
          return roleA.localeCompare(roleB);
        });
      }



      if (pageToLoad === 1) {
        setProfiles(sortedProfiles);
      } else {
        setProfiles((prev) => {
          // const existingIds = new Set(prev.map((p) => p.user_id));
          // const newProfiles = sortedProfiles.filter((p) => !existingIds.has(p.user_id));
          const existingIds = new Set(prev.map((p: Profile) => p.user_id));
          const newProfiles = json.data.profiles.filter((p: Profile) => !existingIds.has(p.user_id));

          return [...prev, ...newProfiles];
        });
      }



    




    } catch (error) {
      console.error("Error fetching profiles:", error);
      if (pageToLoad === 1) setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [query, country, connectionTypes, engagementTypes, sortBy,]); //pageSize]);




  useEffect(() => {
  fetchProfiles(1);
  window.scrollTo(0, 0);
}, []);




  const handleDelete = async () => {
    if (!selectedProfileId) return;

    try {
      const res = await fetch(`/api/profile/${selectedProfileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
       // ניקוי localStorage אחרי מחיקת פרופיל
      const userId = selectedProfileId;
      const draftKey = `profile_form_draft_${userId}`;
      localStorage.removeItem(draftKey);
      localStorage.removeItem(`${draftKey}_last_saved`);
      localStorage.removeItem(`${draftKey}_backup`);
      localStorage.removeItem(`${draftKey}_deleted`);
      // הוספת flag שמציינת שהפרופיל נמחק
      localStorage.setItem(`${draftKey}_deleted`, Date.now().toString());
      console.log(`🗑️ נוקה localStorage אחרי מחיקת פרופיל עבור ${draftKey}`);
      
        setProfiles((prev) =>
          prev.filter((profile) => profile.user_id !== selectedProfileId)
        );
        setIsModalOpen(false);
        setSelectedProfileId(null);

        // הודעה על מחיקה מוצלחת
        setDeleteMessage("Profile deleted successfully");
        setTimeout(() => setDeleteMessage(null), 3000);
      } else {
        console.error("Failed to delete profile.");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };


  // const handleSearch = () => {
  //   setPage(1);
  //   setHasMore(true);
  //   fetchProfiles(1);
  // };

  

  const handleSearch = () => {
  setProfiles([]);     // תאפסי את הרשימה
  fetchProfiles(1);    // תבצעי קריאה לטעינת כל הפרופילים מחדש בעמוד הראשון (או בלי עמודים)
};




  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);

    // Immediately sort existing profiles without fetching from server
    if (profiles.length > 0) {
      const sortedProfiles = [...profiles];

      switch (newSortBy) {
        case 'name':
          // מיון לפי שם מלא עם תמיכה בעברית ואנגלית
          sortedProfiles.sort((a, b) => {
            const nameA = (a.full_name || '').trim().toLowerCase();
            const nameB = (b.full_name || '').trim().toLowerCase();
            return nameA.localeCompare(nameB, 'he', { sensitivity: 'base' });
          });
          break;

        case 'country':
          // מיון לפי מדינה עם מיון מקונן (מדינה ואז עיר)
          sortedProfiles.sort((a, b) => {
            const countryA = (a.country_region || '').trim().toLowerCase();
            const countryB = (b.country_region || '').trim().toLowerCase();

            // קודם מיון לפי מדינה
            const countryComparison = countryA.localeCompare(countryB, 'he', { sensitivity: 'base' });

            // אם אותה מדינה - מיון לפי עיר
            if (countryComparison === 0) {
              const cityA = countryA.split(/[,-]/)[0].trim();
              const cityB = countryB.split(/[,-]/)[0].trim();
              return cityA.localeCompare(cityB, 'he', { sensitivity: 'base' });
            }

            return countryComparison;
          });
          break;

        case 'role':
          // מיון לפי תיאור תפקיד עם תמיכה בעברית ואנגלית
          sortedProfiles.sort((a, b) => {
            const roleA = (a.role_description || '').trim().toLowerCase();
            const roleB = (b.role_description || '').trim().toLowerCase();
            return roleA.localeCompare(roleB, 'he', { sensitivity: 'base' });
          });
          break;

        case 'recent':
          // מיון לפי תאריך יצירה (החדש ביותר קודם)
          sortedProfiles.sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA; // יורד (החדש ביותר קודם)
          });
          break;

        default:
          // ללא מיון - השארת הסדר המקורי
          break;
      }

      // עדכון הפרופילים הממוינים
      setProfiles(sortedProfiles);
    }
  };


// debounce חיפוש אוטומטי אחרי 500ms של דומייה
useEffect(() => {
  const handler = setTimeout(() => {
    handleSearch();
  }, 500);

  return () => {
    clearTimeout(handler);
  };
}, [query, country, connectionTypes, engagementTypes, sortBy]);




  return (
    <div className="flex flex-col items-center px-4 bg-card/80 mb-20">
      <h1 className="text-5xl font-oswald font-bold text-white text-center my-8">Profiles Directory</h1>

      {/* Search Filters */}
      <div className="w-full max-w-7xl flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder=" Name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded-md px-4 py-2 border border-primary bg-background text-white"
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded-md px-4 py-2 border border-primary bg-background text-white"
        />

        <input
          type="text"
          placeholder="Role"
          value={connectionTypes.join(",")}
          onChange={(e) =>
            setConnectionTypes(
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}  // הוספת האירוע כאן!
          className="flex-1 rounded-md px-4 py-2 border border-primary bg-background text-white"
        />
        <input
          type="text"
          placeholder="Keyword"
          value={engagementTypes.join(",")}
          onChange={(e) =>
            setEngagementTypes(
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}  // הוספת האירוע כאן!
          className="flex-1 rounded-md px-4 py-2 border border-primary bg-background text-white"
        />



        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="flex-1 rounded-md px-4 py-2 border border-primary bg-background text-white"
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="country">Country</option>
          <option value="role">Role</option>
          <option value="recent">Recent</option>
        </select>
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={handleAddProfile}>Add Profile</Button>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-7xl">
        {profiles.map((p, i) => (

          <div
            key={`${p.id}-${i}`}
            // ref={i === profiles.length - 1 ? lastProfileRef : null}
           ref={null}
            className="border border-primary/20 rounded-xl p-6 shadow-md hover:shadow-lg bg-card text-white flex flex-col sm:col-span-2 lg:col-span-2 h-80"
          >
            <div className="w-20 aspect-square bg-muted/20 border border-dashed border-white/20 rounded-lg mb-3 flex items-center justify-center self-start overflow-hidden">
              {(p.profile_image_url || p.image) ? (
                <img
                  src={p.profile_image_url || p.image}
                  alt={p.full_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/80x80/334155/E2E8F0?text=No+Image";
                  }}
                />
              ) : (
                <User color="white" size={32} />
              )}
            </div>

            <h2 className="text-xl font-semibold mb-3 text-primary">{p.full_name}</h2>

            <p className="text-base mb-2">{p.role_description}</p>

            <p className="text-sm text-gray-300 mb-3">
              <span className="text-white font-semibold"></span> {p.country_region}
            </p>

            <div className="flex flex-wrap gap-1 mb-3 ">
              {p.keywords.map((k) => (
                <span key={k} className="bg-primary/20 text-primary px-2 py-1 rounded-md text-xs">
                  {k}
                </span>
              ))}
            </div>


            <div className="flex justify-between items-center mt-auto">
              <TooltipProvider>
                {/* כפתור צפייה בפרופיל (משמאל) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      // onClick={() => navigate(`/profile/${p.id}`)}
                      onClick={() => navigate(`/profile/${p.user_id}`, { state: { profile: p } })}
                      className="text-white px-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m3-3h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    View Profile
                  </TooltipContent>
                </Tooltip>

                {/* כפתורי עריכה ומחיקה למשתמש הנוכחי */}
                {p.user_id === currentUserId && (
                  <div className="flex gap-2 ml-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/update-profile`)}
                          className="text-white px-2"
                        >
                          <PencilLine size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={6}>
                        Edit Profile
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(p.id)}
              className="text-white px-2"
            > */}
                        {/*             
              <Trash2 size={18} />
            </Button> */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedProfileId(p.user_id); // שים לב: p.id ולא user_id
                            setIsModalOpen(true);
                          }}
                          className="text-white px-2"
                        >
                          <Trash2 size={18} />
                        </Button>

                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={6}>
                        Delete Profile
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </TooltipProvider>
            </div>

          </div>
        ))}
      </div>

      {loading && <LoadingDots />}
      {/* {loading && hasMore && <LoadingDots />} */}
      {!loading && profiles.length === 0 && (
        <p className="text-white mt-10">No profiles found.</p>
      )}
      {/* Delete Profile Modal */}
      <DeleteProfileModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProfileId(null);
        }}
        onConfirm={handleDelete} // ← ✅ נכון
      />
      
      {/* שרהלה */}
      {/* Existing Profile Modal */}
      {showExistingProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background border border-primary/20 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-primary mb-4">Existing Profile</h2>
            <p className="text-white mb-6">
              Our system has identified that you already have an active profile.
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowExistingProfileModal(false)}
                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {deleteMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-6 py-2 rounded shadow-md transition-opacity duration-300 z-50">
          {deleteMessage}
        </div>
      )}


    </div>

  );
};

export default ProfilesPage;
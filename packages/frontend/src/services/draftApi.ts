// import { promise } from "zod";

// const API_BASE = "http://localhost:3001/api/draft";

// export interface Draft {
//   id: number;
// //   title: string;
//   content: string;
//   created_at: string;
//   updated_at: string;
// }


// //Retrieving a draft from the database
// export const getDraft = async (id: number): Promise<Draft> => {
//   const res = await fetch(`${API_BASE}/${id}`);
//   if (!res.ok) 
//     {
//         throw await res.json();
//     }
//   return res.json();
// };
// export const getDraftsByUser = async (userId: string): Promise<Draft[]> => {
//   const res = await fetch(`${API_BASE}/user/${userId}`);
//   if (!res.ok) throw await res.json();
//   return res.json();
// };

// export const getDraftHistory = async (draftId: number) => {
//   const res = await fetch(`${API_BASE}/${draftId}/history`);
//   if (!res.ok) throw await res.json();
//   return res.json();
// };
// //Creating a new draft
// export const createDraft = async (content: string, userId: string): Promise<Draft> => {
//   const res = await fetch(`${API_BASE}`, {
//     method: "post",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ content, userId }), // Include userId (password) in the request body
//   });
//   if (!res.ok) {
//     throw await res.json();
//   }
//   return res.json();
// };

// // //Updating an existing draft
// // export const updateDraft = async (id: number, content: string): Promise<Draft> => {
// //     const res = await fetch (`${API_BASE}/${id}`, {
// //         method: "put",
// //         headers: {"Content-Type" : "application/Json"},
// //         body: JSON.stringify({ content }),
// //     });
// //     if(!res.ok){
// //         throw await res.json();
// //     }
// //     return res.json();

// // };
// //Saving a draft with conflict resolution
// export const saveDraftWithConflict = async (id: number, content: string, lastUpdated: string, override: boolean): Promise<any> => {

//     const res = await fetch (`${API_BASE}/${id}`, {
//         method: "put",
//         headers: {"Content-Type" : "application/Json"},
//         body: JSON.stringify({ content, lastUpdated, override }),
//     });

//     return res.json();

// };
// //Deleting a draft
// export const deleteDraft = async (id: number): Promise<string> => {
//     const res = await fetch (`${API_BASE}/${id}`, {
//         method: "delete",
//     });
//     if(!res.ok){
//         throw await res.json();
//     }
//     return "successfully deleted draft";

// };

// //Restoring a draft from a version
// export const restoreDraftFromVersion = async (draftId: number, versionId: number): Promise<Draft> => {
//     const res = await fetch(`${API_BASE}/${draftId}/restore/${versionId}`, {
//         method: "POST"
//     });
//     if (!res.ok) throw await res.json();
//     return res.json();
// }

// export const getMyId = async (): Promise<{ userId: string, email: string }> => {
//    const res = await fetch(`${API_BASE}/me`, {
//         method: "get"
//       });
//     if (!res.ok) throw await res.json();
//     return res.json();
// }


const API_BASE = "http://localhost:3001/api/draft";
export interface Draft {
  id: number;
  //   title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
//Retrieving a draft from the database
export const getDraft = async (id: number): Promise<Draft> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
};
export const getDraftsByUser = async (userId: string): Promise<Draft[]> => {
  const res = await fetch(`${API_BASE}/user/${userId}`);
  if (!res.ok) throw await res.json();
  return res.json();
};
export const getDraftHistory = async (draftId: number) => {
  const res = await fetch(`${API_BASE}/${draftId}/history`);
  if (!res.ok) throw await res.json();
  return res.json();
};
// // Creating a new draft
// export const createDraft = async (content: string, userId: string): Promise<Draft> => {
//   const res = await fetch(`${API_BASE}`, {
//     method: "post",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ content, userId }), // Include userId (password) in the request body
//   });
//   if (!res.ok) {
//     throw await res.json();
//   }
//   return res.json();
// };
// const userId = localStorage.getItem("userId");

export const createDraft = async (content: string, userId: string): Promise<Draft> => {
  if (!userId) throw new Error("User not logged in");
  const res = await fetch("http://localhost:3001/api/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, userId }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const saveDraftWithConflict = async (
  id: number,
  content: string,
  lastUpdated: string,
  override: boolean,
  userId: string): Promise<any> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/Json" },
    body: JSON.stringify({ content, lastUpdated, override, userId }),
  });
  if (!res.ok) {
    // נזרוק את ה-json כדי שה-catch ב-React יתפוס את זה
    throw await res.json();
  }
  return res.json();
};
//Deleting a draft
export const deleteDraft = async (id: number): Promise<string> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "delete",
  });
  if (!res.ok) {
    throw await res.json();
  }
  return "successfully deleted draft";
};
//Restoring a draft from a version
export const restoreDraftFromVersion = async (draftId: number, versionId: number): Promise<Draft> => {
  const res = await fetch(`${API_BASE}/${draftId}/restore/${versionId}`, {
    method: "POST"
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
// export const getMyId = async (): Promise<{ userId: string, email: string }> => {
//    const res = await fetch(`${API_BASE}/me`, {
//         method: "get"
//       });
//     if (!res.ok) throw await res.json();
//     return res.json();
// }

export const getMyVersions = async (): Promise<any[]> => {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch(`${API_BASE}/recycle-bin/all`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const restoreVersionAsNewDraft = async (versionId: number): Promise<any> => {
  const token = localStorage.getItem("jwtToken");
  const res = await fetch("http://localhost:3001/api/draft/restore-as-new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ versionId }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const deleteDraftPermanently = async (versionId: number): Promise<boolean> => {
  const res = await fetch(`http://localhost:3001/api/draft/recycle-bin/${versionId}`, {
    method: "DELETE",
    
  });
  if (!res.ok) throw await res.json();
  return true;
};

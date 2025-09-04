
export enum UserRole {
  ADMIN = 'admin',
  CONTENT_CREATOR = 'content_creator',
  ACCELERATOR_STAFF = 'accelerator_staff',
  USER = 'user'
}

export interface User {
  id: string;
  email: string;
  google_id: string;
  username: string;          // ✅ חדש
  password_hash: string;
  role: UserRole;
  created_at: string; // Date as ISO string
  updated_at: string;
}
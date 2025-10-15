export interface UpdateUserInput {
  username?: string;
  avatar_url?: string;
  avatar_id?: string;
}

export interface UserDataResponse {
  id: string;
  username: string;
  phone: string;
  email: string;
  avatar_id?: string | null;
  avatar_url?: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
}
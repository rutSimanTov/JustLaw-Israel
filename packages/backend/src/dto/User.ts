export class User {
  constructor(
    public id: string,
    public email: string,
    public google_id: string,
    public username: string,         
    public password_hash: string,
    public role: 'admin' | 'content_creator' | 'accelerator_staff' | 'user',
    public created_at: Date,
    public updated_at: Date
  
  ) {}
}

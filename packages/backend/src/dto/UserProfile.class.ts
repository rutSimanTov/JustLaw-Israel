export class Profile {
  constructor(
    public id: string,
    public user_id: string,
    public full_name: string,
    public role_description: string,
    public country_region: string,
    public value_sentence: string,
    public keywords: string[],
    public current_challenge: string,
    public connection_types: string[],
    public engagement_types: string[],
    public contact_info?: any,
    public project_link?: string,
    public other_connection_text?: string,
    public is_visible: boolean = true,
    public created_at: Date = new Date(),
    public updated_at: Date = new Date()
  ) {}
}

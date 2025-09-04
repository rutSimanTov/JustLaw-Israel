
export class ContactInfo {
    constructor(
      public user_id: string,
      public email?: string,
      public phone?: string,
      public linked_in_url?: string,
      public website_url?: string,
      public other?: string
    ) {}
  }
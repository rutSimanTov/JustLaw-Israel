
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ContentItem, ContentMetadata, ContentAnalytics, ContentType, ContentStatus, ContentCategory } from '@base-project/shared';
import { v4 as uuidv4 } from 'uuid';  // תוודאי שהייבאת את זה

export class DatabaseService {
  private readonly contentTableName = 'content';
  private readonly metadataTableName = 'content_metadata';
  private readonly analyticsTableName = 'content_analytics';
  private supabase: SupabaseClient | null = null;

  private getClient(): SupabaseClient {
    if (!this.supabase) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration. Please check your environment variables.');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    return this.supabase;
  }

  canInitialize(): boolean {
    return this.getClient() !== null;
  }

  async getAllContentItems(): Promise<ContentItem[]> {
    try {
      const { data, error } = await this.getClient()
        .from(this.contentTableName)
        .select('*')
        .order('createdat', { ascending: true });

      if (error) {
        console.error('Database error fetching content items:', error);
        throw new Error('Failed to fetch content items from database');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllContentItems:', error);
      throw error;
    }
  }

  async createContentItem(item: ContentItem): Promise<ContentItem> {
  try {
    console.log('In DB service, inserting item:', item); // כאן
    const { data, error } = await this.getClient()
      .from(this.contentTableName)
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Database error creating content item:', error);
      throw new Error('Failed to create content item in database');
    }

    return data;
  } catch (error) {
    console.error('Error in createContentItem:', error);
    throw error;
  }
}


  async createContentMetadata(metadata: ContentMetadata): Promise<ContentMetadata> {
    try {
      const { data, error } = await this.getClient()
        .from(this.metadataTableName)
        .insert([metadata])
        .select()
        .single();

      if (error) {
        console.error('Database error creating content metadata:', error);
        throw new Error('Failed to create content metadata in database');
      }

      return data;
    } catch (error) {
      console.error('Error in createContentMetadata:', error);
      throw error;
    }
  }

  async createContentAnalytics(analytics: ContentAnalytics): Promise<ContentAnalytics> {
    try {
      const { data, error } = await this.getClient()
        .from(this.analyticsTableName)
        .insert([analytics])
        .select()
        .single();

      if (error) {
        console.error('Database error creating content analytics:', error);
        throw new Error('Failed to create content analytics in database');
      }

      return data;
    } catch (error) {
      console.error('Error in createContentAnalytics:', error);
      throw error;
    }
  }


  async initializeSampleData(): Promise<void> {
    try {
      const items = await this.getAllContentItems();

      if (items.length === 0) {
        console.log('Initializing database with sample content data...');

        const sampleItems: ContentItem[] = [
          {
            id: uuidv4(),
            title: 'Sample Article 1',
            description: 'Description for Sample Article 1',
            categoryid: 1,
            typeid: 1,
            statusid: 1,
            authorid: 'author-1',
            createdat: new Date(),
            updatedat: new Date(),
            tags: [],
            metadata: {
              contentid: 'm',
              language: 'english',
            },
          },
        ];

        for (const item of sampleItems) {
          await this.createContentItem(item);
        }

        console.log('Sample content data initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize sample data:', error);
    }
  }
}

export const databaseService = new DatabaseService();

//  index articles in a Meilisearch database by checking for an existing index,
//  filtering content, and preparing it for indexing.


import { Request, Response } from 'express';
import * as contentService from '../services/contentService';
import axios from 'axios';

// Interface for content items
export interface ContentItem {
  id: string; // Unique identifier for the content item
  title: string; // Title of the content item
  description: string; // Description of the content item
  content?: string; // Optional content of the item, could be text or image in Base64
  tags: string[]; // Array of tags associated with the content item
  externalurl?: string; // Optional external URL for the content item
  downloadurl?: string; // Optional download URL for the content item
}


// Function to determine if content is a Base64 image
const isBase64Image = (content: string): boolean => {
  return /^data:image\/[a-zA-Z]+;base64,/.test(content.trim()); // Check if the content starts with the Base64 image prefix
};

// Main function to index articles
export const indexArticles = async (req: Request, res: Response) => {
  try {

// Check if the index exists and delete it if it does
try {
  const response = await axios.get(process.env.VITE_MEILI_URL+'/indexes/articles');   
  
  // If it exists, delete the previous index
  if (response.status === 200) {
    await axios.delete(process.env.VITE_MEILI_URL+ '/indexes/articles');
  }
} catch (err) {
  const error = err as any;
  // Ignore 404 error (index does not exist)
  if (error.response && error.response.status !== 404) {
    throw error; // Rethrow error if it's not a 404
  }
}

    // Check if the index exists; if not, create it
    try {
      await axios.get(process.env.VITE_MEILI_URL + '/indexes/articles'); // Attempt to get the index
    } catch (err) {
      const error = err as any;
      if (error.response && error.response.status === 404) {// If index not found (404)
        await axios.post(process.env.VITE_MEILI_URL + '/indexes', {
          uid: 'articles', // Unique identifier for the index
          primaryKey: 'id' // Primary key for the documents in the index
        });
      } else {
        throw error; // Rethrow error if it's not a 404
      }
    }



    // Retrieve all content items
    const contents = await contentService.getAllContent();

    // Filter out contents where the content field is a Base64 image
    const filteredContents = contents.filter((content: ContentItem) => {
      return !isBase64Image(content.content || '');// Keep only non-Base64 images
    });

    // Prepare documents for indexing in JSON format
    const documents = filteredContents.map((content: ContentItem) => ({
      id: content.id, // Document ID
      title: content.title, // Document title
      description: content.description, // Document description
      content: content.content, // Document content
      tags: content.tags, // Document tags
      externalurl: content.externalurl, // Document external URL
      downloadurl: content.downloadurl // Document download URL
    }));
    // Send the documents to the Meilisearch index
    const { data: task } = await axios.post(process.env.VITE_MEILI_URL+ '/indexes/articles/documents', documents);

    // Wait until the indexing task is completed successfully
    let done = false;
    while (!done) {
      const { data: status } = await axios.get(process.env.VITE_MEILI_URL + `/tasks/${task.taskUid}`);
      if (status.status === 'succeeded') { // If indexing succeeded
        done = true; // Mark as done
      } else if (status.status === 'failed') { // If indexing failed
        throw new Error('Indexing failed'); // Throw an error
      }
      await new Promise(r => setTimeout(r, 300)); // Wait for 300ms before checking again
    }

    // Set searchable and displayed attributes for the index
    await axios.patch(process.env.VITE_MEILI_URL + '/indexes/articles/settings', {
      searchableAttributes: ['title', 'content', 'description', 'tags', 'externalurl', 'downloadurl'],
      displayedAttributes: ['title', 'content', 'description', 'tags', 'externalurl', 'downloadurl']
    });

    res.status(200).json({ success: true });// Respond with success
  } catch (error) {
    console.error('[indexArticles] Error:', error);// Log the error
    res.status(500).json({
      success: false, // Indicate failure
      message: 'Server error', // Error message
      error: error instanceof Error ? error.message : String(error), // Return the error message
    });
  }
};

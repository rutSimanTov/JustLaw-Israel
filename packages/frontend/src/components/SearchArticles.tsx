import React, { useState } from 'react';
import axios from 'axios';

// Define the props for the SearchArticles component
interface SearchProps {
    onSearchResults: (results: any[]) => void;// Callback function to handle search results
    onClearSearch: () => void; // Callback function to clear the search results
}

const SearchArticles: React.FC<SearchProps> = ({ onSearchResults, onClearSearch }) => {
    const [query, setQuery] = useState('');// State to hold the search query

    // Function to handle the search operation
    const handleSearch = async () => {
        try {
            // Index articles before performing the search
            await axios.post(process.env.REACT_APP_API_URL + '/searchArticle/index');

            // Perform the search for articles using the query
            const response = await axios.get('https://meilisearchservice.onrender.com/indexes/articles/search', {

                params: {
                    q: query,// The search query parameter
                },
            });
            // Pass the search results to the parent component
            onSearchResults(response.data.hits);
        } catch (error) {
            console.error('Error fetching search results:', error);// Log any errors that occur during the fetch
        }
    };

    return (
        <div className="flex items-center justify-start">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles.."
                className="border border-pink-500 p-2 rounded bg-background text-white w-[400px]"

            />
            <button onClick={handleSearch} className="ml-1 p-2 bg-primary text-white rounded">
                Search
            </button>

            <button onClick={onClearSearch} className="ml-1 p-2 bg-primary text-white rounded">
                Clear Search
            </button>

        </div>
    );
};
export default SearchArticles; // Export the component for use in other parts of the application

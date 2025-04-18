import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID || '', // Fetch from .env
  dataset: process.env.REACT_APP_SANITY_DATASET || 'production', // Fetch from .env
  apiVersion: '2023-01-01',    // Use the latest API version
  useCdn: true,                // `true` for faster, cached responses
});

export default sanityClient;
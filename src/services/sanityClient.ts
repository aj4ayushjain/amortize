import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '', // Fetch from .env
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production', // Fetch from .env
  apiVersion: '2023-01-01',    // Use the latest API version
  useCdn: true,                // `true` for faster, cached responses
});

export default sanityClient;


const builder = imageUrlBuilder(sanityClient);

console.log('Sanity Image builder:', builder);
export function urlFor(source: any) {
  return builder.image(source);
}
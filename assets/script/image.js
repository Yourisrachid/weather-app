const UNSPLASH_ACCESS_KEY = 'i6RKcwF99JNczr6xEbS-K1rSnfBeu3erj2kVPIIdio0';
const unsplashEndpoint = 'https://api.unsplash.com/photos/random';

async function fetchCityImage(cityName) {
    try {
        const response = await fetch(`${unsplashEndpoint}?query=${cityName}&client_id=${UNSPLASH_ACCESS_KEY}`);
        if (!response.ok) {
            throw new Error('Unable to fetch image');
        }
        const data = await response.json();
        return data.urls.regular;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

export { fetchCityImage };

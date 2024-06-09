export const getCoordinates = async (address: string): Promise<{ lat: number, lon: number } | null> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            return { lat: parseFloat(lat), lon: parseFloat(lon) };
        }
        return null;
    } catch (e) {
        console.error('Error fetching coordinates:', e);
        return null;
    }
};
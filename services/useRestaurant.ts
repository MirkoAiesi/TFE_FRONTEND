import { ref, onMounted } from 'vue';
import { fetchRestaurantById } from '../services/userService';
import type { Restaurant } from '../services/types/restaurant';
import { getCoordinates } from '../services/getCoordinates';

export function useRestaurant(id: number) {
    const restaurant = ref<Restaurant | null>(null);
    const loading = ref(true);
    const files = ref([])
    const error = ref<string | null>(null);
    const coordinates = ref<{ lat: number, lon: number } | null>(null);

    const fetchRestaurant = async () => {
        try {
            const response = await fetchRestaurantById(id);
            files.value = response.files
            restaurant.value = response.restaurant as Restaurant;

            if (restaurant.value) {
                const coords = await getCoordinates(restaurant.value.address);
                if (coords) {
                    coordinates.value = coords;
                } else {
                    throw new Error('Coordinates not found for the given address');
                }
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch restaurant';
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchRestaurant);

    return {
        restaurant,
        coordinates,
        loading,
        error,
        files
    };
}
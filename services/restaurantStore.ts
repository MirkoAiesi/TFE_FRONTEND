import { ref } from 'vue';
import type { Restaurant } from '../services/types/restaurant';

const restaurant = ref<Restaurant | null>(null);

export const useRestaurantStore = () => {
    const setRestaurant = (data: Restaurant) => {
        restaurant.value = data;
    };

    return {
        restaurant,
        setRestaurant,
    };
};

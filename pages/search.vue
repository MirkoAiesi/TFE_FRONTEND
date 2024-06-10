<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoadingComponent from '../components/loading-component.vue';
import { searchRestaurants } from '../services/userService';

const router = useRouter();

const restaurants = ref([]);
const loading = ref(false);
const loadingResult = ref(true);
const error = ref(null);

// Références pour les filtres
const restaurantName = ref('');
const restaurantType = ref('');
const restaurantPrice = ref('');
const allowDogs = ref(false);
const hasTerrace = ref(false);
const acceptsCard = ref(false);

const startSearch = async () => {
    loading.value = true;
    loadingResult.value = true;
    error.value = null;

    const filters = {
        name: restaurantName.value,
        type: restaurantType.value,
        price: restaurantPrice.value,
        dogs: allowDogs.value,
        terrace: hasTerrace.value,
        card: acceptsCard.value
    };

    try {
        const allRestaurants = await searchRestaurants(filters);
        restaurants.value = allRestaurants.filter(restaurant => restaurant.status !== 10);
    } catch (err) {
        error.value = err.message || 'Failed to fetch restaurants';
    } finally {
        loading.value = false;
        loadingResult.value = false;
    }
};

const getStatusText = (status) => {
    return status === 1 ? 'ouvert' : 'fermer';
};

// Fonction pour naviguer vers la page de détail d'un restaurant
const navigateToRestaurant = (id) => {
    router.push(`/restaurants/${id}`);
};
</script>

<template>
    <div>
        <section class="search">
            <div class="search-bar">
                <div class="header">
                    <p>Rechercher un restaurant</p>
                </div>
                <div class="content">
                    <div>
                        <input type="text" name="name" placeholder="Nom du restaurant, ville" v-model="restaurantName">
                        <select name="type" v-model="restaurantType">
                            <option value="">Tous les types</option>
                            <option value="francais">Cuisine française</option>
                            <option value="italienne">Cuisine italienne</option>
                            <option value="mexicaine">Cuisine mexicaine</option>
                            <option value="chinoise">Cuisine chinoise</option>
                        </select>
                        <select name="price" v-model="restaurantPrice">
                            <option value="">Tous les prix</option>
                            <option value="€">€ (-50€)</option>
                            <option value="€€">€€ (50€ - 80€)</option>
                            <option value="€€€">€€€ (+80€)</option>
                        </select>
                    </div>
                    <button @click="startSearch">Rechercher</button>
                    <div class="filter">
                        <p>- Filtrages avancés -</p>
                        <div class="filter-content">
                            <label for="chien">Chien autorisé</label>
                            <input id="chien" type="checkbox" name="chien" v-model="allowDogs">
                            <label for="terasse">Terrasse</label>
                            <input id="terasse" type="checkbox" name="terasse" v-model="hasTerrace">
                            <label for="cart">Payement par carte</label>
                            <input id="cart" type="checkbox" name="cart" v-model="acceptsCard">
                        </div>
                    </div>
                </div>
                <h2>Suggestion d'autres établissements</h2>
                <div class="suggestions-container">
                    <!-- Suggestions des restaurants -->
                </div>
            </div>
        </section>

        <section>
            <LoadingComponent v-if="loading" />
            <div v-else class="result" :class="{ loading: loadingResult }">
                <div class="resultContainer">
                    <div class="restaurants-wrapper">
                        <div v-if="error" class="error">{{ error }}</div>
                        <div v-else-if="restaurants.length === 0" class="no-results">No restaurants found</div>
                        <div style="display: flex;" v-else>
                            <div v-for="restaurant in restaurants" :key="restaurant.id" class="restaurant"
                                @click="navigateToRestaurant(restaurant.id)">
                                <div>
                                    <p><span>★</span> {{ restaurant.rating }}</p>
                                </div>
                                <img :src="`http://localhost:3333/${restaurant.id}/${restaurant.firstImage}`"
                                    :alt="restaurant.name">
                                <h3>{{ restaurant.name }}</h3>
                                <p>{{ restaurant.address }}</p>
                                <span class="status">{{ getStatusText(restaurant.status) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.loading {
    opacity: 0;
    display: none;
}

.filter-content input {
    accent-color: #6e8b3d;
    margin: 10px;
}

.search {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 50px 0;
    padding: 0 10px;
    /* Ajouté pour ajouter des marges internes */
    box-sizing: border-box;
}

.search-bar {

    max-width: 1100px;
    height: fit-content;
    border-radius: 8px;
    background-color: #6e8b3d;
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
}

.search-bar .header {
    padding: 8px;
}

.search-bar .header p {
    color: white;
    font-size: 18px;
}

.search-bar .content {
    background-color: #f0f0f0;
    height: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
}

.content div:first-child {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
}

.content div:first-child input,
select {
    width: 100%;
    max-width: 200px;
    margin: 10px;
    font-size: 15px;
    padding: 4px;
    font-family: 'Poppins', sans-serif;
}

select option {
    font-weight: 300;
}

.content button {
    font-size: 16px;
    padding: 5px 15px;
    border-radius: 4px;
    border: none;
    background-color: #6e8b3d;
    cursor: pointer;
    color: white;
    margin: 15px 0;
    transition: 0.2s;
}

.content button:hover {
    background-color: #637d34;
}

.filter {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
}

.filter p {
    margin-bottom: 10px;
    font-size: 18px;
}

.result {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 10px;
    /* Ajouté pour ajouter des marges internes */
    box-sizing: border-box;
}

.resultContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1100px;
    width: 100%;
    box-sizing: border-box;
}

.restaurant {
    position: relative;
    width: 90%;
    max-width: 300px;
    /* Réduit la taille maximale des images */
    background-color: #f0f0f0;
    padding: 20px;
    margin: 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
    box-sizing: border-box;
}

.restaurant:hover {
    transform: scale(1.05);
    /* Utilisé transform au lieu de scale */
}

.restaurant .status {
    float: right;
    font-size: 14px;
}

.restaurant img {
    width: 260px;
    height: 150px;
}

.restaurant div {
    background-color: #6e8b3d;
    color: white;
    position: absolute;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 5px;
    left: 5px;
    border-radius: 8px;
    font-size: 16px;
}

.restaurants-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    box-sizing: border-box;
}

h2 {
    color: white;
    text-align: center;
    font-weight: 400;
    margin-top: 10px;
}

.suggestions-container {
    width: 100%;
    max-width: 1100px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    /* Ajouté pour s'assurer que les éléments s'adaptent correctement */
    box-sizing: border-box;
}

.suggestions-container .restaurant {
    min-width: 200px;
    /* Réduit la taille minimale des images */
    max-width: 300px;
    /* Réduit la taille maximale des images */
    margin: 10px;
    /* Ajouté pour espacer les images */
    box-sizing: border-box;
}

@media (max-width: 868px) {
    .content div:first-child {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .filter .filter-content {
        flex-direction: column;
    }

    .restaurants-wrapper {
        flex-direction: column;
        align-items: center;
    }

    .search-bar .content {
        padding: 20px;
    }

    .search-bar .header p {
        font-size: 16px;
    }

    .search-bar .content input,
    .search-bar .content select {
        width: calc(100% - 20px);
        margin: 5px 0;
    }

    .filter p {
        font-size: 16px;
    }

    .suggestions-container {
        flex-direction: column;
        align-items: center;

    }

    .suggestions-container .restaurant {
        width: 90%;
    }

}
</style>

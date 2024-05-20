<script setup>
import { ref } from 'vue';
import LoadingComponent from '../components/loading-component.vue';

const loading = ref(true);
const loadingResult = ref(true);

const startSearch = () => {
    loading.value = false;
    setTimeout(() => {
        loading.value = true;
        loadingResult.value = false;
    }, 1500);
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
                        <input type="text" name="name" placeholder="Nom du restaurant, ville">
                        <select name="type">
                            <option value="Restaurant">Restaurant</option>
                            <option value="Bistrot">Bistrot</option>
                            <option value="Gastronomique">Gastronomique</option>
                        </select>
                        <select name="price">
                            <option value="Restaurant">€ (-50€)</option>
                            <option value="Bistrot">€€ (50€ - 80€)</option>
                            <option value="Gastronomique">€€€ (+80€)</option>
                        </select>
                    </div>
                    <button @click="startSearch">Rechercher</button>
                    <div class="filter">
                        <p>- Filtrages avancés -</p>
                        <div class="filter-content">
                            <input id="chien" type="checkbox" name="chien">
                            <label for="chien">Chien autorisé</label>
                            <input id="terasse" type="checkbox" name="terasse">
                            <label for="terasse">Terasse</label>
                            <input id="cart" type="checkbox" name="cart">
                            <label for="cart">Payement par carte</label>
                        </div>
                    </div>
                </div>
                <h2>Suggestion d'autres établissements</h2>
                <div class="suggestions-container">
                    <div class="restaurant">
                        <div>
                            <p><span>★</span> 9</p>
                        </div>
                        <img src="/pictures/restaurants/resto.jpg" alt="name">
                        <h3>Brasserie Quai 10</h3>
                        <p>Rue Grande 4 7070 Charleroi</p>
                        <span class="status">Ouvert (11h-22h)</span>
                    </div>
                    <div class="restaurant">
                        <div>
                            <p><span>★</span> 9</p>
                        </div>
                        <img src="/pictures/restaurants/resto.jpg" alt="name">
                        <h3>Brasserie Quai 10</h3>
                        <p>Rue Grande 4 7070 Charleroi</p>
                        <span class="status">Fermé</span>
                    </div>
                    <div class="restaurant">
                        <div>
                            <p><span>★</span> 9</p>
                        </div>
                        <img src="/pictures/restaurants/resto.jpg" alt="name">
                        <h3>Brasserie Quai 10</h3>
                        <p>Rue Grande 4 7070 Charleroi</p>
                        <span class="status">Ouvert (11h-22h)</span>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <LoadingComponent :class="{ loading: loading }" />
            <div v-if="loading" class="result" :class="{ loading: loadingResult }">
                <div class="resultContainer">
                    <div class="restaurants-wrapper">
                        <div class="restaurant">
                            <div>
                                <p><span>★</span> 9</p>
                            </div>
                            <img src="/pictures/restaurants/resto.jpg" alt="name">
                            <h3>Brasserie Quai 10</h3>
                            <p>Rue Grande 4 7070 Charleroi</p>
                            <span class="status">Ouvert (11h-22h)</span>
                        </div>
                        <div class="restaurant">
                            <div>
                                <p><span>★</span> 9</p>
                            </div>
                            <img src="/pictures/restaurants/resto.jpg" alt="name">
                            <h3>Brasserie Quai 10</h3>
                            <p>Rue Grande 4 7070 Charleroi</p>
                            <span class="status">Fermé</span>
                        </div>
                    </div>
                    <div class="restaurants-wrapper">
                        <div class="restaurant">
                            <div>
                                <p><span>★</span> 9</p>
                            </div>
                            <img src="/pictures/restaurants/resto.jpg" alt="name">
                            <h3>Brasserie Quai 10</h3>
                            <p>Rue Grande 4 7070 Charleroi</p>
                            <span class="status">Ouvert (11h-22h)</span>
                        </div>
                        <div class="restaurant">
                            <div>
                                <p><span>★</span> 9</p>
                            </div>
                            <img src="/pictures/restaurants/resto.jpg" alt="name">
                            <h3>Brasserie Quai 10</h3>
                            <p>Rue Grande 4 7070 Charleroi</p>
                            <span class="status">Fermé</span>
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
    margin-left: 10px;
}

.search {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 50px 0;
}

.search-bar {
    width: 100%;
    max-width: 1100px;
    height: fit-content;
    border-radius: 8px;
    background-color: #6e8b3d;
    margin: 20px;
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
}

.content div:first-child {
    display: flex;
    flex-wrap: wrap;
}

.content div:first-child input,
select {
    width: 200px;
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

}

.resultContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1100px;
    width: 100%;
}

.restaurant {
    position: relative;
    min-width: 330px;
    width: 30%;
    background-color: #f0f0f0;
    padding: 15px;
    margin: 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
}

.restaurant:hover {
    scale: 1.05;
}

.restaurant .status {
    float: right;
    margin-top: 10px;
    font-size: 14px;
}

.restaurant img {
    width: 100%;
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
}

.restaurants-wrapper .restaurant {
    width: 43%;
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
}

.suggestions-container .restaurant {
    min-width: 300px;
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
}
</style>
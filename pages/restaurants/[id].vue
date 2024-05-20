<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
const zoom = ref(20)
const restaurant = ref({
    name: "Votre restaurant",
    phoneNumber: "0123456789",
    address: "123 Rue du Restaurant, Ville",
    openingHours: "Mardi-Vendredi: 12h00-15h00 et 17h30-22h / Samedi-Dimanche: 12h00 - 23h00",
    price: "€-€€",
    cooking: "Française",
    pet: "non",
    terrace: "oui",
    payement: "VISA, MASTERCARD, MAESTRO"


})

const reservationDate = ref(null)
const numberOfPersons = ref('2')
const arrivalTime = ref('12:00')

const value = ref(4.2)
const colors = ref(['#FF0000', '#F7BA2A', '#6e8b3d'])


const totalStars = ref(50);
type StarsByRating = { [key: number]: number };
const starsByRating = ref<StarsByRating>({ 5: 30, 4: 10, 3: 7, 2: 0, 1: 3 });

const ratingPercentage = (rating: number) => {
    const stars = starsByRating.value[rating] || 0;
    return `${(stars / totalStars.value) * 100}%`;
};

const availableTimes = computed(() => {
    const times: string[] = []
    for (let i = 12; i < 22; i++) { // Arrêter à 22h pour correspondre à votre exemple
        for (let j = 0; j < 2; j++) { // Deux demi-heures par heure
            const hour = i < 10 ? `0${i}` : `${i}`
            const minute = j === 0 ? '00' : '30'
            times.push(`${hour}:${minute}`)
        }
    }
    return times
})

const images = ref([
    { src: "/pictures/restaurants/resto.jpg", alt: "name1" },
    { src: "/pictures/restaurants/resto.jpg", alt: "name1" },
    { src: "/pictures/restaurants/resto.jpg", alt: "name1" },
    // Ajoutez autant d'images que nécessaire
]);

interface Comment {
    text: string;
    rating: number;
}

const comments = ref<Comment[]>([]);
let currentPage: number = 1;
let totalPages: number = 1;

const getComments = () => {
    // Exemple de données factices pour les commentaires
    const fakeComments: Comment[] = [
        { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.', rating: 4 },
        { text: 'Commentaire 2', rating: 5 },
        { text: 'Commentaire 2', rating: 5 },
        { text: 'Commentaire 2', rating: 5 },
        { text: 'Commentaire 2', rating: 5 },
        // Ajoutez plus de données factices ici...
    ];
    comments.value = comments.value.concat(fakeComments);
    // Simulez un nombre total de pages
    totalPages = 3;
};

const checkScroll = () => {
    const commentContainer: HTMLElement | null = commentContainerRef.value;
    // Vérifiez si l'utilisateur a atteint le bas de la zone de défilement
    if (
        commentContainer &&
        commentContainer.scrollTop + commentContainer.clientHeight >=
        commentContainer.scrollHeight
    ) {
        // Vérifiez si toutes les pages ont été chargées
        if (currentPage < totalPages) {
            // Chargez les commentaires de la page suivante
            currentPage++;
            getComments();
        }
    }
};

const commentContainerRef = ref<HTMLElement | null>(null);

onMounted(() => {
    getComments();
});
const dialogVisible = ref(false)

const popup = (time: string) => {

    dialogVisible.value = true
    arrivalTime.value = time

};


</script>

<template>
    <div class="restaurant-page">
        <div class="restaurant_suggestion">
            <header>
                <h1>{{ restaurant.name }}</h1>
            </header>
            <section class="restaurant-info">
                <el-rate v-model="value" size="large" disabled show-score :colors=colors text-color="#6e8b3d"
                    score-template="{value} points" />
                <div class="info-row">
                    <p><strong>Horaires:</strong> {{ restaurant.openingHours }}</p>
                </div>

            </section>
            <div class="reservation-carousel">
                <div class="reservation-info">
                    <div class="reservation-square">
                        <h3>Réserver une table</h3>
                        <div class="reservation-data">
                            <div class="form-group">
                                <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728="">
                                        <path fill="currentColor"
                                            d="M256 410.56V96a32 32 0 0 1 64 0v314.56A96 96 0 0 0 384 320V96a32 32 0 0 1 64 0v224a160 160 0 0 1-128 156.8V928a32 32 0 1 1-64 0V476.8A160 160 0 0 1 128 320V96a32 32 0 0 1 64 0v224a96 96 0 0 0 64 90.56m384-250.24V544h126.72c-3.328-78.72-12.928-147.968-28.608-207.744-14.336-54.528-46.848-113.344-98.112-175.872zM640 608v320a32 32 0 1 1-64 0V64h64c85.312 89.472 138.688 174.848 160 256 21.312 81.152 32 177.152 32 288z">
                                        </path>
                                    </svg>
                                </div>
                                <select id="numberOfPersons" v-model="numberOfPersons">
                                    <option value="1">1 personne</option>
                                    <option value="2">2 personnes</option>
                                    <option value="3">3 personnes</option>
                                    <option value="4">4 personnes</option>
                                    <option value="5">5 personnes</option>
                                    <!-- Ajoutez autant d'options que nécessaire -->
                                </select>
                            </div>
                            <div class="form-group">
                                <div class="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728="">
                                        <path fill="currentColor"
                                            d="M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64">
                                        </path>
                                    </svg>
                                </div>
                                <input type="date" v-model="reservationDate" class="date-input">
                            </div>

                        </div>
                        <div class="reservation-button">
                            <button v-for="time in availableTimes" :key="time" @click=popup(time)>
                                {{ time }}
                            </button>
                        </div>
                    </div>
                    <div class="info-supp ">
                        <h3>Informations supplémentaires</h3>
                        <div class="info-column">
                            <p><strong>Adresse:</strong> {{ restaurant.address }}</p>
                            <p><strong>Téléphone:</strong> {{ restaurant.phoneNumber }}</p>
                            <p><strong>Prix:</strong> {{ restaurant.price }}</p>
                            <p><strong>Cuisines:</strong> {{ restaurant.cooking }}</p>
                            <p><strong>Animaux accepté:</strong> {{ restaurant.pet }}</p>
                            <p><strong>Terrasse:</strong> {{ restaurant.terrace }}</p>
                            <p><strong>Payements autorisés:</strong> {{ restaurant.payement }}</p>
                            <div style="display: flex;width: 100%;">
                                <NuxtLink to="../search"><img src="/public/pictures/facebook.png" alt="facebook"
                                        style="width: 30px; margin:10px;">
                                </NuxtLink>
                                <NuxtLink to="../search"><img src="/public/pictures/instagram.png" alt="instagram"
                                        style="width: 30px; margin:10px;">
                                </NuxtLink>
                                <NuxtLink to="../search"><img src="/public/pictures/website.png" alt="website"
                                        style="width: 30px; margin:10px;">
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-map">
                    <div class="carousel">
                        <div class="block text-center">
                            <el-carousel class="custom-carousel" height="341.6px" motion-blur :autoplay="false">
                                <el-carousel-item v-for="(image, index) in images" :key="index">
                                    <img :src="image.src" :alt="image.alt">
                                    <h3 class="small justify-center" text="2xl">{{ index }}</h3>
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                    <div class="map-container">
                        <LMap ref="map" :zoom="zoom" :center="[48.8719, 2.3035]">
                            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                                layer-type="base" name="OpenStreetMap" />
                            <LMarker :lat-lng="[48.8719, 2.3035]">
                                <LTooltip>Champs-Élysées</LTooltip>
                            </LMarker>
                        </LMap>
                    </div>
                </div>
            </div>
        </div>
        <h2>Suggestion d'autres établissements</h2>
        <div class="resultContainer">
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
        <h2> Avis de l'établissement </h2>
        <div class="notes-comments">
            <div class="notes">
                <el-rate v-model="value" size="large" disabled show-score :colors="colors" text-color="#6e8b3d"
                    score-template="{value} points" />
                <span>({{ totalStars }})</span>
                <div class="rating-distribution">
                    <span v-for="[rating] in Object.entries(starsByRating).reverse()" :key="rating">
                        {{ rating }}<span>★</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar" :style="{ width: ratingPercentage(Number(rating)) }"></div>
                        </div>
                    </span>
                </div>
                <div class="rating-customer">
                    <h3>Commentaires des clients</h3>
                    <div class="comment-container" ref="commentContainer" @scroll="checkScroll">
                        <ul>
                            <li v-for="(comment, index) in comments" :key="index">
                                <p>{{ comment.text }}</p>
                                <p>Note: {{ comment.rating }}<span>★</span></p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="comments">

                <form>
                    <div class="rate-all">
                        <h3>Donnez votre avis</h3>
                        <div class="rate-id">
                            <label for="name">Nom:</label>
                            <input type="text" id="name">
                            <label for="email">Email:</label>
                            <input type="email" id="email">
                        </div>

                        <div class="rate-rating">
                            <label for="rating">Évaluation:</label>
                            <select id="rating">
                                <option value="">-- Choisissez une évaluation --</option>
                                <option value="1">1 étoile</option>
                                <option value="2">2 étoiles</option>
                                <option value="3">3 étoiles</option>
                                <option value="4">4 étoiles</option>
                                <option value="5">5 étoiles</option>
                            </select>
                        </div>
                        <div class="rate-comment">
                            <label for="comment">Commentaire:</label>
                            <textarea id="comment"></textarea>
                        </div>
                        <button type="submit">Envoyer</button>
                    </div>
                </form>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" title="Tips" width="500">
            <p>Résumé de la réservation : {{ numberOfPersons }} personne(s) | {{ reservationDate }} | {{ arrivalTime }}
            </p>
            <label><input type="checkbox" name="option1"> Terrasse</label> <br>
            <label><input type="checkbox" name="option2"> Chien</label>
            <p>Demande(s) particulière(s)</p>
            <textarea style="resize:none; width: 100%; height: 50px;"></textarea>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
body {
    margin: 0;
    padding: 0;
}

header {
    padding-top: 20px;
    padding-left: 20px;
    display: flex;
    align-items: center;
}

header h1 {
    padding-top: 15px;
}

.el-rate {
    padding-right: 5px;
}

.restaurant-info {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    padding-bottom: 20px;
}

.info-row {
    padding-top: 5px;
}

.info-row p {
    margin-right: 20px;
}

.info-column {
    display: flex;
    flex-direction: column;
}

.info-column p {
    padding-top: 10px;
}


.reservation-square {
    padding: 20px;
    margin: 20px;
    border: 1px solid #ddd;
    background-color: white;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
    height: 300px;
}

.info-supp {
    padding: 20px;
    margin: 20px;
    border: 1px solid #ddd;
    background-color: white;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
    height: 300px;
}

.reservation-data {
    display: flex;
}

.form-group {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    /* Bordure grise */
    border-radius: 5px;
    /* Coins arrondis */
}

.form-group input {
    width: 150px;
    height: 40px;
    margin: 10px;
    padding: 4px;
}


select {
    width: 150px;
    height: 50px;
    transition: height 0.3s ease;
}

.icon {
    width: 10%
}

.reservation-button {
    display: flex;
    flex-flow: row wrap;
    height: 150px;
    width: 641px;
    /* Pour centrer les boutons horizontalement */
}

.reservation-button button {
    margin: 10px;
    height: 40px;
    width: 60px;
    background-color: #6e8b3d;
    border-radius: 5px;
    border-width: 0px;
    color: white;
}

.reservation-button button:hover {
    cursor: pointer;
}

.reservation-carousel {
    display: flex;
    justify-content: center;
}

.carousel {
    margin-bottom: 10px;
}

.demonstration {
    color: var(--el-text-color-secondary);
}

.custom-carousel {
    width: 683px;
    /* Ajustez la largeur souhaitée */
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.carousel-map {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: 20px;
}

.map-container {
    width: 683px;
    height: 341.6px;
    margin-top: 10px;
}

.resultContainer {
    width: 100%;
    display: flex;
    justify-content: center;
}

.restaurant {
    position: relative;
    min-width: 330px;
    width: 21%;
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

h2 {
    text-align: center;
}

h3 {
    text-align: center;
}

.notes-comments {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.notes {
    padding: 20px;
    margin: 20px;
    border: 1px solid #ddd;
    background-color: white;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
    height: 300px;
    width: 30%;
}


.rating-distribution {
    display: flex;
    flex-direction: row;
}

.rating-distribution span {
    color: #6e8b3d;
}

.progress-bar-container {
    width: 100px;
    height: 15px;
    background-color: #ccc;
    margin-right: 15px;

}

.progress-bar {
    height: 100%;
    background-color: #6e8b3d;
    /* Couleur de la partie remplie de la barre */
}

.comments {
    padding: 20px;
    margin: 20px;
    border: 1px solid #ddd;
    background-color: white;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
    height: 300px;
    width: 30%;
    display: flex;
}

.comments form {
    display: flex;
    justify-content: center;
    width: 100%;
}

.rating-customer {
    margin-top: 15px;
}

.comment-container {
    margin-top: 5px;
    height: 175px;
    /* Hauteur fixe de la zone de défilement */
    overflow-y: auto;
    /* Activer le défilement vertical */
}

.comment-container ul {
    padding-left: 0;
    list-style-type: none;
}

.comment-container li {
    margin-bottom: 20px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
}

.rate-all {
    margin-top: 25px;
    justify-content: center;
}

.rate-id {
    flex-direction: row;
    margin-top: 20px;

}

.rate-id label {
    padding: 10px;

}

.rate-rating {
    margin-top: 10px;
}

.rate-rating label {
    padding: 10px;
}

.rate-rating select {
    width: 250px;
    height: 24px;
    padding-left: 10px;
}

.rate-comment {
    margin-top: 10px;
}

.rate-comment label {
    padding: 10px;
}

.rate-comment textarea {
    display: flex;
    flex-direction: column;
    margin: 10px;
    width: 80%;
    height: 100px;
}
</style>

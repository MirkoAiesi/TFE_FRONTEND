<script lang="ts" setup>
import { ref, computed, onMounted, } from 'vue'
import { useRestaurant } from '../../services/useRestaurant';
import { useRoute } from 'vue-router';
import Cookies from "js-cookie";
import { fetchReviewsByRestaurantId, addReview, addBooking, updateRestaurantRating } from '../../services/userService';

const route = useRoute();
const restaurantId = parseInt(route.params.id as string, 10);

const { restaurant, coordinates, files } = useRestaurant(restaurantId);
console.log(files)

const reservationDate = ref<Date>()
const numberOfPersons = ref('2')
const arrivalTime = ref('12:00')

const colors = ref(['#FF0000', '#F7BA2A', '#6e8b3d']);

const isAuthenticated = ref(false);
const checkAuth = () => {
    const token = Cookies.get('authBR');
    isAuthenticated.value = !!token;
};
const redirectToLogin = () => {
    navigateTo('/auth/login') // Remplacez 'login' par le nom de votre route de connexion
};

const value = ref<number | undefined>(undefined);
watch(
    () => restaurant.value?.rating,
    (newRating) => {
        if (newRating !== undefined && newRating !== null) {
            value.value = newRating;
        }
    },
);
const animalAccepted = ref<string | null>(null);
const terrace = ref<string | null>(null);
const payments = ref<string[]>([]);
const specialRequest = ref('');

const bookingParams = ref({
    animal: false,
    terrace: false,
    specialRequest: ''
})
watch(
    () => restaurant.value?.options,
    (newOptions) => {
        if (newOptions) {
            const optionsArray = newOptions.split(',').map(option => option.trim());
            animalAccepted.value = optionsArray[0] || null;
            terrace.value = optionsArray[1] || null;
            payments.value = optionsArray.slice(2) || [];
        }
    },
);
interface Schedule {
    [day: string]: [string, string];
}

const parsedSchedule = computed<Schedule | null>(() => {
    try {
        if (!restaurant.value?.schedule) {
            return null;
        }
        // Si le champ schedule est déjà un objet JSON, pas besoin de le parser à nouveau
        return restaurant.value.schedule as Schedule;
    } catch (e) {
        console.error('Error parsing schedule:', e);
        return null;
    }
});

// Fonction pour capitaliser la première lettre du jour
const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
const daysOrder = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const orderedSchedule = computed(() => {
    if (!parsedSchedule.value) {
        return [];
    }

    return daysOrder
        .map(day => [day, parsedSchedule.value![day]])
        .filter(([day, hours]) => hours);
});
const daysOfWeek = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const availableTimes = computed(() => {
    if (!restaurant.value?.schedule || !reservationDate.value) {
        return [];
    }

    const date = new Date(reservationDate.value);
    const dayOfWeek = daysOfWeek[date.getDay()]; // Récupérer le jour de la semaine

    const schedule = restaurant.value.schedule as Schedule;
    const daySchedule = schedule[dayOfWeek];

    if (!daySchedule || daySchedule[0] === 'fermé') {
        return []; // Si le restaurant est fermé ce jour-là, retourner un tableau vide
    }

    const [openingTime, closingTime] = daySchedule;

    const times: string[] = [];
    let [openingHour, openingMinute] = openingTime.split(':').map(Number);
    let [closingHour, closingMinute] = closingTime.split(':').map(Number);

    let currentHour = openingHour;
    let currentMinute = openingMinute;

    while (currentHour < closingHour || (currentHour === closingHour && currentMinute < closingMinute)) {
        times.push(`${currentHour < 10 ? '0' : ''}${currentHour}:${currentMinute === 0 ? '00' : '30'}`);
        if (currentMinute === 0) {
            currentMinute = 30;
        } else {
            currentMinute = 0;
            currentHour += 1;
        }
    }

    return times;
});

const images = ref([]);

watchEffect(() => {
    if (files.value && files.value.length > 0) {
        images.value = files.value.map(file => ({
            src: `http://localhost:3333/${restaurantId}/${file}`,
            alt: restaurant.value ? restaurant.value.name : 'Restaurant image'
        }));
    }
});

interface User {
    firstName: String;
    lastName: String;
}

interface Comment {
    comment: string;
    rating: number;
    createdAt: string;
    user: User;
}

const comments = ref<Comment[]>([]);
const totalRating = ref<number | undefined>(undefined);
let currentPage: number = 1;
let totalPages: number = 1;

const getComments = async (restaurantId: number) => {
    try {
        const response = await fetchReviewsByRestaurantId(restaurantId);
        if (Array.isArray(response)) {
            comments.value = response;
        } else {
            comments.value = [response];
        }
        calculateTotalRating();
    } catch (e) {
        console.error('Error getting comments:', e);
    }
};
const calculateTotalRating = () => {
    if (comments.value.length === 0) {
        totalRating.value = undefined;
        return;
    }

    const sum = comments.value.reduce((total, comment) => total + comment.rating, 0);
    const average = sum / comments.value.length;
    totalRating.value = parseFloat(average.toFixed(2)); // Arrondir à 2 décimales
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
            const restaurantId = parseInt(route.params.id, 10);
            getComments(restaurantId);
        }
    }
};

const commentContainerRef = ref<HTMLElement | null>(null);

onMounted(() => {
    const restaurantId = parseInt(route.params.id, 10);
    getComments(restaurantId);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    checkAuth();
});

const rating = ref<number | null>(null);
const comment = ref<string>('');
const errorMessage = ref<string | null>(null);

const submitReview = async () => {
    if (rating.value === null) {
        errorMessage.value = 'Veuillez sélectionner une évaluation.';
        return;
    }

    if (!comment.value.trim()) {
        errorMessage.value = 'Veuillez entrer un commentaire.';
        return;
    }
    const userId = parseInt(route.params.id, 10);

    const review = {
        userId,
        restaurantId,
        rating: rating.value,
        comment: comment.value,
    };

    try {
        await addReview(restaurantId, review);
        rating.value = null;
        comment.value = '';
        errorMessage.value = null;
        getComments(parseInt(route.params.id, 10));

        await getComments(restaurantId);

        if (totalRating.value !== undefined && totalRating.value !== null) {
            await updateRestaurantRating(restaurantId, totalRating.value);
            console.log(`Restaurant rating updated to ${totalRating.value}`);
        }
    } catch (e) {
        console.error('Error adding review:', e);
        errorMessage.value = 'Erreur lors de l\'ajout de l\'avis.';
    }
};


const dialogVisible = ref(false)

const popup = (time: string) => {

    dialogVisible.value = true
    arrivalTime.value = time

};
const isMobile = ref(false);

const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 768;
};
const handleMobileReservation = () => {
    dialogVisible.value = true;
};

watchEffect(() => {
    if (isMobile.value && arrivalTime.value) {
        // show the button when the time is selected on mobile
        handleMobileReservation();
    }
});
const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]*$/;
const lastName = ref('');
watch(lastName, (newValue, oldValue) => {
    if (!nameRegex.test(newValue)) {
        lastName.value = oldValue;
        nextTick(() => {
            ElMessage({
                type: 'error',
                showClose: true,
                grouping: true,
                message: 'Veuillez rentrer des caractères valides.',
            });
        });
    }
});

const emailRegex = /^[a-zA-Z0-9@._-]*$/;
const email = ref('');
watch(email, (newValue, oldValue) => {
    if (!emailRegex.test(newValue)) {
        email.value = oldValue;
        nextTick(() => {
            ElMessage({
                type: 'error',
                showClose: true,
                grouping: true,
                message: 'Veuillez rentrer des caractères valides.',
            });
        });
    }
});

const fidelity = ref(null)

const handleSubmitBooking = async () => {
    if (!reservationDate.value) {
        console.error('Reservation date is required.');
        return;
    }

    const selectedDate = new Date(reservationDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Pour comparer seulement la date

    const [reservationHour, reservationMinute] = arrivalTime.value.split(':').map(Number);
    if (selectedDate.getDate() === today.getDate() && selectedDate.getMonth() === today.getMonth()) {
        const now = new Date();
        if (reservationHour < now.getHours() || (reservationHour === now.getHours() && reservationMinute <= now.getMinutes())) {
            console.error('Reservation time must be in the future.');
            return;
        }
    }

    const dateTime = `${reservationDate.value} ${arrivalTime.value}`;
    bookingParams.value.specialRequest = specialRequest.value;

    const booking = {
        restaurant_id: parseInt(route.params.id, 10),
        date_time: dateTime,
        number_people: numberOfPersons.value,
        comment: bookingParams.value,
        fidelity: parseInt(fidelity.value)
    };

    try {
        await addBooking(booking);
        console.log('Booking added successfully');
        dialogVisible.value = false;
    } catch (error) {
        console.error('Error adding booking:', error);
    }
};

</script>

<template>
    <div class="restaurant-page">
        <div class="restaurant_suggestion">
            <header>
                <h1>{{ restaurant?.name }}</h1>
            </header>
            <section class="restaurant-info">
                <el-rate v-model="totalRating" size="large" disabled show-score :colors=colors text-color="#6e8b3d"
                    score-template="{value} points" />
                <div class="info-row">
                    <p><strong>Horaires:</strong></p>
                    <ul v-if="orderedSchedule.length">
                        <li v-for="([day, hours]) in orderedSchedule" :key="String(day)">
                            <strong>{{ capitalize(String(day)) }}:</strong> {{ hours[0] }} - {{ hours[1] }}
                        </li>
                    </ul>
                    <p v-else>Aucun horaire disponible.</p>
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
                                    <option value="6">6 personnes</option>
                                    <option value="7">7 personnes</option>
                                    <option value="8">8 personnes</option>
                                    <option value="9">9 personnes</option>
                                    <option value="10">10 personnes</option>
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

                            <select class="show-reservation-select" v-model="arrivalTime">
                                <option v-for="time in availableTimes" :key="time" :value="time">
                                    {{ time }}
                                </option>
                            </select>

                        </div>
                        <div class="reservation-button" v-if="!isMobile">
                            <button v-for="time in availableTimes" :key="time" @click=popup(time)>
                                {{ time }}
                            </button>
                        </div>
                    </div>
                    <div class="info-supp ">
                        <h3>Informations supplémentaires</h3>
                        <div class="info-column">
                            <p><strong>Adresse:</strong> {{ restaurant?.address }}</p>
                            <p><strong>Téléphone:</strong> {{ restaurant?.phone }}</p>
                            <p><strong>Prix:</strong> {{ restaurant?.price }}</p>
                            <p><strong>Cuisines:</strong> {{ restaurant?.cookingType }}</p>
                            <p><strong>Animaux accepté:</strong> {{ animalAccepted }}</p>
                            <p><strong>Terrasse:</strong> {{ terrace }}</p>
                            <p><strong>Payements autorisés:</strong> {{ payments.join(', ') }}</p>
                            <div style="display: flex; width: 100%;">
                                <a v-if="restaurant?.facebook" :href="restaurant.facebook" target="_blank"
                                    rel="noopener noreferrer">
                                    <img src="/public/pictures/facebook.png" alt="facebook"
                                        style="width: 30px; margin: 10px;">
                                </a>
                                <a v-if="restaurant?.instagram" :href="restaurant.instagram" target="_blank"
                                    rel="noopener noreferrer">
                                    <img src="/public/pictures/instagram.png" alt="instagram"
                                        style="width: 30px; margin: 10px;">
                                </a>
                                <a v-if="restaurant?.web" :href="restaurant.web" target="_blank"
                                    rel="noopener noreferrer">
                                    <img src="/public/pictures/website.png" alt="website"
                                        style="width: 30px; margin: 10px;">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-map">
                    <div class="carousel">
                        <div class="block text-center">
                            <el-carousel class="custom-carousel" height="341.6px" motion-blur :autoplay="false">
                                <el-carousel-item v-for="(image, index) in images" :key="index">
                                    <img :src="image.src" :alt="image.alt" class="carousel-image">
                                    <h3 class="small justify-center" text="2xl">{{ index }}</h3>
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                    <div class="map-container">
                        <LMap v-if="coordinates" :zoom="16" :center="[coordinates.lat, coordinates.lon]">
                            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="&amp;copy; OpenStreetMap contributors" />
                            <LMarker :lat-lng="[coordinates.lat, coordinates.lon]">
                                <LTooltip>{{ restaurant?.name }}</LTooltip>
                            </LMarker>
                        </LMap>
                    </div>
                </div>
            </div>
        </div>
        <h2>Suggestion d' autres établissements</h2>
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
                <el-rate v-model="totalRating" size="large" disabled show-score :colors="colors" text-color="#6e8b3d"
                    score-template="{value} points" />
                <span>({{ comments.length }})</span>
                <div class="rating-customer">
                    <h3>Commentaires des clients</h3>
                    <div class="comment-container" ref="commentContainer" @scroll="checkScroll">
                        <ul>
                            <li v-for="(comment, index) in comments" :key="index">
                                <p>{{ comment.comment }}</p>
                                <p>Note: {{ comment.rating }}<span>★</span> | {{ comment.user.firstName }} {{
                    comment.user.lastName }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="comments">
                <div v-if="isAuthenticated">
                    <form @submit.prevent="submitReview">
                        <div class="rate-all">
                            <h3>Donnez votre avis</h3>
                            <div class="rate-rating">
                                <label for="rating">Évaluation:</label>
                                <select id="rating" v-model="rating">
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
                                <textarea style="padding:3px;" id="comment" v-model="comment"></textarea>
                            </div>
                            <button type="submit">Envoyer</button>
                            <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
                        </div>
                    </form>
                </div>
                <div v-else>
                    <el-button type="success" round @click="redirectToLogin">Connectez-vous pour
                        laisser un
                        avis</el-button>
                </div>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" title="Réservation" width="500">
            <p>Résumé de la réservation : {{ numberOfPersons }} personne(s) | {{ reservationDate
                }} | {{ arrivalTime }}
            </p>
            <label v-if="terrace === 'oui'"><input type="checkbox" name="option1" v-model="bookingParams.terrace">
                Terrasse</label> <br>
            <label v-if="animalAccepted === 'oui'"><input type="checkbox" name="option2" v-model="bookingParams.animal">
                Chien</label>
            <p>Demande(s) particulièr soe(s)</p>
            <textarea v-model="specialRequest" style="resize:none; width: 100%; height: 50px; padding:5px;"></textarea>
            <p>Choisir une réduction*</p>
            <select id="fidelity" v-model="fidelity" style="height:20px; width:250px;">
                <option selected value="0">Pas de réduction</option>
                <option value="100">utiliser 100 points (5% de réduction)</option>
                <option value="200">utiliser 200 points (10% de réduction)</option>
                <option value="500">utiliser 500 points (5% de réduction)</option>
            </select>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="handleSubmitBooking">
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

.info-row ul {
    display: flex;
    flex-wrap: wrap;
    /* Si vous voulez qu'il passe à la ligne suivante quand il y a trop d'éléments */
    list-style: none;
    padding: 0;
    margin: 0;
}

.info-row li {
    margin-right: 10px;
}

.info-row li.schedule-item {
    margin: 10px;
    /* Espace entre les éléments */
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

.carousel-image {
    width: 100%;
    height: 341.6px;
    object-fit: cover;
}

.demonstration {
    color: var(--el-text-color-secondary);
}

.custom-carousel {
    width: 683px;
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

.show-reservation-select {
    display: none;
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
    padding: 25px;
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
    padding: 25px;
    margin: 20px;
    border: 1px solid #ddd;
    background-color: white;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
    height: 300px;
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
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

.rate-all h3 {
    margin-bottom: 20px;
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

@media (max-width: 868px) {
    .restaurant-page {
        padding: 10px;
    }

    header {
        padding-left: 10px;
        text-align: center;
    }

    .restaurant-info,
    .info-supp,
    .reservation-square,
    .notes,
    .comments {
        width: 90%;
        padding: 10px;
        margin: 10px;
        height: auto;

    }

    .reservation-carousel {
        display: block;
    }

    .carousel-map {
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 20px;
    }

    .carousel {
        width: 100%;
    }

    .map-container {
        width: 100%;
    }

    .reservation-data {
        flex-direction: column;
        align-items: center;
    }

    .reservation-button {
        display: none;
    }

    .show-reservation-select {
        display: block;
        width: 80%;
        background-color: #6e8b3d;
        color: white;
        border: none;
        text-align: center;
        margin: 10px;
    }

    .reservation-button {
        height: auto;
        width: 100%;
    }

    .reservation-button button {
        width: 80%;
    }

    .custom-carousel {
        width: 100%;
    }

    .map-container {
        width: 100%;
    }

    .resultContainer {
        flex-direction: column;
        align-items: center;
    }

    .restaurant {
        width: auto;
        margin: 10px 0;
    }

    .notes-comments {
        flex-direction: column;
        align-items: center;
    }

    .notes,
    .comments {
        width: 90%;
        height: auto;
    }

    .comment-container {
        height: auto;
        max-height: 200px;
    }

    .progress-bar-container {
        width: 35px;
        height: 15px;
        background-color: #ccc;
        margin-right: 15px;
    }

    .progress-bar {
        height: 100%;
        background-color: #6e8b3d;
        /* Couleur de la partie remplie de la barre */
    }

    .form-group {
        margin: 10px;
        width: 200px;
        height: 150px;

    }

    .form-group input {
        width: 150px;
        height: 40px;
        margin: 10px;

    }
}
</style>

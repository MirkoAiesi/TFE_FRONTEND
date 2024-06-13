<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { fetchAllRestaurants, updateRestaurantStatus, deleteRestaurantByAdmin } from '../services/userService';

interface Restaurant {
    id: number;
    name: string;
    owner_id: number;
    address: string;
    desc: string;
    options: string;
    status: number;
    phone: string;
    cookingType: string;
    price: string;
    cultery: number;
    schedule: object;
    cut_time: string;
    vacancy: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
}

const restaurants = ref<Restaurant[]>([]);
const selectedRestaurant = ref<Restaurant | null>(null);
const dialogVisible = ref(false);

const fetchData = async () => {
    try {
        const data = await fetchAllRestaurants();
        restaurants.value = data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
    }
};

onMounted(fetchData);

const pendingRestaurants = computed(() => {
    return restaurants.value.filter(restaurant => restaurant.status === 10);
});

const animalAccepted = ref<string | null>(null);
const terrace = ref<string | null>(null);
const payments = ref<string[]>([]);

const popup = (restaurant: Restaurant) => {
    selectedRestaurant.value = restaurant;
    dialogVisible.value = true;

    const optionsArray = restaurant.options.split(',').map(option => option.trim());
    animalAccepted.value = optionsArray[0] || null;
    terrace.value = optionsArray[1] || null;
    payments.value = optionsArray.slice(2) || [];
};

const confirmRestaurant = async (id: number) => {
    try {
        await updateRestaurantStatus(id, 1);
        fetchData();
        dialogVisible.value = false;
    } catch (error) {
        console.error('Error confirming restaurant:', error);
    }
};

const rejectRestaurant = async (id: number) => {
    try {
        await deleteRestaurantByAdmin(id);
        fetchData();
        dialogVisible.value = false;
    } catch (error) {
        console.error('Error rejecting restaurant:', error);
    }
};
interface Schedule {
    [day: string]: [string, string];
}

const parsedSchedule = computed<Schedule | null>(() => {
    try {
        if (!selectedRestaurant.value?.schedule) {
            return null;
        }
        return selectedRestaurant.value.schedule as Schedule;
    } catch (e) {
        console.error('Error parsing schedule:', e);
        return null;
    }
});

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
</script>

<template>
    <div class="container orders">
        <h4 style="margin-bottom:15px;">Restaurants en attente de validation :</h4>
        <el-table :data="pendingRestaurants" style="width: 100%">
            <el-table-column label="Nom" prop="name" />
            <el-table-column label="Adresse" prop="address" />
            <el-table-column label="Téléphone" prop="phone" />
            <el-table-column label="Cuisine" prop="cookingType" />
            <el-table-column label="Prix" prop="price" />
            <el-table-column label="Capacité" prop="cultery" />
            <el-table-column align="right">
                <template #default="scope">
                    <el-button size="small" type="success" @click="() => popup(scope.row)">
                        Confirmer
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" title="Détails de la demande" width="500px">
            <p>Nom du restaurant : {{ selectedRestaurant?.name }}</p>
            <p>Adresse : {{ selectedRestaurant?.address }}</p>
            <p>Téléphone : {{ selectedRestaurant?.phone }}</p>
            <p>Type de cuisine : {{ selectedRestaurant?.cookingType }}</p>
            <p>Prix : {{ selectedRestaurant?.price }}</p>
            <p>Capacité : {{ selectedRestaurant?.cultery }} personnes</p>
            <p>Terrasse : {{ terrace }}</p>
            <p>Animaux acceptés : {{ animalAccepted }}</p>
            <p>Type(s) de paiement accepté(s) : {{ payments.join(', ') }}</p>
            <ul v-if="orderedSchedule.length" style="list-style-type: none; padding-left: 0;">
                <li v-for="([day, hours]) in orderedSchedule" :key="String(day)">
                    <strong>{{ capitalize(String(day)) }}:</strong> {{ hours[0] }} - {{ hours[1] }}
                </li>
            </ul>
            <p v-else>Aucun horaire disponible.</p>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="rejectRestaurant(selectedRestaurant?.id)">Refuser</el-button>
                    <el-button type="primary" @click="confirmRestaurant(selectedRestaurant?.id)">Confirmer</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

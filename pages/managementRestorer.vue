<script lang="ts" setup>
import { ref, watch } from "vue";
import { definePageMeta } from '#imports';
import { useRestaurantStore } from '../services/restaurantStore';

definePageMeta({
    middleware: 'info-restaurant'
})
const currentView = ref("orders");

function setCurrentView(view) {
    currentView.value = view;
}
const { restaurant } = useRestaurantStore();

const animalAccepted = ref<string | null>(null);
const terrace = ref<string | null>(null);
const payments = ref<string[]>([]);

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
    { immediate: true }
);

interface Schedule {
    [day: string]: [string, string];
}

const parsedSchedule = computed<Schedule | null>(() => {
    try {
        if (!restaurant.value?.schedule) {
            return null;
        }
        return restaurant.value.schedule as Schedule;
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
    <div class="profile">
        <div class="center">
            <div class="profileHeader">
                <div class="container userInfo">
                    <h3>Informations générales</h3>
                    <div class="mainInfo">
                        <div class="container-mainInfo">
                            <p>{{ restaurant?.name }}</p>
                            <p>{{ restaurant?.address }}</p>
                            <p>{{ restaurant?.phone }}</p>
                            <p> Prix : {{ restaurant?.price }}</p>
                            <p> Cuisine : {{ restaurant?.cookingType }}</p>
                            <p> Nombre de couverts : {{ restaurant?.cultery }}</p>
                        </div>
                        <div class="container-mainInfo">
                            <p>Inscrit le : 10:55 23-04-24</p>
                            <div class="info-row">
                                <ul v-if="orderedSchedule.length">
                                    <li v-for="([day, hours]) in orderedSchedule" :key="String(day)">
                                        <strong>{{ capitalize(String(day)) }}:</strong> {{ hours[0] }} - {{ hours[1] }}
                                    </li>
                                </ul>
                                <p v-else>Aucun horaire disponible.</p>
                            </div>
                            <p>Chien : {{ animalAccepted }}</p>
                            <p>Terrasse : {{ terrace }}</p>
                            <p>Payements autorisés : {{ payments.join(', ') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <section>
                <div class="container paramsSelection">
                    <p :class="{ activeParams: currentView === 'restorer' }" @click="setCurrentView('restorer')">
                        Réservations
                    </p>
                    <p :class="{ activeParams: currentView === 'history' }" @click="setCurrentView('history')">
                        Historique des réservations
                    </p>
                    <p :class="{ activeParams: currentView === 'upload' }" @click="setCurrentView('upload')">
                        Ajouter des images
                    </p>
                    <p :class="{ activeParams: currentView === 'social' }" @click="setCurrentView('social')">
                        Réseaux sociaux
                    </p>
                    <p :class="{ activeParams: currentView === 'settings' }" @click="setCurrentView('settings')">
                        Paramètres
                    </p>
                    <p :class="{ activeParams: currentView === 'upgrade' }" @click="setCurrentView('upgrade')">
                        Gérer mon abonnement
                    </p>

                </div>
                <BookingRestorer v-if="currentView === 'restorer'" />
                <HistoryRestorer v-if="currentView === 'history'" />
                <RestorerParams v-if="currentView === 'settings'" />
                <Social v-if="currentView === 'social'" />
                <UploadImg v-if="currentView === 'upload'" />
                <UpgradeUser v-if="currentView === 'upgrade'" />
            </section>
        </div>
    </div>
</template>

<style>
.payement-container {
    display: flex;
    justify-content: center;
    margin: 10px;
}

.payement {
    margin: 15px;
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
}

.info-row ul {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;
}

.info-row li {
    margin-right: 10px;
    font-size: 18px;
}

.info-row li.schedule-item {
    margin: 10px;
}
</style>

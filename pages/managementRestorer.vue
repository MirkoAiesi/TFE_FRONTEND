<script setup>
import { ref } from "vue";

const currentView = ref("orders");

function setCurrentView(view) {
    currentView.value = view;
}
const restaurant = ref({
    name: "Beaumongrill",
    phoneNumber: "0123456789",
    address: "123 Rue du Restaurant, Ville",
    openingHours: "Mardi-Vendredi: 12h00-15h00 et 17h30-22h / Samedi-Dimanche: 12h00 - 23h00",
    price: "€-€€",
    cooking: "Française",
    pet: "non",
    terrace: "oui",
    payement: "VISA, MASTERCARD, MAESTRO",
    cultery: "35"


})
</script>

<template>
    <div class="profile">
        <div class="center">
            <div class="profileHeader">
                <div class="container userInfo">
                    <h3>Informations générales</h3>
                    <div class="mainInfo">
                        <div>
                            <p>{{ restaurant.name }}</p>
                            <p>{{ restaurant.address }}</p>
                            <p>{{ restaurant.phoneNumber }}</p>
                            <p> Prix : {{ restaurant.price }}</p>
                            <p> Cuisine : {{ restaurant.cooking }}</p>
                            <p> Nombre de couverts : {{ restaurant.cultery }}</p>
                        </div>
                        <div>
                            <p>Inscrit le : 10:55 23-04-24</p>
                            <p>{{ restaurant.openingHours }}</p>
                            <p>Chien : {{ restaurant.pet }}</p>
                            <p>Terrasse : {{ restaurant.terrace }}</p>
                            <p>Payements autorisés : {{ restaurant.payement }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <section>
                <div class="container paramsSelection">
                    <p :class="{ activeParams: currentView === 'restorer' }" @click="setCurrentView('restorer')">
                        Réservations
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
                <RestorerParams v-if="currentView === 'settings'" />
                <Social v-if="currentView === 'social'" />
                <UploadImg v-if="currentView === 'upload'" />
                <UpgradeUser v-if="currentView === 'upgrade'" />
            </section>
        </div>
    </div>
</template>

<style>
.profile {
    height: 110vh;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.center {
    width: 100%;
    max-width: 1100px;
    height: 100%;
}

.profileHeader {
    display: flex;
    width: 100%;
}

section {
    height: 60%;
    display: flex;

}

.profileHeader .userInfo {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}

.profileHeader .userInfo h3 {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
}

.profileHeader p {
    font-size: 18px;
    margin-top: 10px;
}

.userInfo .mainInfo {
    display: flex;
}

.mainInfo>div:nth-child(2) {
    margin-left: 50px;
}

.paramsSelection {
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 35%;
    height: 100%;
}

.paramsSelection p {
    font-size: 16px;
    margin: 5px;
    cursor: pointer;
    padding: 5px;
    border-radius: 8px;
}

.paramsSelection .activeParams {
    color: white;
    background-color: #6e8b3d;
}

.paramsSelection p:hover {
    color: white;
    background-color: #6e8b3d;
}

.orders {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;

}

.orders .title {
    display: flex;
    width: 100%;
    margin-top: 20px;
}

.orders .title p {
    width: 33%;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
}

.orders h3 {
    font-size: 24px;
    font-weight: 500;
    text-align: center;
}

.orderList {
    overflow-y: auto;
    height: 100%;
    scrollbar-color: gray lightgray;
    scrollbar-width: thin;
}

.order {
    display: flex;
    cursor: pointer;
    padding: 5px 0;
    margin: 5px 0;
    border-radius: 8px;
}

.order:hover {
    background-color: #6e8b3d;
    color: white;
}

.order p {
    font-size: 18px;
    width: 33%;
    text-align: center;
}

.payement-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
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
</style>

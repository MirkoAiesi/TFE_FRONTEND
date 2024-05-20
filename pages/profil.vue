<script setup>
import { ref, onMounted, watch } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { fetchUserInfo } from "../services/userService"; // Assurez-vous que ce chemin est correct
import eventBus from '../services/eventBus'; // Importez l'EventBus

const router = useRouter();
const currentView = ref("orders");

function setCurrentView(view) {
    currentView.value = view;
}

const disconnect = () => {
    Cookies.remove('authBR');
    router.push('/auth/login');
}

const userInfo = ref({
    firstName: '',
    lastName: '',
    email: '',
    createdAt: ''
});

const loadUserInfo = async () => {
    try {
        const data = await fetchUserInfo();
        console.log('Fetched user info:', data);
        userInfo.value = data;
    } catch (error) {
        console.error('Failed to load user info:', error);
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.substring(0, 10); // Prendre les 10 premiers caractères de la chaîne
};

watch(() => eventBus.updatedProfile, (newProfile) => {
    if (newProfile) {
        userInfo.value.firstName = newProfile.firstName;
        userInfo.value.lastName = newProfile.lastName;
    }
});

onMounted(() => {
    loadUserInfo();
});
</script>

<template>
    <div class="profile">
        <div class="center">
            <div class="profileHeader">
                <div class="container">
                    <img src="" alt="profile image" />
                </div>
                <div class="container userInfo">
                    <h3>Informations générales</h3>
                    <div class="mainInfo">
                        <div>
                            <p>Nom: {{ userInfo.lastName }}</p>
                            <p>Prénom: {{ userInfo.firstName }}</p>
                            <p>Adresse mail: {{ userInfo.email }}</p>
                        </div>
                        <div>
                            <p>Inscrit le: {{ formatDate(userInfo.createdAt) }}</p>
                        </div>
                    </div>
                    <NuxtLink v-if="userInfo.id === 2" class="adminButton" to="../admin">
                        <el-button type="primary" round>Administration</el-button>
                    </NuxtLink>
                    <el-button @click="disconnect" class="disconnect" type="danger" size="large"
                        round>Déconnexion</el-button>
                </div>
            </div>
            <section>
                <div class="container paramsSelection">
                    <p :class="{ activeParams: currentView === 'orders' }" @click="setCurrentView('orders')">Mes
                        réservations</p>
                    <p :class="{ activeParams: currentView === 'history' }" @click="setCurrentView('history')">
                        Historique des réservations</p>
                    <p :class="{ activeParams: currentView === 'comment' }" @click="setCurrentView('comment')">
                        Historique des commentaires</p>
                    <p :class="{ activeParams: currentView === 'settings' }" @click="setCurrentView('settings')">
                        Paramètres</p>
                </div>
                <BookingList v-if="currentView === 'orders'" />
                <HistoryList v-if="currentView === 'history'" />
                <HistoryComment v-if="currentView === 'comment'" />
                <UserParams v-if="currentView === 'settings'" />
            </section>
        </div>
    </div>
</template>

<style>
.profile {
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
}

.center {
    width: 100%;
    max-width: 1100px;
    height: 100%;
}

.container {
    display: flex;
    justify-content: center;
    padding: 25px;
    border-radius: 8px;
    -webkit-box-shadow: inset 0px 0px 15px 0px rgba(110, 139, 61, 0.5);
    -moz-box-shadow: inset 0px 0px 15px 0px rgba(110, 139, 61, 0.5);
    box-shadow: inset 0px 0px 15px 0px rgba(110, 139, 61, 0.5);
    margin: 10px;
    width: fit-content;
}

.container img {
    width: 150px;
    height: 150px;
    border-radius: 8px;
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

.disconnect {
    position: absolute;
    right: 25px;
    bottom: 25px;
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

.adminButton {
    position: absolute;
    top: 25px;
    left: 25px;
}
</style>

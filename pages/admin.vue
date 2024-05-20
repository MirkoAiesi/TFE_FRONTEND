<script setup>
import { ref } from "vue";
const currentView = ref("orders");

function setCurrentView(view) {
    currentView.value = view;
}
</script>
<template>
    <div class="profile">
        <div class="center">
            <div class="profileHeader">

                <div class="container userInfo">
                    <NuxtLink style="text-align: center;" to="../profil">
                        <el-button type="primary" round>Compte</el-button>
                    </NuxtLink>
                </div>
            </div>
            <section>
                <div class="container paramsSelection">
                    <p :class="{ activeParams: currentView === 'restaurant' }" @click="setCurrentView('restaurant')">
                        Restaurants
                    </p>
                    <p :class="{ activeParams: currentView === 'review' }" @click="setCurrentView('review')">
                        Modération avis
                    </p>
                    <p :class="{ activeParams: currentView === 'settings' }" @click="setCurrentView('settings')">
                        Paramètres
                    </p>

                </div>
                <Review v-if="currentView === 'review'" />
                <UserParams v-if="currentView === 'settings'" />
                <RestaurantList v-if="currentView === 'restaurant'" />
            </section>
        </div>
    </div>
</template>
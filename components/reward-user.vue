<script lang="ts" setup>
import { ref } from 'vue';
import { fetchUserInfo } from "../services/userService";

const fidelity = ref(null)

const loadUserInfo = async () => {
    try {
        const data = await fetchUserInfo();
        console.log('Fetched user info:', data);
        fidelity.value = data.fidelity;
    } catch (error) {
        console.error('Failed to load user info:', error);
    }
};

onMounted(() => {
    loadUserInfo();
});
</script>

<template>
    <div class="container orders">
        <h3>Ici vous pouvez dépenser vos points accumulez grâce à vos réservations et à vos avis
            en utilisant BetterRestaurant.
        </h3>
        <br>
        <h4> Vous accumullez actuellement {{ fidelity }} point(s)</h4>
        <br>
        <h4> Pour rappel : </h4>
        <p>Une réservation = 20 points de fidélité</p>
        <p>Un avis sur un restaurant où vous avez mangé = 5 points de fidélité</p>
        <br>
        <p>Quand vous obtener 100 point lors de votre prochaine réservation vous pouvez décider de les dépenser pour
            avoir une réduction de 5% dans le restaurant</p>
        <br>
        <p>Quand vous obtener 200 point lors de votre prochaine réservation vous pouvez décider de les dépenser pour
            avoir une réduction de 10% dans le restaurant</p>
        <br>
        <p>Quand vous obtener 500 point lors de votre prochaine réservation vous pouvez décider de les dépenser pour
            avoir une réduction de 20% dans le restaurant</p>
    </div>
</template>

<style scoped>
@media (max-width: 868px) {
    .orders h3 {
        font-size: 14px;
    }

    p {
        font-size: 12px;
    }
}
</style>

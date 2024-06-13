<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { updateRestaurantSocialLinks } from '../services/userService';
import { useRestaurantStore } from '../services/restaurantStore';

const restaurantStore = useRestaurantStore();
const restaurant = restaurantStore.restaurant;

const facebook = ref('');
const instagram = ref('');
const web = ref('');

const updateSocialLinks = async () => {
    if (!restaurant) {
        console.error('Restaurant is not set');
        return;
    }

    try {
        await updateRestaurantSocialLinks(restaurant.value.id, {
            facebook: facebook.value,
            instagram: instagram.value,
            web: web.value
        });
    } catch (error) {
        console.error('Error updating social links:', error);
    }
};

onMounted(() => {
    if (restaurant.value) {
        facebook.value = restaurant.value.facebook || '';
        instagram.value = restaurant.value.instagram || '';
        web.value = restaurant.value.web || '';
    } else {
        console.error('Restaurant is not set on mount');
    }
});
</script>
<template>
    <div class="container orders">
        <h3>Ici vous pouvez renseigner les liens vers vos réseaux sociaux, ceux-ci seront affichés et cliquables sur
            votre page de restaurant</h3>
        <h4>Lien vers Facebook</h4>
        <input v-model="facebook" required type="text" name="facebook" id="facebook" />
        <h4>Lien vers Instagram</h4>
        <input v-model="instagram" required type="text" name="insta" id="instagram" />
        <h4>Lien vers votre site web</h4>
        <input v-model="web" required type="text" name="web" id="web" />
        <div class="container_btn">
            <el-button @click="updateSocialLinks" size="medium" class="btn-social" type="primary"
                round>Modifier</el-button>
        </div>
    </div>
</template>
<style scoped>
.container_btn {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.btn-social {
    margin-top: 10px;
    width: 33%;
}

div h4 {
    margin-top: 15px;
}

div input {
    padding: 5px;
    width: 80%;
    margin: 10px;
}

@media (max-width: 868px) {
    .orders h3 {
        font-size: 16px;
    }

    .orders h4 {
        font-size: 12px;
    }

    .btn-social {
        width: 30%;
        font-size: 12px;
    }
}
</style>
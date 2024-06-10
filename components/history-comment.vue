<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchReviewsByUserId, fetchUserInfo, deleteReview } from '../services/userService';

interface Review {
    id: number; // Ajoutez l'ID de l'avis pour pouvoir le supprimer
    userId: number;
    restaurantId: number;
    rating: number;
    comment: string;
}

const userId = ref<number | null>(null);
const reviews = ref<Review[]>([]);
const currentReview = ref<Review | null>(null);
const dialogVisible = ref(false);
const isLoading = ref(true);
const error = ref<string | null>(null);

const popup = (review: Review) => {
    dialogVisible.value = true;
    currentReview.value = review;
};

const truncateReview = (review: string) => {
    if (review.length > 60) {
        return review.substring(0, 60) + '...';
    }
    return review;
};

const handleDelete = async () => {
    if (!currentReview.value) return;

    try {
        await deleteReview(currentReview.value.id);
        reviews.value = reviews.value.filter(review => review.id !== currentReview.value!.id);
        dialogVisible.value = false;
    } catch (e) {
        error.value = 'Failed to delete review';
        console.error('Error:', e);
    }
};


onMounted(async () => {
    try {
        const user = await fetchUserInfo();
        userId.value = user.id;
        if (userId.value) {
            reviews.value = await fetchReviewsByUserId(userId.value);
        }
    } catch (e) {
        error.value = 'Failed to fetch authenticated user or reviews';
        console.error('Error:', e);
    } finally {
        isLoading.value = false;
    }
});
</script>
<template>
    <div class="container orders">
        <h4 style="margin-top:15px;">Modération des commentaires</h4>
        <el-table v-if="!isLoading && !error" :data="reviews" style="width: 100%">
            <el-table-column label="Restaurant" prop="restaurant_name" />
            <el-table-column label="étoiles" prop="rating" />
            <el-table-column label="Avis">
                <template #default="scope">
                    <span>{{ truncateReview(scope.row.comment) }}</span>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="popup(scope.row)">
                        Voir
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <el-dialog v-model="dialogVisible" title="Commentaire" width="500">
            <span>{{ currentReview?.comment }}</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="handleDelete">
                        Supprimer
                    </el-button>
                    <el-button @click="dialogVisible = false">
                        Annuler
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

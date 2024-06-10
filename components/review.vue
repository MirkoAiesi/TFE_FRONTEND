<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { fetchAllReviews, deleteReview } from '../services/userService';

interface Comment {
    id: number;
    userId: number;
    restaurantId: number;
    rating: number;
    comment: string;
    createdAt: string;
}

const reviews = ref<Comment[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
    try {
        reviews.value = await fetchAllReviews();
    } catch (e) {
        error.value = 'Failed to fetch reviews';
        console.error('Error:', e);
    } finally {
        isLoading.value = false;
    }
});
const dialogVisible = ref(false);
const currentReview = ref<Comment | null>(null);
const popup = (review: Comment) => {
    dialogVisible.value = true;
    currentReview.value = review;
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
</script>

<template>
    <div class="container orders">
        <h4 style="margin-top:15px;">Modération des commentaires</h4>
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
            <el-table :data="reviews" style="width: 100%">
                <el-table-column label="User ID" prop="userId" />
                <el-table-column label="Restaurant ID" prop="restaurantId" />
                <el-table-column label="Rating" prop="rating" />
                <el-table-column label="Comment">
                    <template #default="scope">
                        <span>{{ scope.row.comment }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Created At" prop="createdAt" />
                <el-table-column align="right">
                    <template #default="scope">
                        <el-button size="small" type="primary" @click="popup(scope.row)">
                            Voir
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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

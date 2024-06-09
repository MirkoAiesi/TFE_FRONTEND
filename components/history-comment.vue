<script lang="ts" setup>
import { ref, computed } from 'vue'

const currentReview = ref('');
const dialogVisible = ref(false)
const popup = (review: string) => {

    dialogVisible.value = true
    currentReview.value = review;

};
interface User {
    resto: string
    star: number
    review: string

}
const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search.value ||
            data.resto.toLowerCase().includes(search.value.toLowerCase())
    )
)
const tableData: User[] = [
    {

        resto: 'Beaumontgrill',
        star: 1,
        review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan tortor. Sed ullamcorper, elit ut bibendum viverra, justo purus consequat erat, id venenatis tortor eros at enim. Vivamus a libero ac nisi bibendum ultricies. Vivamus sit amet pulvinar nulla, in feugiat eros. Proin posuere leo at arcu accumsan, eu varius erat cursus.',

    },
    {
        resto: 'Lac bbc',
        star: 5,
        review: 'gourmand',

    },
]
const truncateReview = (review: string) => {
    if (review.length > 60) {
        return review.substring(0, 60) + '...';
    }
    return review;
};
</script>
<template>
    <div class="container orders">
        <h4 style="margin-top:15px;">Consultation des commentaires </h4>
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Restaurant" prop="resto" />
            <el-table-column label="étoiles" prop="star" />
            <el-table-column label="Avis">
                <template #default="scope">
                    <span>{{ truncateReview(scope.row.review) }}</span>
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Recherche restaurant" />
                </template>
                <template #default="scope">
                    <el-button size="small" type="primary" @click=popup(scope.row.review)>
                        Voir
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" title="Commentaire" width="500">
            <span>{{ currentReview }}</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="dialogVisible = false">
                        Supprimer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'

const dialogVisible = ref(false)
const selectedRestaurant = ref({
    name: "",
    address: "",
    phone: "",
    cooking: "",
    price: "",
    cutlery: "",
    terrace: "",
    dog: "",
    payement: "",
})
const popup = (row: Restaurant) => {

    dialogVisible.value = true
    selectedRestaurant.value.name = row.name
    selectedRestaurant.value.address = row.address
    selectedRestaurant.value.phone = row.phone
    selectedRestaurant.value.cooking = row.cooking
    selectedRestaurant.value.price = row.price
    selectedRestaurant.value.cutlery = row.cutlery
    selectedRestaurant.value.terrace = row.terrace
    selectedRestaurant.value.dog = row.dog
    selectedRestaurant.value.payement = row.payement
};

interface Restaurant {
    name: string
    address: string
    phone: string
    cooking: string
    price: string
    cutlery: string
    terrace: string
    dog: string
    payement: string
}

const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const tableData: Restaurant[] = [
    {
        name: 'Tom',
        address: 'Rue des veaux 12, 6500 Leugnies',
        phone: '071589107',
        cooking: 'Italienne',
        price: "€-€€",
        cutlery: "35 personnes",
        terrace: "oui",
        dog: "oui",
        payement: "Visa, Mastercard",
    },
    {
        name: 'John',
        address: 'Rue des veaux 12, 6500 Leugnies',
        phone: '071589107',
        cooking: 'Italienne',
        price: "€-€€",
        cutlery: "35 personnes",
        terrace: "non",
        dog: "oui",
        payement: "Visa, Mastercard",
    },
    {
        name: 'Morgan',
        address: 'Rue des veaux 12, 6500 Leugnies',
        phone: '071589107',
        cooking: 'Italienne',
        price: "€-€€",
        cutlery: "35 personnes",
        terrace: "non",
        dog: "oui",
        payement: "Visa, Mastercard",
    },
    {
        name: 'Jessy',
        address: 'Rue des veaux 12, 6500 Leugnies',
        phone: '071589107',
        cooking: 'Italienne',
        price: "€-€€",
        cutlery: "35 personnes",
        terrace: "oui",
        dog: "oui",
        payement: "Visa, Mastercard",
    },
]
</script>
<template>
    <div class="container orders">
        <h4 style="margin-bottom:15px;">Restaurants en attente de validation : </h4>
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Nom" prop="name" />
            <el-table-column label="Adresse" prop="address" />
            <el-table-column label="Téléphone" prop="phone" />
            <el-table-column label="Cuisine" prop="cooking" />
            <el-table-column label="Prix" prop="price" />
            <el-table-column label="Capacité" prop="cutlery" />
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Recherche restaurant" />
                </template>
                <template #default="scope">
                    <el-button size="small" type="success" @click=popup(scope.row)>
                        Confirmer
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" title="Détails de la demande" width="500">
            <p>Nom du restaurant : {{ selectedRestaurant.name }}</p>
            <p>Adresse : {{ selectedRestaurant.address }}</p>
            <p>Téléphone : {{ selectedRestaurant.phone }}</p>
            <p>Type de cuisine : {{ selectedRestaurant.cooking }}</p>
            <p>Prix : {{ selectedRestaurant.price }}</p>
            <p>Capacité : {{ selectedRestaurant.cutlery }}</p>
            <p>Terrasse : {{ selectedRestaurant.terrace }}</p>
            <p>Chien : {{ selectedRestaurant.dog }}</p>
            <p>Type(s) payement(s) accepté(s) : {{ selectedRestaurant.payement }}</p>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="dialogVisible = false">
                        Refuser
                    </el-button>
                    <el-button type="primary" @click="dialogVisible = false">
                        Confirmer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
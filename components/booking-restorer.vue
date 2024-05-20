<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElDatePicker } from 'element-plus';

const dialogVisible = ref(false)
const popup = () => {

    dialogVisible.value = true

};
const reservationDate = ref("21/04/2024")
const numberOfPersons = ref('2')
const arrivalTime = ref('12:00')

interface User {
    date: string
    name: string
    hour: string
    number: string
}

const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

const tableData: User[] = [
    {
        date: '2016-05-03',
        name: 'Tom',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-02',
        name: 'John',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-04',
        name: 'Morgan',
        hour: '12h',
        number: '2 personnes',
    },
]
</script>

<template>
    <div class="container orders">
        <h4>Reservation(s) en attente </h4>
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Date" prop="date" />
            <el-table-column label="Heure" prop="hour" />
            <el-table-column label="Nom" prop="name" />
            <el-table-column label="Couverts" prop="number" />
            <el-table-column align="right">
                <template #default="scope">
                    <el-button size="small" type="success" @click=popup()>
                        Confirmer
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <h4 style="margin-top:15px;">Reservation(s) confirmée(s) </h4>
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Date" prop="date" />
            <el-table-column label="Heure" prop="hour" />
            <el-table-column label="Nom" prop="name" />
            <el-table-column label="Couverts" prop="number" />
            <el-table-column align="right">
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" title="Tips" width="500">
            <p>Résumé de la réservation : {{ numberOfPersons }} personne(s) | {{ reservationDate }} | {{ arrivalTime }}
            </p>
            <label><input type="checkbox" name="option1"> Terrasse</label> <br>
            <label><input type="checkbox" name="option2"> Chien</label>
            <p>Demande(s) particulière(s)</p>
            <textarea style="resize:none; width: 100%; height: 50px;"></textarea>
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
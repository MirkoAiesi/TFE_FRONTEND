<script lang="ts" setup>
import { ref, computed } from 'vue'

const dialogVisible = ref(false)
const popup = () => {

    dialogVisible.value = true

};
const cancelBooking = ref(false)
const cancel = () => {

    cancelBooking.value = true

};
const reservationDate = ref("21/04/2024")
const numberOfPersons = ref('2')
const arrivalTime = ref('12:00')
interface User {
    date: string
    resto: string
    hour: string
    number: string
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
        date: '2016-05-03',
        resto: 'Tom',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-02',
        resto: 'John',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-04',
        resto: 'Morgan',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-01',
        resto: 'Jessy',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-03',
        resto: 'Tom',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-02',
        resto: 'John',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-04',
        resto: 'Morgan',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-01',
        resto: 'Jessy',
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
            <el-table-column label="Restaurant" prop="resto" />
            <el-table-column label="Couverts" prop="number" />
            <el-table-column align="right">
            </el-table-column>
        </el-table>
        <h4 style="margin-top:15px;">Reservation(s) confirmée(s) </h4>
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Date" prop="date" />
            <el-table-column label="Heure" prop="hour" />
            <el-table-column label="Restaurant" prop="resto" />
            <el-table-column label="Couverts" prop="number" />
            <el-table-column align="right">
                <template #default="scope">
                    <el-button size="small" type="danger" @click=cancel()>
                        Annuler
                    </el-button>
                </template>
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
        <el-dialog v-model="cancelBooking" width="500">
            <h3 style="font-size: 22px;"> Êtes-vous sur d'annuler la réservation ? </h3>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="cancelBooking = false">
                        Refuser
                    </el-button>
                    <el-button type="primary" @click="cancelBooking = false">
                        Confirmer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
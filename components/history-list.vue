<script lang="ts" setup>
import { ref, computed } from 'vue'

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
        resto: 'BeaumontGrill',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-02',
        resto: 'BeaumontGrill',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-04',
        resto: 'test',
        hour: '12h',
        number: '2 personnes',
    },
    {
        date: '2016-05-01',
        resto: 'BeaumontGrill',
        hour: '12h',
        number: '2 personnes',
    },
]
</script>

<template>
    <div class="container orders">
        <h4>Hisotriques des reservations </h4>
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="Date" prop="date" />
            <el-table-column label="Heure" prop="hour" />
            <el-table-column label="Restaurant" prop="resto" />
            <el-table-column label="Couverts" prop="number" />
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Type to search" />
                </template>
            </el-table-column>
        </el-table>


    </div>
</template>
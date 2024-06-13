<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { fetchBookingsByRestaurant } from '../services/userService'
import infoRestaurant from '../middleware/infoRestaurant'
import { useRestaurantStore } from '../services/restaurantStore'

interface BookingInfo {
    id: number;
    restaurantId: number;
    date_time: Date | string | null;
    comment: Record<string, any>;
    number_people: string;
    userId: number;
    status: number;
}

const bookingInfo = ref<BookingInfo[]>([]);
const restaurantId = ref<number | null>(null);

const normalizeBookingInfo = (data: any[]): BookingInfo[] => {
    return data.map(booking => ({
        ...booking,
        date_time: booking.date_time || booking.dateTime || null,
        number_people: booking.number_people || booking.numberPeople,
        comment: typeof booking.comment === 'string' ? JSON.parse(booking.comment) : booking.comment
    }));
};

const loadBookingInfo = async (restaurantId: number) => {
    try {
        const data = await fetchBookingsByRestaurant(restaurantId);
        console.log('Fetched booking info:', data);
        bookingInfo.value = normalizeBookingInfo(data);
    } catch (error) {
        console.error('Failed to load booking info:', error);
    }
};

onMounted(async () => {
    await infoRestaurant();
    const { restaurant } = useRestaurantStore();

    restaurantId.value = restaurant.value?.id || null;

    if (restaurantId.value) {
        await loadBookingInfo(restaurantId.value);
    }
});

const confirmedBookings = computed(() => bookingInfo.value.filter(booking => booking.status === 1 || booking.status === 2));

const formatBookingData = (bookings: BookingInfo[]): (BookingInfo & { date: string; time: string })[] => {
    return bookings.map(booking => {
        if (!booking.date_time) {
            console.error('date_time is undefined for booking:', booking);
            return {
                ...booking,
                date: '',
                time: ''
            };
        }

        const dateTime = typeof booking.date_time === 'string' ? new Date(booking.date_time) : booking.date_time;
        const isoString = dateTime.toISOString();
        return {
            ...booking,
            date: isoString.slice(0, 10),
            time: isoString.slice(11, 19)
        };
    });
};
const sortBookingsByDateDesc = (bookings: BookingInfo[]): BookingInfo[] => {
    return bookings.sort((a, b) => {
        const dateA = new Date(a.date_time as string).getTime();
        const dateB = new Date(b.date_time as string).getTime();
        return dateB - dateA;
    });
};
const formattedConfirmedBookings = computed(() => {
    const sortedBookings = sortBookingsByDateDesc(confirmedBookings.value);
    return formatBookingData(sortedBookings);
});

</script>

<template>
    <div class="container orders">
        <h4 style="margin-top:15px;">Historique des réservations </h4>
        <el-table :data="formattedConfirmedBookings" class="custom-table" style="width: 100%; height: 50%;">
            <el-table-column label="Date (aaaa/mm/jj)" prop="date" />
            <el-table-column label="Heure" prop="time" />
            <el-table-column label="Nom" prop="user_name" />
            <el-table-column label="Couverts" prop="number_people" />
            <el-table-column align="right">
                <template #default="scope">
                    <span v-if="scope.row.status === 2" class="cancelled-message">Annulé par le client</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<style scoped>
.comment-list {
    list-style-type: none;
}

.cancelled-message {
    color: red;
    font-weight: bold;
}
</style>
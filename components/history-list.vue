<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { fetchBookingsByUser, fetchUserInfo } from '../services/userService';

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
const userId = ref<number | null>(null);

const loadBookingInfo = async (id: number) => {
    try {
        const data = await fetchBookingsByUser(id);
        bookingInfo.value = normalizeBookingInfo(data);
    } catch (error) {
        console.error('Failed to load booking info:', error);
    }
};

const normalizeBookingInfo = (data: any[]): BookingInfo[] => {
    return data.map(booking => ({
        ...booking,
        date_time: booking.date_time || booking.dateTime || null,
        number_people: booking.number_people || booking.numberPeople,
        comment: typeof booking.comment === 'string' ? JSON.parse(booking.comment) : booking.comment,
    }));
};

onMounted(async () => {
    try {
        const user = await fetchUserInfo();
        userId.value = user.id;
        if (userId.value) {
            await loadBookingInfo(userId.value);
        }
    } catch (error) {
        console.error('Failed to fetch authenticated user:', error);
    }
});

const confirmedBookings = computed(() => {
    return bookingInfo.value.filter(booking => booking.status === 1 || booking.status === 2);
});

const sortBookingsByDateAsc = (bookings: BookingInfo[]): BookingInfo[] => {
    return bookings.sort((a, b) => {
        const dateA = new Date(a.date_time as string).getTime();
        const dateB = new Date(b.date_time as string).getTime();
        return dateA - dateB;
    });
};

const formatBookingData = (bookings: BookingInfo[]): (BookingInfo & { date: string; time: string })[] => {
    return bookings.map(booking => {
        if (!booking.date_time) {
            return {
                ...booking,
                date: '',
                time: '',
            };
        }

        const dateTime = typeof booking.date_time === 'string' ? new Date(booking.date_time) : booking.date_time;
        const isoString = dateTime.toISOString();
        return {
            ...booking,
            date: isoString.slice(0, 10),
            time: isoString.slice(11, 19),
        };
    });
};

const formattedConfirmedBookings = computed(() => {
    const sortedBookings = sortBookingsByDateAsc(confirmedBookings.value);
    return formatBookingData(sortedBookings);
});
</script>

<template>
    <div class="container orders">
        <h4 style="margin-top:15px;">Historique de réservations </h4>
        <el-table :data="formattedConfirmedBookings" style="width: 100%">
            <el-table-column label="Date (aaaa/mm/jj)" prop="date" />
            <el-table-column label="Heure" prop="time" />
            <el-table-column label="Restaurant" prop="restaurant_name" />
            <el-table-column label="Couverts" prop="number_people" />
        </el-table>
    </div>
</template>

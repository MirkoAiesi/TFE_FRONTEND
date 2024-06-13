<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { fetchBookingsByUser, fetchUserInfo, updateBookingStatusByUser } from '../services/userService';

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
const dialogVisible = ref(false);
const selectedBookingToCancel = ref<BookingInfo | null>(null);
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

const pendingBookings = computed(() => {
    return bookingInfo.value.filter(booking => booking.status === 0);
});

const confirmedBookings = computed(() => {
    return bookingInfo.value.filter(booking => booking.status === 1 || booking.status === 2);
});

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

const formattedPendingBookings = computed(() => {
    return formatBookingData(pendingBookings.value);
});

const formattedConfirmedBookings = computed(() => {
    return formatBookingData(confirmedBookings.value);
});

const popup = (booking: BookingInfo) => {
    selectedBookingToCancel.value = booking;
    dialogVisible.value = true;
};

const cancel = async () => {
    if (selectedBookingToCancel.value) {

        try {
            const response = await updateBookingStatusByUser(selectedBookingToCancel.value.id, 2);
            console.log('Response from updateBookingStatusByUser:', response);
            selectedBookingToCancel.value.status = 2;
            dialogVisible.value = false;

            if (userId.value) {
                await loadBookingInfo(userId.value);
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    } else {
        console.log('No booking selected for cancellation');
    }
};
</script>

<template>
    <div class="container orders">
        <h4>Réservation(s) en attente </h4>
        <el-table :data="formattedPendingBookings" style="width: 100%">
            <el-table-column label="Date (aaaa/mm/jj)" prop="date" />
            <el-table-column label="Heure" prop="time" />
            <el-table-column label="Restaurant" prop="restaurant_name" />
            <el-table-column label="Couverts" prop="number_people" />
        </el-table>
        <h4 style="margin-top:15px;">Réservation(s) confirmée(s) </h4>
        <el-table :data="formattedConfirmedBookings" style="width: 100%">
            <el-table-column label="Date" prop="date" />
            <el-table-column label="Heure" prop="time" />
            <el-table-column label="Restaurant" prop="restaurant_name" />
            <el-table-column label="Couverts" prop="number_people" />
            <el-table-column align="right">
                <template #default="scope">
                    <template v-if="scope.row.status === 2">
                        <span class="cancelled-message">Annulé</span>
                    </template>
                    <template v-else>
                        <el-button size="small" type="danger" @click="popup(scope.row)">
                            Annuler
                        </el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" width="500">
            <h3 style="font-size: 22px;"> Êtes-vous sur d'annuler la réservation ? </h3>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="dialogVisible = false">
                        Refuser
                    </el-button>
                    <el-button type="primary" @click="cancel">
                        Confirmer
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
<style scoped>
.cancelled-message {
    color: red;
    font-weight: bold;
}
</style>

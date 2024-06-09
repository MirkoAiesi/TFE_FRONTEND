<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { fetchBookingsByRestaurant, updateBookingStatus } from '../services/userService'
import infoRestaurant from '../middleware/checkRestaurant' // Assurez-vous que le chemin est correct
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
const selectedBooking = ref<BookingInfo | null>(null);
const restaurantId = ref<number | null>(null); // Initialiser restaurantId

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

const pendingBookings = computed(() => bookingInfo.value.filter(booking => booking.status === 0));
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

const formattedPendingBookings = computed(() => formatBookingData(pendingBookings.value));
const formattedConfirmedBookings = computed(() => formatBookingData(confirmedBookings.value));

const dialogVisible = ref(false);
const popup = (booking: BookingInfo) => {
    selectedBooking.value = booking;
    dialogVisible.value = true;
};

const confirmBooking = async () => {
    if (selectedBooking.value) {
        try {
            await updateBookingStatus(selectedBooking.value.id, 1);  // Appeler updateBookingStatus avec les paramètres appropriés
            selectedBooking.value.status = 1;  // Mettre à jour localement le statut de la réservation
            dialogVisible.value = false;
            // Recharger les données pour refléter les changements
            if (restaurantId.value) {
                await loadBookingInfo(restaurantId.value); // Assurez-vous de recharger les données avec le restaurantId
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    }
};

const formatComment = (comment: Record<string, any>): string[] => {
    const formatted: string[] = [];
    for (const [key, value] of Object.entries(comment)) {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (formattedKey === 'Animal' || formattedKey === 'Terrace') {
            formatted.push(`<strong>${formattedKey}</strong>: ${value ? 'oui' : 'non'}`);
        } else if (formattedKey === 'SpecialRequest') {
            formatted.push(`<strong>Demande particulière</strong>: ${value || 'Aucune'}`);
        }
    }
    return formatted;
};
</script>

<template>
    <div class="container orders">
        <h4>Reservation(s) en attente </h4>
        <el-table :data="formattedPendingBookings" style="width: 100%; height: 50%;">
            <el-table-column label="Date (aaaa/mm/jj)" prop="date" />
            <el-table-column label="Heure" prop="time" />
            <el-table-column label="Nom" prop="userId" />
            <el-table-column label="Couverts" prop="number_people" />
            <el-table-column align="right">
                <template #default="scope">
                    <el-button size="small" type="success" @click="popup(scope.row)">
                        Confirmer
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <h4 style="margin-top:15px;">Reservation(s) confirmée(s) </h4>
        <el-table :data="formattedConfirmedBookings" class="custom-table" style="width: 100%; height: 50%;">
            <el-table-column label="Date" prop="date" />
            <el-table-column label="Heure" prop="time" />
            <el-table-column label="Nom" prop="userId" />
            <el-table-column label="Couverts" prop="number_people" />
            <el-table-column align="right">
                <template #default="scope">
                    <span v-if="scope.row.status === 2" class="cancelled-message">Annulé par le client</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog v-model="dialogVisible" title="Confirmation de la réservation" width="500">
            <template v-if="selectedBooking">
                <p><strong>Date:</strong> {{ selectedBooking.date }}</p>
                <p><strong>Heure:</strong> {{ selectedBooking.time }}</p>
                <p><strong>Nom:</strong> {{ selectedBooking.userId }}</p>
                <p><strong>Couverts:</strong> {{ selectedBooking.number_people }}</p>
                <ul class="comment-list">
                    <li v-for="(item, index) in formatComment(selectedBooking.comment)" :key="index" v-html="item">
                    </li>
                </ul>
            </template>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="danger" @click="dialogVisible = false">
                        Refuser
                    </el-button>
                    <el-button type="primary" @click="confirmBooking">
                        Confirmer
                    </el-button>
                </div>
            </template>
        </el-dialog>
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
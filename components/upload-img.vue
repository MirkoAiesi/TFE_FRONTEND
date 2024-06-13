<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const restaurantId = ref<string | null>(null)

const fetchRestaurantId = async () => {
    const token = Cookies.get('authBR')

    if (!token) {
        console.error('No authentication token found')
        return
    }

    try {
        const response = await $fetch<{ id: string }>('http://localhost:3333/api/check/restaurant', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        restaurantId.value = response.id
    } catch (error) {
        console.error('Error fetching restaurant ID:', error)
    }
}

const handleRemove: UploadProps['onRemove'] = async (uploadFile, uploadFiles) => {
    if (!restaurantId.value) {
        console.error('Restaurant ID is not available')
        return
    }

    try {
        await $fetch(`http://localhost:3333/api/photos/${restaurantId.value}/${uploadFile.name}`, {
            method: 'DELETE',
        })
    } catch (error) {
        console.error('Error deleting photo:', error)
    }
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

const handleUpload = async () => {
    if (!restaurantId.value) {
        console.error('Restaurant ID is not available')
        return
    }

    const formData = new FormData()
    fileList.value.forEach((file) => {
        formData.append('photos', file.raw)
    })

    try {
        await $fetch(`http://localhost:3333/api/upload/photos/${restaurantId.value}`, {
            method: 'POST',
            body: formData,
        })
    } catch (error) {
        console.error('Error uploading photos:', error)
    }
}

const fetchPhotos = async () => {
    if (!restaurantId.value) {
        console.error('Restaurant ID is not available')
        return
    }

    try {
        const photos = await $fetch<string[]>(`http://localhost:3333/api/photos/${restaurantId.value}`)
        fileList.value = photos.map((url) => ({
            name: url.split('/').pop()!,
            url: "http://localhost:3333" + url,
            status: 'finished',
        }))
    } catch (error) {
        console.error('Error fetching photos:', error)
    }
}

onMounted(async () => {
    await fetchRestaurantId()
    if (restaurantId.value) {
        await fetchPhotos()
    }
})
</script>

<template>
    <div class="container orders">
        <h4 style="margin-bottom: 15px;">Nous vous recommandons d'ajouter des photos de l'extérieur de votre restaurant,
            de l'intérieur, et de votre menu !
        </h4>
        <el-upload v-model:file-list="fileList" list-type="picture-card" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
        <el-button type="primary" @click="handleUpload">Exporter les photos</el-button>

        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>

import Cookies from 'js-cookie';
import { navigateTo } from '#app';

export default async function () {
    const token = Cookies.get('authBR')

    if (!token) {
        return
    }

    try {
        const response = await $fetch(`http://localhost:3333/api/check/restaurant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response) {
            console.log(response)
            return navigateTo('/managementRestorer')

        }
    } catch (error) {
        console.error('Error checking restaurant:', error)
    }
}

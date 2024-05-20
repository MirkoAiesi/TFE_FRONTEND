import Cookies from "js-cookie";

export const addUser = async (user: Object) => {
  try {
    await $fetch("http://localhost:3333/api/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return true;
  } catch (e) {
    return e;
  }
};

export const login = async (user: Object) => {
  try {
    const response = await $fetch("http://localhost:3333/api/auth/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.token)
    Cookies.set('authBR', response.token, { expires: 30, secure: true });
  } catch (e) {
    return e;
  }
};

export const fetchUserInfo = async () => {
  try {
    const token = Cookies.get('authBR'); // Récupérer le token d'authentification depuis les cookies
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await $fetch('http://localhost:3333/api/profile', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ajouter le jeton d'authentification dans les headers
      },
    });

    return response;
  } catch (e) {
    console.error('Error fetching user info:', e);
    return e;
  }
};

export const modifyUserProfile = async (firstName: string, lastName: string) => {
  try {
    const token = Cookies.get('authBR'); // Récupérer le token d'authentification depuis les cookies
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Sending PATCH request to modify user profile'); // Log pour vérifier que la requête est envoyée
    const response = await $fetch('http://localhost:3333/api/profile/modify', {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ajouter le jeton d'authentification dans les headers
      },
      body: JSON.stringify({ first_name: firstName, last_name: lastName })
    });

    console.log('Profile modified response:', response); // Log pour vérifier la réponse
    return response;
  } catch (e) {
    console.error('Error modifying user profile:', e);
    throw e;
  }
};

export const modifyUserPassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
  try {
    const token = Cookies.get('authBR'); // Récupérer le token d'authentification depuis les cookies
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Sending PATCH request to modify user password');
    const response = await $fetch('http://localhost:3333/api/profile/modify/password', {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ajouter le jeton d'authentification dans les headers
      },
      body: JSON.stringify({
        password: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
    });

    console.log('Password modified response:', response);
    return response;
  } catch (e) {
    console.error('Error modifying user password:', e);
    throw e;
  }
};
import Cookies from 'js-cookie';

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

interface LoginResponse {
  token: string;
}

export const login = async (user: Object): Promise<LoginResponse> => {
  try {
    const response = await $fetch<LoginResponse>("http://localhost:3333/api/auth/login", {
      method: "POST",
      body: user,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.token) {
      Cookies.set('authBR', response.token, { expires: 30, secure: true });
      return response;
    } else {
      throw new Error('Login failed: Invalid response');
    }
  } catch (e: any) {
    throw new Error(e.data?.message || 'Erreur de connexion, vérifié votre email ou mot de passe');
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

    console.log(currentPassword);
    const response = await $fetch('http://localhost:3333/api/profile/modify/password', {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ajouter le jeton d'authentification dans les headers
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      })
    });
    Cookies.remove("authBR")
    navigateTo("/auth/login")
    console.log('Password modified response:', response);
    return response;
  } catch (e) {
    console.error('Error modifying user password:', e);
    throw e;
  }
};

export const fetchAllRestaurants = async () => {
  try {
    const response = await $fetch('http://localhost:3333/api/restaurants/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (e) {
    console.error('Error fetching restaurants:', e);
    throw e;
  }
};
export const addRestaurant = async (restaurant: Object) => {
  const token = Cookies.get('authBR');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    console.log('Sending restaurant data to server:', JSON.stringify(restaurant, null, 2));

    const response = await $fetch('http://localhost:3333/api/restaurants/add', {
      method: 'POST',
      body: restaurant,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('Response from server:', response);
    return response;
  } catch (e) {
    console.error('Error adding restaurant:', e);
    throw e;
  }
};
export const searchRestaurants = async (filter: Object) => {
  try {
    const response = await $fetch('http://localhost:3333/api/restaurants/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: filter
    });
    console.log(response)
    return response;
  } catch (e) {
    console.error('Error fetching restaurants:', e);
    throw e;
  }
};

export const fetchRestaurantById = async (id: number) => {
  try {
    const response = await $fetch(`http://localhost:3333/api/restaurants/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (e) {
    console.error('Error fetching restaurant:', e);
    throw e;
  }
};

export const updateRestaurantStatus = async (id: number, status: number) => {
  const token = Cookies.get('authBR');
  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log(`Updating restaurant status: ID=${id}, Status=${status}`); // Ajout de logs pour déboguer

  try {
    await $fetch(`http://localhost:3333/api/restaurants/update-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: { id, status },
    });
  } catch (e) {
    console.error('Error updating restaurant status:', e);
    throw e;
  }
};

interface Comment {
  id: number;
  userId: number;
  restaurantId: number;
  rating: number;
  comment: string;
  createdAt: string;
}
export const fetchReviewsByRestaurantId = async (restaurantId: number): Promise<Comment[] | Comment> => {
  try {
    const response = await $fetch<Comment[] | Comment>(`http://localhost:3333/api/reviews/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (e) {
    console.error('Error fetching reviews:', e);
    throw e;
  }
};

interface Review {
  userId: number;
  restaurantId: number;
  rating: number;
  comment: string;
}

export const addReview = async (restaurantId: number, review: Review) => {
  try {
    const token = Cookies.get('authBR'); // Récupérer le token d'authentification depuis les cookies
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await $fetch(`http://localhost:3333/api/reviews/create/${restaurantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Ajoutez l'en-tête Authorization
      },
      body: review,
    });

    console.log('Review added:', response);
    return response;
  } catch (e) {
    console.error('Error adding review:', e);
    throw e;
  }
};

interface Booking {
  restaurant_id: number,
  date_time: Date,
  comment: Object,
  number_people: string,
}


export const addBooking = async (booking: Booking) => {
  const token = Cookies.get('authBR'); // Récupérer le token d'authentification depuis les cookies
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    await $fetch(`http://localhost:3333/api/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Ajoutez l'en-tête Authorization
      },
      body: booking,
    });
  } catch (e) {
    console.error('Error adding booking:', e);
    throw e;
  }
}

export const fetchBookingsByRestaurant = async (restaurantId: number) => {
  const token = Cookies.get('authBR');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await $fetch(`http://localhost:3333/api/bookings/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (e) {
    console.error('Error fetching bookings:', e);
    throw e;
  }
};
export const fetchBookingsByUser = async (userId: number) => {
  const token = Cookies.get('authBR');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await $fetch(`http://localhost:3333/api/bookings/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response;
  } catch (e) {
    console.error('Error fetching bookings:', e);
    throw e;
  }
};
export const updateBookingStatus = async (id: number, status: number) => {
  const token = Cookies.get('authBR');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    await $fetch(`http://localhost:3333/api/bookings/update-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: { id, status },
    });
  } catch (e) {
    console.error('Error updating booking status:', e);
    throw e;
  }
};
export const updateBookingStatusByUser = async (id: number, status: number) => {
  const token = Cookies.get('authBR');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    console.log(`Updating booking status for user. ID ${id}, Status ${status}`);
    const response = await $fetch(`http://localhost:3333/api/bookings/user/update-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: { id, status },
    });
    console.log('Booking status update response:', response);
    return response;
  } catch (e) {
    console.error('Error updating booking status:', e);
    throw e;
  }
};
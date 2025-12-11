// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Set auth token
const setToken = (token) => localStorage.setItem('token', token);

// Remove auth token
const removeToken = () => localStorage.removeItem('token');

// Get current user
const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Set current user
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Remove current user
const removeUser = () => localStorage.removeItem('user');

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
const authAPI = {
    register: async (userData) => {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (data.success) {
            setToken(data.token);
            setUser(data.user);
        }
        return data;
    },

    login: async (credentials) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if (data.success) {
            setToken(data.token);
            setUser(data.user);
        }
        return data;
    },

    logout: () => {
        removeToken();
        removeUser();
        window.location.reload();
    },

    getProfile: async () => {
        return await apiRequest('/auth/profile');
    },

    updateProfile: async (userData) => {
        return await apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },

    isAuthenticated: () => !!getToken(),
};

// Products API
const productsAPI = {
    getAll: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = queryParams ? `/products?${queryParams}` : '/products';
        return await apiRequest(endpoint);
    },

    getOne: async (id) => {
        return await apiRequest(`/products/${id}`);
    },

    create: async (productData) => {
        return await apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    update: async (id, productData) => {
        return await apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },

    delete: async (id) => {
        return await apiRequest(`/products/${id}`, {
            method: 'DELETE',
        });
    },
};

// Cart API
const cartAPI = {
    get: async () => {
        return await apiRequest('/cart');
    },

    add: async (productId, quantity, size) => {
        return await apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity, size }),
        });
    },

    update: async (itemId, quantity) => {
        return await apiRequest(`/cart/update/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        });
    },

    remove: async (itemId) => {
        return await apiRequest(`/cart/remove/${itemId}`, {
            method: 'DELETE',
        });
    },

    clear: async () => {
        return await apiRequest('/cart/clear', {
            method: 'DELETE',
        });
    },
};

// Orders API
const ordersAPI = {
    create: async (orderData) => {
        return await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    getAll: async () => {
        return await apiRequest('/orders');
    },

    getOne: async (id) => {
        return await apiRequest(`/orders/${id}`);
    },
};

// Export API object
window.API = {
    auth: authAPI,
    products: productsAPI,
    cart: cartAPI,
    orders: ordersAPI,
    getToken,
    setToken,
    removeToken,
    getUser,
    setUser,
    removeUser,
};

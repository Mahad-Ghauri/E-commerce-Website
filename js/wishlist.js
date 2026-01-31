// Wishlist API
const wishlistAPI = {
    get: async () => {
        return await apiRequest('/wishlist');
    },

    add: async (productId) => {
        return await apiRequest(`/wishlist/${productId}`, {
            method: 'POST',
        });
    },

    remove: async (productId) => {
        return await apiRequest(`/wishlist/${productId}`, {
            method: 'DELETE',
        });
    },

    clear: async () => {
        return await apiRequest('/wishlist', {
            method: 'DELETE',
        });
    },
};

// Reviews API
const reviewsAPI = {
    getProductReviews: async (productId) => {
        return await apiRequest(`/products/${productId}/reviews`);
    },

    addReview: async (productId, reviewData) => {
        return await apiRequest(`/products/${productId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    },

    updateReview: async (reviewId, reviewData) => {
        return await apiRequest(`/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData),
        });
    },

    deleteReview: async (reviewId) => {
        return await apiRequest(`/reviews/${reviewId}`, {
            method: 'DELETE',
        });
    },
};

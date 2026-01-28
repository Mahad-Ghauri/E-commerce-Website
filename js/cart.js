// Cart state
let cartData = null;
let cartCount = 0;

// Initialize cart
const initCart = async () => {
    try {
        const response = await API.cart.get();
        if (response.success) {
            cartData = response.data;
            updateCartUI();
        }
    } catch (error) {
        console.error('Failed to load cart:', error);
    }
};

// Update cart UI
const updateCartUI = () => {
    if (!cartData) return;

    cartCount = cartData.items.reduce((total, item) => total + item.quantity, 0);

    // Update cart badge
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }

    // Update cart modal if open
    updateCartModal();
};

// Add to cart handler
const addToCart = async (productId, size) => {
    try {
        // Show loading state
        showLoading('Adding to cart...');

        const response = await API.cart.add(productId, 1, size);

        if (response.success) {
            cartData = response.data;
            updateCartUI();
            showNotification('Product added to cart!', 'success');
        }
    } catch (error) {
        showNotification(error.message || 'Failed to add to cart', 'error');
    } finally {
        hideLoading();
    }
};

// Update cart item quantity
const updateCartQuantity = async (itemId, quantity) => {
    try {
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }

        const response = await API.cart.update(itemId, quantity);

        if (response.success) {
            cartData = response.data;
            updateCartUI();
        }
    } catch (error) {
        showNotification(error.message || 'Failed to update cart', 'error');
    }
};

// Remove from cart
const removeFromCart = async (itemId) => {
    try {
        const response = await API.cart.remove(itemId);

        if (response.success) {
            cartData = response.data;
            updateCartUI();
            showNotification('Item removed from cart', 'success');
        }
    } catch (error) {
        showNotification(error.message || 'Failed to remove item', 'error');
    }
};

// Clear cart
const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
        const response = await API.cart.clear();

        if (response.success) {
            cartData = response.data;
            updateCartUI();
            showNotification('Cart cleared', 'success');
        }
    } catch (error) {
        showNotification(error.message || 'Failed to clear cart', 'error');
    }
};

// Update cart modal content
const updateCartModal = () => {
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal || !cartData) return;

    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartData.items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
        return;
    }

    // Render cart items
    cartItems.innerHTML = cartData.items.map(item => `
    <div class="cart-item" data-item-id="${item._id}">
      <img src="http://localhost:5001${item.product.images[0]}" alt="${item.product.name}">
      <div class="cart-item-details">
        <h4>${item.product.name}</h4>
        <p>Size: ${item.size}</p>
        <p class="price">$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-controls">
            <button onclick="updateCartQuantity('${item._id}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateCartQuantity('${item._id}', ${item.quantity + 1})">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item._id}')">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    </div>
  `).join('');

    cartTotal.textContent = `$${cartData.totalPrice.toFixed(2)}`;
};

// Show cart modal
const showCart = () => {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.add('active');
        updateCartModal();
    }
};

// Hide cart modal
const hideCart = () => {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.classList.remove('active');
    }
};

// Checkout
const checkout = async () => {
    if (!API.auth.isAuthenticated()) {
        showNotification('Please login to checkout', 'warning');
        localStorage.setItem('postLoginRedirect', '/checkout.html');
        showLoginModal();
        return;
    }

    if (!cartData || cartData.items.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    // Redirect to checkout page
    window.location.href = '/checkout.html';
};

// Utility functions
const showLoading = (message = 'Loading...') => {
    // Implement loading indicator
    console.log(message);
};

const hideLoading = () => {
    // Hide loading indicator
};

const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    initCart();
});

// Export cart functions
window.Cart = {
    init: initCart,
    add: addToCart,
    update: updateCartQuantity,
    remove: removeFromCart,
    clear: clearCart,
    show: showCart,
    hide: hideCart,
    checkout,
};

const checkoutState = {
    cart: null,
};

const showNotification = (message, type = 'info') => {
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

const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

const renderCartSummary = (cart) => {
    const itemsContainer = document.getElementById('checkout-items');
    const totalElement = document.getElementById('checkout-total');

    if (!itemsContainer || !totalElement) return;

    if (!cart || cart.items.length === 0) {
        itemsContainer.innerHTML = '<p class="checkout-empty">Your cart is empty.</p>';
        totalElement.textContent = '$0.00';
        return;
    }

    itemsContainer.innerHTML = cart.items
        .map(
            (item) => `
        <div class="checkout-item">
          <img src="${(window.API_BASE_URL || '').replace('/api', '')}${item.product.images[0]}" alt="${item.product.name}">
          <div>
            <h4>${item.product.name}</h4>
            <p>Size ${item.size} • Qty ${item.quantity}</p>
          </div>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>`
        )
        .join('');

    totalElement.textContent = formatPrice(cart.totalPrice);
};

const loadCheckoutCart = async () => {
    try {
        const response = await API.cart.get();
        if (response.success) {
            checkoutState.cart = response.data;
            renderCartSummary(checkoutState.cart);
        }
    } catch (error) {
        console.error('Failed to load cart:', error);
        showNotification('Failed to load cart', 'error');
    }
};

const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    if (!checkoutState.cart || checkoutState.cart.items.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    const form = event.target;
    const shippingAddress = {
        street: form.street.value.trim(),
        city: form.city.value.trim(),
        state: form.state.value.trim(),
        zipCode: form.zipCode.value.trim(),
        country: form.country.value.trim(),
    };

    const paymentMethod = form.paymentMethod.value;

    try {
        const response = await API.orders.create({
            shippingAddress,
            paymentMethod,
        });

        if (response.success) {
            showNotification('Order placed successfully!', 'success');
            form.reset();
            checkoutState.cart = null;
            renderCartSummary({ items: [], totalPrice: 0 });
            document.getElementById('order-success').classList.add('visible');
        }
    } catch (error) {
        showNotification(error.message || 'Failed to place order', 'error');
    }
};

const initCheckout = () => {
    if (!API.auth.isAuthenticated()) {
        localStorage.setItem('postLoginRedirect', '/checkout.html');
        window.location.href = '/';
        return;
    }

    loadCheckoutCart();

    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleCheckoutSubmit);
    }
};

document.addEventListener('DOMContentLoaded', initCheckout);

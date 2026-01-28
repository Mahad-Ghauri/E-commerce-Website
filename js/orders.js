const ordersList = document.getElementById('orders-list');
const ordersEmpty = document.getElementById('orders-empty');
const refreshButton = document.getElementById('refresh-orders');

const baseUrl = (window.API_BASE_URL || '').replace('/api', '');

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

const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

const renderOrders = (orders) => {
    if (!ordersList || !ordersEmpty) return;

    if (!orders.length) {
        ordersList.innerHTML = '';
        ordersEmpty.style.display = 'flex';
        return;
    }

    ordersEmpty.style.display = 'none';

    ordersList.innerHTML = orders
        .map(
            (order) => `
      <article class="order-card">
        <header>
          <div>
            <h3>${order.orderNumber}</h3>
            <p>${formatDate(order.createdAt)}</p>
          </div>
          <div class="order-status">
            <span class="badge badge-${order.orderStatus}">${order.orderStatus}</span>
            <span class="badge badge-${order.paymentStatus}">${order.paymentStatus}</span>
          </div>
        </header>
        <div class="order-items">
          ${order.items
              .map(
                  (item) => `
            <div class="order-item">
              <img src="${baseUrl}${item.image}" alt="${item.name}">
              <div>
                <h4>${item.name}</h4>
                <p>Size ${item.size} • Qty ${item.quantity}</p>
              </div>
              <span>${formatPrice(item.price * item.quantity)}</span>
            </div>`
              )
              .join('')}
        </div>
        <footer>
          <span>Total</span>
          <strong>${formatPrice(order.totalAmount)}</strong>
        </footer>
      </article>`
        )
        .join('');
};

const loadOrders = async () => {
    try {
        const response = await API.orders.getAll();
        if (response.success) {
            renderOrders(response.data || []);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        showNotification(error.message || 'Failed to load orders', 'error');
    }
};

const initOrders = () => {
    if (!API.auth.isAuthenticated()) {
        localStorage.setItem('postLoginRedirect', '/orders.html');
        window.location.href = '/';
        return;
    }

    loadOrders();

    if (refreshButton) {
        refreshButton.addEventListener('click', loadOrders);
    }
};

document.addEventListener('DOMContentLoaded', initOrders);

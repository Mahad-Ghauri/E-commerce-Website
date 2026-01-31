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
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const getStatusClass = (status) => {
    const statusMap = {
        processing: 'status-processing',
        shipped: 'status-shipped',
        delivered: 'status-delivered',
        cancelled: 'status-cancelled',
    };
    return statusMap[status] || 'status-processing';
};

const renderOrders = (orders) => {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    if (!orders || orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-shopping-bag"></i>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here!</p>
                <a href="/">Browse Products</a>
            </div>
        `;
        return;
    }

    const baseUrl = (window.API_BASE_URL || '').replace('/api', '');

    ordersList.innerHTML = orders
        .map(
            (order) => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-number">${order.orderNumber}</span>
                <span class="order-status ${getStatusClass(order.orderStatus)}">
                    ${order.orderStatus}
                </span>
            </div>
            <div class="order-items">
                ${order.items
                    .map(
                        (item) => `
                    <div class="order-item">
                        <img src="${baseUrl}${item.image}" alt="${item.name}">
                        <div class="order-item-info">
                            <h4>${item.name}</h4>
                            <p>Size ${item.size} • Qty ${item.quantity} • ${formatPrice(item.price)}</p>
                        </div>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `
                    )
                    .join('')}
            </div>
            <div class="order-footer">
                <span class="order-date">${formatDate(order.createdAt)}</span>
                <span class="order-total">Total: ${formatPrice(order.totalAmount)}</span>
            </div>
        </div>
    `
        )
        .join('');
};

const loadOrders = async () => {
    if (!API.auth.isAuthenticated()) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await API.orders.getAll();
        if (response.success) {
            renderOrders(response.data);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        showNotification('Failed to load orders', 'error');
    }
};

document.addEventListener('DOMContentLoaded', loadOrders);
        window.location.href = '/';
        return;
    }

    loadOrders();

    if (refreshButton) {
        refreshButton.addEventListener('click', loadOrders);
    }
};

document.addEventListener('DOMContentLoaded', initOrders);

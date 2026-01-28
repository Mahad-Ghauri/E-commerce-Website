const productContainer = document.querySelector('.product-cont');

const colorPalette = [
    '#747474',
    '#94232e',
    '#ad3131',
    '#a5b6ae',
    '#616161',
    '#c7b7a8',
    '#d65601',
    '#cabfba',
    '#afb484',
    '#111111',
    '#bfb399',
    '#a6a89d',
    '#31445b',
    '#c3472e',
    '#737c85',
    '#b7bab5',
];

const baseUrl = (window.API_BASE_URL || '').replace('/api', '');

const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

const resolveImageUrl = (imagePath) => {
    if (!imagePath) return '/imgs/1.1.webp';
    if (imagePath.startsWith('http')) return imagePath;
    return `${baseUrl}${imagePath}`;
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

const renderProducts = (products) => {
    if (!productContainer) return;

    const scrollSections = Array.from(
        productContainer.querySelectorAll('.scrollImage-cont, .scrollImage-cont2')
    );

    productContainer.innerHTML = '';

    if (!products.length) {
        const emptyState = document.createElement('div');
        emptyState.className = 'product-empty-state';
        emptyState.textContent = 'No products available right now.';
        productContainer.appendChild(emptyState);
    } else {
        const cardsMarkup = products
            .map((product, index) => {
                const accent = colorPalette[index % colorPalette.length];
                const sizeMarkup = (product.sizes || [])
                    .map(
                        (size) =>
                            `<span class="size-option" data-size="${size}">${size}</span>`
                    )
                    .join('');

                const imageUrl = resolveImageUrl(product.images?.[0]);
                const outOfStock = product.stock <= 0;

                return `
        <div class="product-card" data-product-id="${product._id}" style="--accent:${accent}">
          <img loading="lazy" class="sneaker-img" src="${imageUrl}" alt="${product.name}">
          <div class="sneakerDesc">
            <div class="sneaker-decor"></div>
            <div class="data-cont">
              <div class="sneakerName">
                <h2>${product.name}</h2>
                <div class="snk-class">
                  <h3>${product.category}</h3>
                </div>
              </div>
              <div class="btnBuy-cont">
                <div class="btnBuy btn-buy" role="button" tabindex="0" aria-label="Add ${product.name} to cart" ${outOfStock ? 'data-disabled="true"' : ''}>
                  <h3><i class="fas fa-shopping-cart"></i></h3>
                </div>
                <span class="product-price">${formatPrice(product.price)}</span>
                ${outOfStock ? '<span class="product-stock">Out of stock</span>' : ''}
              </div>
              <div class="sneakerSize">
                <h3>Sizes</h3>
                <div class="sizes">
                  ${sizeMarkup}
                </div>
              </div>
            </div>
          </div>
        </div>`;
            })
            .join('');

        productContainer.insertAdjacentHTML('beforeend', cardsMarkup);
    }

    scrollSections.forEach((section) => productContainer.appendChild(section));
};

const loadProducts = async () => {
    if (!productContainer) return;

    try {
        const response = await API.products.getAll();
        if (response.success) {
            renderProducts(response.data || []);
        }
    } catch (error) {
        console.error('Failed to load products:', error);
        renderProducts([]);
    }
};

const handleProductInteractions = () => {
    if (!productContainer) return;

    productContainer.addEventListener('click', async (event) => {
        const sizeOption = event.target.closest('.size-option');
        if (sizeOption) {
            const sizesContainer = sizeOption.closest('.sizes');
            sizesContainer
                .querySelectorAll('.size-option')
                .forEach((option) => option.classList.remove('is-selected'));
            sizeOption.classList.add('is-selected');
            return;
        }

        const buyButton = event.target.closest('.btn-buy');
        if (buyButton) {
            if (buyButton.dataset.disabled === 'true') {
                showNotification('This product is out of stock.', 'warning');
                return;
            }

            const card = buyButton.closest('.product-card');
            const selectedSize = card.querySelector('.size-option.is-selected');

            if (!selectedSize) {
                showNotification('Please select a size.', 'warning');
                return;
            }

            try {
                await window.Cart.add(card.dataset.productId, Number(selectedSize.dataset.size));
            } catch (error) {
                showNotification(error.message || 'Failed to add to cart', 'error');
            }
        }
    });

    productContainer.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        const buyButton = event.target.closest('.btn-buy');
        if (buyButton) {
            buyButton.click();
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    handleProductInteractions();
});

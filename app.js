// --- Configuration & Initialization ---
const STORAGE_KEY = 's_series_products';
const CART_KEY = 's_series_cart';

// Dummy Data Seed
const initialProducts = [
    {
        id: 'p1',
        name: 'Obsidian Trench Coat',
        category: 'apparel',
        price: 850,
        offerPrice: null,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
        desc: 'A masterclass in tailored perfection. The Obsidian Trench flows like liquid shadow, engineered with zero-gravity microfibers.'
    },
    {
        id: 'p2',
        name: 'Aero-Weave Knit',
        category: 'apparel',
        price: 320,
        offerPrice: 280,
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop',
        desc: 'Breathable, weightless, and infinitely comfortable. Crafted for seamless transition between active and leisure.'
    },
    {
        id: 'p3',
        name: 'Monolith Chronograph',
        category: 'accessories',
        price: 1200,
        offerPrice: null,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
        desc: 'Time captured in matte titanium. The Monolith represents the apex of minimalist horology.'
    },
    {
        id: 'p4',
        name: 'Void Leather Tote',
        category: 'accessories',
        price: 650,
        offerPrice: 590,
        image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop',
        desc: 'Architectural lines meet supple Italian calfskin. A statement piece that carries your world.'
    },
    {
        id: 'p5',
        name: 'Quantum High-Tops',
        category: 'apparel',
        price: 450,
        offerPrice: null,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
        desc: 'Defy gravity with our proprietary foam sole. Futuristic silhouette meets unparalleled comfort.'
    },
    {
        id: 'p6',
        name: 'Eclipse Sunglasses',
        category: 'accessories',
        price: 280,
        offerPrice: null,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
        desc: 'Polarized, frameless, and ruthlessly modern. See the world through a new lens.'
    }
];

// Initialize Storage
function initData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(CART_KEY)) {
        localStorage.setItem(CART_KEY, JSON.stringify([]));
    }
}

initData();

// --- State ---
let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
let currentFilter = 'all';
let currentProduct = null;

// --- DOM Elements ---
const productGrid = document.getElementById('productGrid');
const filterBtns = document.querySelectorAll('#categoryFilters button');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const emptyCartMsg = document.getElementById('emptyCartMsg');
const navbar = document.getElementById('navbar');

// Modal Elements
const productModal = document.getElementById('productModal');
const closeModalOverlay = document.getElementById('closeModalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalContent = document.getElementById('modalContent');
const modalImg = document.getElementById('modalImg');
const modalCategory = document.getElementById('modalCategory');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalOfferPrice = document.getElementById('modalOfferPrice');
const modalDesc = document.getElementById('modalDesc');
const addToCartBtn = document.getElementById('addToCartBtn');

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// --- Functions ---

// Formatting
const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

// Render Products
function renderProducts() {
    // Re-fetch products in case admin updated them
    products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    const filtered = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);

    productGrid.innerHTML = '';

    filtered.forEach((product, index) => {
        const delayClass = `delay-${(index % 3 + 1) * 100}`;
        const hasOffer = product.offerPrice && product.offerPrice < product.price;
        const displayPrice = hasOffer ? formatPrice(product.offerPrice) : formatPrice(product.price);
        
        const card = document.createElement('div');
        card.className = `glass-card rounded-2xl overflow-hidden cursor-pointer group opacity-0 animate-fade-in-up ${delayClass}`;
        card.onclick = () => openModal(product);

        card.innerHTML = `
            <div class="relative h-96 product-image-container flex items-center justify-center p-8 bg-gradient-to-b from-[#111] to-transparent">
                ${hasOffer ? `<div class="absolute top-4 left-4 z-20 bg-accent text-dark text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">Sale</div>` : ''}
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain anti-gravity-element drop-shadow-xl z-10">
                <div class="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500 z-0"></div>
            </div>
            <div class="p-6 border-t border-white/5 relative z-20 bg-[#0a0a0a]">
                <p class="text-accent text-xs uppercase tracking-widest mb-2">${product.category}</p>
                <h3 class="text-xl font-serif text-white mb-2 group-hover:text-accent transition-colors">${product.name}</h3>
                <div class="flex items-center space-x-3">
                    <span class="text-lg font-light">${displayPrice}</span>
                    ${hasOffer ? `<span class="text-sm text-gray-500 line-through">${formatPrice(product.price)}</span>` : ''}
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => {
            b.classList.remove('text-white', 'border-accent');
            b.classList.add('border-transparent');
        });
        e.target.classList.add('text-white', 'border-accent');
        e.target.classList.remove('border-transparent');
        currentFilter = e.target.getAttribute('data-category');
        renderProducts();
    });
});

// Modal Logic
function openModal(product) {
    currentProduct = product;
    const hasOffer = product.offerPrice && product.offerPrice < product.price;
    
    modalImg.src = product.image;
    modalCategory.textContent = product.category;
    modalTitle.textContent = product.name;
    modalDesc.textContent = product.desc || 'Experience the pinnacle of futuristic fashion. Crafted with precision, designed to defy gravity.';
    
    modalPrice.textContent = hasOffer ? formatPrice(product.offerPrice) : formatPrice(product.price);
    if (hasOffer) {
        modalOfferPrice.textContent = formatPrice(product.price);
        modalOfferPrice.classList.remove('hidden');
    } else {
        modalOfferPrice.classList.add('hidden');
    }

    productModal.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }, 10);
}

function closeModal() {
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        productModal.classList.add('opacity-0', 'pointer-events-none');
        currentProduct = null;
    }, 300);
}

closeModalOverlay.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

// Cart Logic
function updateCartUI() {
    cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('opacity-0');
    } else {
        cartCount.classList.add('opacity-0');
    }

    // Render Items
    const cartItemsHtml = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
            <div class="flex items-center space-x-4 glass-card p-4 rounded-xl group relative overflow-hidden">
                <div class="w-20 h-20 bg-[#111] rounded-lg flex items-center justify-center p-2">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1">
                    <h4 class="text-sm font-serif mb-1">${item.name}</h4>
                    <p class="text-xs text-accent mb-2">${formatPrice(item.price)}</p>
                    <div class="flex items-center space-x-3 text-sm">
                        <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-dark transition-colors">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-dark transition-colors">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.id}')" class="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
    }).join('');

    // Update empty state and list
    const itemsList = document.querySelectorAll('#cartItems > .glass-card');
    itemsList.forEach(el => el.remove());

    if (cart.length > 0) {
        emptyCartMsg.classList.add('hidden');
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemsHtml);
    } else {
        emptyCartMsg.classList.remove('hidden');
    }

    // Calculate Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);
}

function addToCart() {
    if (!currentProduct) return;
    
    const price = currentProduct.offerPrice && currentProduct.offerPrice < currentProduct.price 
        ? currentProduct.offerPrice 
        : currentProduct.price;

    const existingItem = cart.find(item => item.id === currentProduct.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: price,
            image: currentProduct.image,
            quantity: 1
        });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
    showToast(`Added ${currentProduct.name} to cart`);
    closeModal();
}

addToCartBtn.addEventListener('click', addToCart);

window.updateQuantity = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartUI();
    }
};

window.removeFromCart = (id) => {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
};

// Drawer Logic
function toggleCart() {
    const isClosed = cartDrawer.classList.contains('translate-x-full');
    if (isClosed) {
        cartDrawer.classList.remove('translate-x-full');
        cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        cartDrawer.classList.add('translate-x-full');
        cartOverlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }
}

cartToggle.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

// Toast Notification
function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.remove('opacity-0', 'translate-y-20');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-20');
    }, 3000);
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Storage Listener (to update UI if admin changes data in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        renderProducts();
    }
    if (e.key === CART_KEY) {
        updateCartUI();
    }
});

// Initialize
renderProducts();
updateCartUI();

// Parallax slight mouse move effect on hero
const heroSection = document.getElementById('home');
heroSection.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    const elements = document.querySelectorAll('.anti-gravity-container .anti-gravity-element');
    elements.forEach((el, index) => {
        const factor = (index + 1) * 0.5;
        el.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
});
heroSection.addEventListener('mouseleave', () => {
    const elements = document.querySelectorAll('.anti-gravity-container .anti-gravity-element');
    elements.forEach(el => {
        el.style.transform = ''; // reset to keyframe animation
    });
});

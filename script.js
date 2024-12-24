
const products = [
    { id: 1, name: "Aqva Pour Homme", category: "men", price: 49.99, image: "pic/p9.jpeg" },
    { id: 2, name: "Emporio Armani", category: "men", price: 59.99, image: "pic/p8.jpeg" },
    { id: 3, name: "The One by Dolce", category: "women", price: 69.99, image: "pic/p3.webp" },
    { id: 4, name: "Floris London", category: "women", price: 89.99, image: "pic/p10.jpeg" },
    { id: 5, name: "Versace Eros", category: "men", price: 64.99, image: "pic/p5.jpeg" },
    { id: 6, name: "Chanel Coco Mademoiselle", category: "women", price: 74.99, image: "pic/p4.jpeg" }
];


const featuredProducts = [
    { name: "Aqva Pour Homme", price: "$49.99", image: "pic/p9.jpeg" },
    { name: "Emporio Armani", price: "$59.99", image: "pic/p8.jpeg" },
    { name: "The One by D&G", price: "$69.99", image: "pic/p3.webp" },
    { name: "Floris London", price: "$89.99", image: "pic/p4.jpeg" },
];


let cart = JSON.parse(localStorage.getItem("cart")) || [];

/** UTILITIES **/

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return total.toFixed(2);
}

/** INDEX PAGE: Load Featured Products **/
function loadFeaturedProducts() {
    const carousel = document.getElementById("perfume-featured-carousel");
    if (!carousel) return;

    featuredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("perfume-product-card");
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price}</p>
            <button class="perfume-btn" onclick="addFeaturedProductToCart('${product.name}')">Add to Cart</button>
        `;
        carousel.appendChild(productCard);
    });
}

function addFeaturedProductToCart(productName) {
    const product = products.find(p => p.name === productName);
    if (product) {
        addToCart(product.id);
    }
}

/** SHOP PAGE: Load and Filter Products **/
function loadProducts(filter = "all") {
    const productList = document.getElementById("perfume-product-list");
    if (!productList) return;

    productList.innerHTML = ""; 
    const filteredProducts = products.filter(product => filter === "all" || product.category === filter);

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("perfume-product-card");
        productCard.setAttribute('data-name', product.name.toLowerCase()); 
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button class="perfume-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

function filterProducts() {
    const categoryFilter = document.getElementById("perfume-category-filter");
    const filterValue = categoryFilter.value;
    loadProducts(filterValue);
}

/** SEARCH FUNCTION **/
function searchPerfumes() {
    const query = document.getElementById('search-bar-shop').value.toLowerCase(); 
    const products = document.querySelectorAll('.perfume-product-card'); 

    products.forEach(product => {
        const name = product.getAttribute('data-name'); 
        if (name.includes(query)) {
            product.style.display = 'block'; 
        } else {
            product.style.display = 'none'; 
        }
    });
}

/** ADD TO CART **/
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} has been added to your cart!`);
}

/** CART PAGE FUNCTIONS **/
function loadCart() {
    const cartItems = document.getElementById("perfume-cart-items");
    const totalPrice = document.getElementById("perfume-total-price");
    if (!cartItems || !totalPrice) return;

    let html = "";
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="perfume-btn-remove" onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    cartItems.innerHTML = html || "<p>Your cart is empty.</p>";
    totalPrice.textContent = `Total: $${updateCartTotal()}`;
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart[index].quantity = 1;
    }
    saveCart();
    loadCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    loadCart();
}

function clearCart() {
    cart = [];
    saveCart();
    loadCart();
}

/** CHECKOUT PAGE FUNCTIONS **/
function loadCheckoutCart() {
    const cartItemsContainer = document.getElementById("checkout-cart-items");
    const totalPriceContainer = document.getElementById("checkout-total-price");
    if (!cartItemsContainer || !totalPriceContainer) return;

    let html = "";
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `<p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>`;
    });

    cartItemsContainer.innerHTML = html || "<p>Your cart is empty.</p>";
    totalPriceContainer.textContent = `Total: $${total.toFixed(2)}`;
}

const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("checkout-name").value;
        const email = document.getElementById("checkout-email").value;
        const address = document.getElementById("checkout-address").value;
        const phone = document.getElementById("checkout-phone").value;

        if (!name || !email || !address || !phone) {
            alert("Please fill in all fields.");
            return;
        }

        alert(`Thank you for your order, ${name}! We will process it shortly.`);
        cart = [];
        saveCart();
        window.location.href = "index.html";
    });
}

/** CONTACT PAGE **/
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const message = document.getElementById("contact-message").value;

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        alert(`Thank you for contacting us, ${name}! We will get back to you soon.`);
        this.reset();
    });
}

/** ABOUT PAGE INTERACTIONS **/
document.addEventListener("DOMContentLoaded", function () {
    
    loadFeaturedProducts();

    
    if (document.getElementById("perfume-product-list")) {
        
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        loadProducts(category);
    }

    
    if (document.getElementById("perfume-cart-items")) {
        loadCart();
    }

    
    if (document.getElementById("checkout-cart-items")) {
        loadCheckoutCart();
    }

    
    const aboutSections = document.querySelectorAll(".perfume-about-content > div");
    aboutSections.forEach((section) => {
        const heading = section.querySelector("h3");
        const content = section.querySelector("p, ul");
        if (content) {
            content.style.display = "none";
            heading.addEventListener("click", () => {
                const isVisible = content.style.display === "block";
                content.style.display = isVisible ? "none" : "block";
                heading.classList.toggle("expanded", !isVisible);
            });
        }
    });
});

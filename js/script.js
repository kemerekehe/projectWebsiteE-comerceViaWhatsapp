const navbarNav = document.querySelector('.navbar-nav');
const hamburgerMenu = document.querySelector('#hamburger-menu');
const cartTab = document.querySelector('.cart-tab');
const closecart = document.querySelector('.close');
const cartbtn = document.querySelector('#shopping-cart-btn');
const quantitybtn = document.querySelectorAll('.items .quantity');
const iconCartSpan = document.querySelector('.shopping-cart-btn span');
const checkoutBtn = document.querySelector('.checkout');
const kirimBtn = document.querySelector('.kirim')
let listProductHTML = document.querySelector('.product .row');
let listCartHTML = document.querySelector('.cart-items');
let listProduct = [];
let cart = [];
let totalQuantity = 0;

document.querySelector('#hamburger-menu').onclick = () => {
    navbarNav.classList.toggle('active');
};

document.addEventListener('click', function (e) {
    if (!hamburgerMenu.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
});
document.querySelector('#shopping-cart-btn').onclick = (e) => {
    cartTab.classList.toggle('active');
    e.preventDefault();
};

document.addEventListener('click', function (e) {
    if (closecart.contains(e.target) || cartbtn.contains(e.target) && !quantitybtn.contains(e.target)){
        cartTab.classList.remove('active');
        e.preventDefault();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // Select all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProduct.length > 0) {
        listProduct.forEach(products => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('menu-card');
            newProduct.dataset.id = products.id;
            newProduct.innerHTML = `
                <img src="${products.image}" alt="brainy">
                <h3 class="menu-card-title">${products.name}</h3>
                <p class="menu-card-price">${products.price}</p>
                <div class="btn">
                    <button class="buy-btn">Buy</button>
                </div>
            `;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (e) => {
    let positionClick = e.target;
    if (positionClick.classList.contains('buy-btn')) {
        let products_id = positionClick.closest('.menu-card').dataset.id;
        addToCart(products_id);
    }
});

const addToCart = (products_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == products_id)
    if (cart.length <= 0) {
        cart = [{
            product_id: products_id,
            quantity: 1
        }]
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: products_id,
            quantity: 1
        })
    } else {
        cart[positionThisProductInCart].quantity++;
    }
    addCartToHTML();
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    totalQuantity = 0; // Reset totalQuantity
    if (cart.length > 0) {
        cart.forEach(car => {
            totalQuantity = totalQuantity + car.quantity;
            let positionThisProductInCart = listProduct.findIndex((value) => value.id == car.product_id)
            let info = listProduct[positionThisProductInCart]
            let newCart = document.createElement('div');
            newCart.classList.add('items');
            newCart.dataset.id = car.product_id;
            newCart.innerHTML = `
                <div class="img">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    ${info.price * car.quantity}
                </div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${car.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newCart);
        });
    }
    iconCartSpan.innerHTML = totalQuantity;
};

listCartHTML.addEventListener('click', (e) => {
    let positionClick = e.target;
    if (positionClick.classList.contains('minus')) {
        let products_id = positionClick.closest('.items').dataset.id;
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == products_id)
        if (cart[positionThisProductInCart].quantity > 1) {
            cart[positionThisProductInCart].quantity--;
            addCartToHTML();
        } else {
            cart.splice(positionThisProductInCart, 1);
            addCartToHTML();
        }
    } else if (positionClick.classList.contains('plus')) {
        let products_id = positionClick.closest('.items').dataset.id;
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == products_id)
        cart[positionThisProductInCart].quantity++;
        addCartToHTML();
    }
});

checkoutBtn.addEventListener('click', () => {
    checkout();
});

const checkout = () => {
    // Buat pesan WhatsApp
    let whatsappMessage = '--- Checkout Information ---\n';

    if (cart.length > 0) {
        cart.forEach((item) => {
            let positionThisProductInCart = listProduct.findIndex((value) => value.id == item.product_id);
            let productInfo = listProduct[positionThisProductInCart];

            whatsappMessage += `Product: ${productInfo.name}\n`;
            whatsappMessage += `Price: ${productInfo.price}\n`;
            whatsappMessage += `Quantity: ${item.quantity}\n`;
            whatsappMessage += `Total: ${productInfo.price * item.quantity}\n\n`;
        });

        whatsappMessage += `Total Quantity: ${totalQuantity}\n`;
        whatsappMessage += `Grand Total: ${calculateGrandTotal()}\n`;
    } else {
        whatsappMessage += 'No items in the cart.\n';
    }

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Buka window WhatsApp
    window.open(`https://wa.me/6285971690136?text=` + encodedMessage);
};

// Fungsi untuk menghitung total keseluruhan
const calculateGrandTotal = () => {
    let grandTotal = 0;

    if (cart.length > 0) {
        cart.forEach((item) => {
            let positionThisProductInCart = listProduct.findIndex((value) => value.id == item.product_id);
            let productInfo = listProduct[positionThisProductInCart];
            grandTotal += productInfo.price * item.quantity;
        });
    }

    return grandTotal;
};
const sendWhatsAppMessage = () => {
    // Get name and message values
    var name = document.getElementById('username').value;
    var message = document.getElementById('message').value;

    // Check if name and message are not empty
    if (name.trim() === '' || message.trim() === '') {
        alert('Nama dan pesan tidak boleh kosong!');
        return;
    }

    let whatsappMessage = 'Hai, ';
    whatsappMessage += `saya ${name} telah mengunjungi website\n`;
    whatsappMessage += `${message}\n`;

    // Construct WhatsApp message link
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Open WhatsApp link in a new window/tab
    window.open(`https://wa.me/6285971690136?text=` + encodedMessage);
}

kirimBtn.addEventListener('click', () => {
    sendWhatsAppMessage();
});


const initApp = () => {
    //get from json
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listProduct = data;
            addDataToHTML();

            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();


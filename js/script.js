const navbarNav = document.querySelector('.navbar-nav');
const hamburgerMenu = document.querySelector('#hamburger-menu');
const cartTab = document.querySelector('.cart-tab');
const closecart = document.querySelector('.close');
cartbtn = document.querySelector('.cart-tab');
// const quantitybtn = document.querySelectorAll('.items .quantity');
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

document.getElementById('shopping-cart-btn').onclick = (e) => {
    cartTab.classList.toggle('active');
    e.preventDefault();
};

document.addEventListener('click', function (e) {
    if (closecart.contains(e.target)
    ) {
        cartTab.classList.remove('active');
        e.preventDefault();
    }
});

// document.addEventListener("DOMContentLoaded", function () {
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function (e) {
//             e.preventDefault();
//             document.querySelector(this.getAttribute('href')).scrollIntoView({
//                 behavior: 'smooth'
//             });
//         });
//     });
// });

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
                <p class="menu-card-price">Rp.${products.price}/${products.quantity}</p>
                <div class="btn">
                    <button class="buy-btn">Beli</button>
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
                <div id='quantity' class="quantity">
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

const checkout = () => {
    // Buat pesan WhatsApp
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var address = document.getElementById('address').value;
    if (name.trim() === '' || phone.trim() === '' || address.trim() === '') {
        alert('Harap isi formulir pembelian sebelum melanjutkan.');
        return
    }

    let whatsappMessage = '--- Checkout Information ---\n';
    whatsappMessage += `Nama:${name}\n`;
    whatsappMessage += `Nomor Telepon:${phone}\n`;
    whatsappMessage += `Alamat:${address}\n`;
    whatsappMessage += `Jumlah Produk yang dibeli:${totalQuantity}\n\n`;

    cart.forEach((item) => {
        let positionThisProductInCart = listProduct.findIndex((value) => value.id == item.product_id);
        let productInfo = listProduct[positionThisProductInCart];

        whatsappMessage += `${productInfo.name}\n`;
        whatsappMessage += `Harga:${productInfo.price}\n`;
        whatsappMessage += `Jumlah:${item.quantity}\n`;
        whatsappMessage += `Subtotal:${productInfo.price * item.quantity}\n\n`;
    });

    whatsappMessage += `Total:${calculateGrandTotal()}\n`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Buka window WhatsApp
    window.open(`https://wa.me/6289512661373?text=` + encodedMessage);
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
    window.open(`https://wa.me/6289512661373?text=` + encodedMessage);
}

kirimBtn.addEventListener('click', () => {
    sendWhatsAppMessage();
});

document.addEventListener('DOMContentLoaded', function () {
    const mainElement = document.querySelector('.element');
    mainElement.classList.add('fade-in');
});

document.addEventListener('DOMContentLoaded', function () {
    
    var modal = document.getElementById('checkout-modal');

    // Get the <span> element that closes the modal
    var closeBtn = document.getElementsByClassName('closeform')[0];
    
    // When the user clicks the checkout button, open the modal 
    checkoutBtn.onclick = function () {
        if (cart.length > 0) {
            modal.style.display = 'block';
            cartTab.classList.remove('active');
            // e.preventDefault();
        } else {
            alert('Keranjang kamu kosong');
            return;
        }
    };

    // When the user clicks on <span> (x), close the modal
    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
    // Handle form submission
    var submitBtn = document.querySelector('#checkout-form .submit');
submitBtn.addEventListener('click', function () {
    checkout();
    modal.style.display = 'none';
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
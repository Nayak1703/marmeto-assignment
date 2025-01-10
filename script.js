console.log("====================================");
console.log("Connected");
console.log("====================================");

// navbar funtionality
const hamburgerLogo = document.getElementById("hamburger-logo");
const navbarMobile = document.getElementById("navbar-mobile");
const mNavItems = document.querySelectorAll(".nav-mob-item");

// Toggle the expanded class
hamburgerLogo.addEventListener("click", function (event) {
  if (window.innerWidth < 768) {
    navbarMobile.innerHTML = `<ul class="navbar-mobile-list">
        <li class="nav-mob-item">Home</li>
        <li class="nav-mob-item">Shop</li>
        <li class="nav-mob-item">About</li>
        <li class="nav-mob-item">Contact</li>
      </ul>`;
  }
  navbarMobile.classList.toggle("nav-m-show");
});

// Fetching carts details and adding to local storage
let url =
  "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";
async function fetchingCart(url) {
  const response = await fetch(url);
  const data = await response.json();
  addCartDetailsInLocalstorage(data.items);
  handleDelete();
}
fetchingCart(url);

const addCartDetailsInLocalstorage = (data) => {
  // let productsList = {};
  for (let i = 0; i < data.length; i++) {
    const { id, image, title, price, quantity } = data[i];
    localStorage.setItem(
      `cart-info`,
      JSON.stringify({
        id,
        image,
        title,
        price,
        quantity,
      })
    );

    displayFetchDataOnscreen();
  }
};

const displayFetchDataOnscreen = () => {
  const data = JSON.parse(localStorage.getItem(`cart-info`));
  const productdetails = document.querySelector(".products-details");
  if (data) {
    const tr = document.createElement("tr");
    tr.classList.add("product-details-row");
    let totalPrice = ((data.quantity * data.price) /100).toString();
    let formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
  }).format(totalPrice);


    tr.innerHTML = `
              <td style=" display:flex; justify-content: center; align-items: center"><div class="product-img-div"><img src="${
                data.image
              }" alt="product-img"/></div></td>
              <td><p class="product-name">${data.title}</p></td>
              <td><p class="product-price">${formattedPrice}</p></td>
              <td><input type="number" class="product-quanity" value="${
                data.quantity
              }"/></td>
              <td><p class="product-subtotal">${formattedPrice}</p></td>
              <td><i class="fa-solid fa-trash fa-lg product-delete" style="color: #b88e2f;"></i></td>
            `;
    productdetails.appendChild(tr);

    let inputField = document.querySelector(".product-quanity");
    changeSubtotal(inputField, data.price);
  } else {
    productdetails.innerHTML=""
  }

  fetchDataOnCart(data);
};

// change subtotal when quantity upgrade
const changeSubtotal = (htmlElement, price) => {
  htmlElement.addEventListener("input", (e) => {
    let getDataFromLocalStorage = JSON.parse(localStorage.getItem(`cart-info`));
    getDataFromLocalStorage = {
      ...getDataFromLocalStorage,
      quantity: e.target.value ? parseInt(e.target.value) : 0,
    };

    localStorage.setItem(`cart-info`, JSON.stringify(getDataFromLocalStorage));
    let totalPrice = ((e.target.value * price)/100).toString();

    let formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
  }).format(totalPrice);

    document.querySelector(".product-subtotal").textContent = formattedPrice;

    fetchDataOnCart(getDataFromLocalStorage)
  });
};

// handle delete
const handleDelete = () => {
  const deleteBtn = document.querySelector(".product-delete");
  deleteBtn.addEventListener("click", () => {
    localStorage.removeItem(`cart-info`);
    displayFetchDataOnscreen();
  });
};

// fetch data on cart
const fetchDataOnCart = (data) => {
  const subTotalCart = document.querySelector(".cart-subTotal-price .cart-subtotal")
  const totalCart = document.querySelector(".cart-total-price .cart-subtotal")
  let totalPrice = ((data.quantity * data.price)/100).toString();
  let formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
}).format(totalPrice);

  subTotalCart.textContent = `${
      totalPrice != 0
        ? `${formattedPrice}`
        : "₹ 0"
    }`;
  totalCart.textContent = `${
      totalPrice != 0
        ? `${formattedPrice}`
        : "₹. 0"
    }`;
}

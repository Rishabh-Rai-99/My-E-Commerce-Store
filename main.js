
let productSection = document.querySelector(".products-section");
let notification = document.querySelector(".notification");
let menuBtn = document.querySelector(".menu");
let closeBtn = document.querySelector(".closeBtn");
let mobileNav = document.querySelector(".mobile-nav");
let CartValue = document.querySelectorAll(".cartValue");
let timeout;

mobileNav.style.opacity = "0"; 
mobileNav.style.transition = "opacity 0.2s ease"; 
mobileNav.style.display = "none"; 

menuBtn.addEventListener("click", () => {
  mobileNav.style.display = "block";
  setTimeout(() => {
    mobileNav.style.opacity = "1"; 
  }, 10);
});

closeBtn.addEventListener("click", () => {
  mobileNav.style.opacity = "0"; 
  setTimeout(() => {
    mobileNav.style.display = "none"; 
  }, 400); 
});


let fetchProductsData = async () => {
  let response = await fetch('./src/products.json');
  let products = await response.json();
  return products;
};


let createProductCard = (product) => {
  return `
    <div id="card${product.id}" class="product-card shadow-lg bg-white w-[85%] sm:w-[60%] md:w-[40%] lg:w-[30%] p-3">
      <span class="bg-[#E7D6D6] px-3 py-1 font-semibold text-sm rounded-full">${product.category}</span>
      <img w-[30%] src="${product.image}" alt="">
      <h2 class="font-semibold text-2xl">${product.name}</h2>
      <div class="rating-stars flex my-3">
        <img src="./src/images/star.svg" alt="">
        <img src="./src/images/star.svg" alt="">
        <img src="./src/images/star.svg" alt="">
        <img src="./src/images/star.svg" alt="">
        <img src="./src/images/star.svg" alt="">
      </div>
      <p class="text-sm">${product.description}</p>
      <div class="price flex my-2 gap-4 font-semibold">
        <p>${product.price}</p>
        <p class="line-through">₹3999.96</p>
      </div>
      <div class="stock flex my-2 gap-4">
        <p>Total Stocks Available:</p>
        <p id="stockVal">${product.stock}</p>
      </div>
      <div class="quantity flex my-4 gap-4">
        <p>Quantity(Pieces)</p>
        <div class="stock-element flex border-2 border-[#e3eaf0] rounded-lg text-xl font-bold items-center">
          <button class="px-2 border-r border-[#e3eaf0]" id="plusBtn">+</button>
          <p class="px-5 text-base PurchaseQuantity" id="PurchaseQuantity">1</p>
          <button class="px-3 border-l border-[#e3eaf0]" id="minusBtn">-</button>
        </div>
      </div>
      <div class="addCart-btn-container">
        <button id="addCartBtn${product.id}" class="bg-[#2a2c30] px-5 py-1 rounded-lg text-white flex items-center">
          <span class="material-symbols-outlined text-lg">shopping_cart</span>
          Add To Cart
        </button>
      </div>
    </div>
  `;
};

let updateProductQuantity = (e) => {
  let card = e.target.closest(".stock-element");
  let incre = card.querySelector("#PurchaseQuantity");
  let target = e.target.parentElement;
  let Card = target.parentElement.parentElement;

  let stock = Card.querySelector("#stockVal").innerHTML;
  let stockVal = parseInt(stock, 10);

  let currentIncre = parseInt(incre.textContent, 10) || 0;
  let newIncre;

  if (e.target.id === "plusBtn" && currentIncre < stockVal) {
    newIncre = currentIncre + 1;
    incre.textContent = newIncre;
  } else if (e.target.id === "minusBtn" && currentIncre > 1) {
    newIncre = currentIncre - 1;
    incre.textContent = newIncre;
  }
};

let handleAddToCartClick = (e) => {
  let a = e.target.parentElement;
  let cardElement = a.parentElement;
  let addCartContainer = cardElement.querySelector(".addCart-btn-container");
  let realCardBtn = addCartContainer.firstElementChild;
  let stockToAdd = cardElement.querySelector(".stock-element").querySelector("#PurchaseQuantity").innerHTML;
  
  clearTimeout(timeout);



  if (e.target === realCardBtn) {
    console.log("Added to cart");
    AddToCart(cardElement.id,stockToAdd);
    }
};

let renderProducts = async () => {

  let products = await fetchProductsData();
  HandleCartValue();
  

  productSection.innerHTML = "";

  products.forEach(product => {
    productSection.innerHTML += createProductCard(product);
  });

  productSection.addEventListener('click', (e) => {
    if (e.target.id === "plusBtn" || e.target.id === "minusBtn") {
      updateProductQuantity(e);
    }
    if (e.target.id.startsWith("addCartBtn")) {
      handleAddToCartClick(e);
    }
  });
};

let AddToCart = async(id,stock)=>{
  let data =  await fetchProductsData();
  
  let newID = id.charAt(4);

  let cardToAdd = data[newID-1];
  let existingCards = localStorage.getItem("CheckOutCard") || "";
  
    
  let cont = localStorage.getItem("CheckOutCard");
  let existingIds = []; 
  if (cont) {

    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = cont;

    let data = tempDiv.querySelectorAll(".cart-product-card");
    
    data.forEach((e) => {
        existingIds.push(e.id); 
    });
  } 

  
  if (existingIds.includes(cardToAdd.id.toString())) {
      notification.innerHTML = "";
      notification.innerHTML = `${cardToAdd.name} is already in cart`;
      notification.style.transition = "none"; 
      notification.style.right = "-100%"; 
      
      setTimeout(() => {
          notification.style.transition = "right 0.5s ease-in-out"; 
          notification.style.right = "3%"; 
      }, 10); 

       timeout = setTimeout(()=>{
        notification.style.right = "-100%";
      },2000)


            return;
        }

    else{
      notification.innerHTML = "";
      notification.innerHTML = `${cardToAdd.name} added to cart`;
      notification.style.transition = "none"; 
      notification.style.right = "-100%"; 
      


      setTimeout(() => {
          notification.style.transition = "right 0.5s ease-in-out"; 
          notification.style.right = "3%"; 
      }, 10); 

       timeout =  setTimeout(()=>{
        notification.style.right = "-100%";
      },2000)
      
   let newCard = `<div id=${cardToAdd.id} class="cart-product-card border-[1px] border-[#d8d8d8] flex flex-col md:flex-row justify-between items-center bg-white w-full p-3">
          <div class="flex items-center  justify-between w-full md:w-[50%]">

            <div>
              <span class="bg-[#E7D6D6] w-full h-6 py-1 px-2 font-normal text-xs rounded-full">${cardToAdd.category}</span>
            </div>
            <div class="product-img-name flex items-center ">
            <img class="w-24 h-20" src="${cardToAdd.image}" alt="">
            <h2 class="font-semibold text-lg ml-4">${cardToAdd.name}</h2>
          </div>
          
          <div class="price flex my-2 gap-4 font-semibold">
            <p id="priceVal" class="font-normal text-sm">${cardToAdd.price}</p> 
            <span id="stockVal" class="hidden">${cardToAdd.stock}</span> 
          </div>
        </div>
          <div class="flex quantity-section gap-5 items-center">

            <div class="quantity flex my-4 gap-4">
              <div class="stock-element flex w-full border-2 border-[#e3eaf0] rounded-lg text-xl font-bold items-center">
                <button id="plusBtn" class="px-5 border-r border-[#e3eaf0]">+</button>
                <p id="PurchaseQuantity" class=" px-5 text-base">${stock}</p>
                <button id="minusBtn" class="px-5 border-l border-[#e3eaf0]">-</button>
              </div>
            </div>
          <button class="removeBtn bg-[#2a2c30] border-2 border-[#2a2c30] px-10 py-1 h-full rounded-lg text-white flex items-center transition-colors duration-150 hover:bg-white hover:text-black">Remove</button>
        </div>
      </div>`
      let updatedCards = existingCards + newCard;
      localStorage.setItem("CheckOutCard", updatedCards);
      HandleCartValue();
    }
    }



    let HandleCartValue = ()=>{
      let cont = localStorage.getItem("CheckOutCard");
      if (cont) {
        let tempDiv = document.createElement("div");
        tempDiv.innerHTML = cont;
        
        let data = tempDiv.querySelectorAll(".cart-product-card");
        localStorage.setItem("CartLength", data.length);
        CartValue.forEach((cart)=>{
          cart.innerHTML = localStorage.getItem("CartLength");
        })
      }
    }

renderProducts();


    
//     // window.onload = function () {
//     //     localStorage.clear();
//     //   };
let notification = document.querySelector(".notification");
let timeout;
let container = document.querySelector(".cart-products");
let CartValue = document.querySelectorAll(".cartValue");
let storedCart = localStorage.getItem("CheckOutCard");
let mobileNav = document.querySelector(".mobile-nav");
let closeBtn = document.querySelector(".closeBtn");
let menuBtn = document.querySelector(".menu");



if (storedCart) {
    container.innerHTML = storedCart;
}


window.onload = () => {
    loadCartTotals();
    HandleCartValue();
};

function loadCartTotals() {
    let subTotalElement = document.getElementById("sub-total");
    let taxElement = document.getElementById("tax");
    let finalTotalElement = document.getElementById("final-total");

    let prices = container.querySelectorAll("#priceVal");
    let subTotalPrice = 0;

    prices.forEach((e) => {
        let card = e.closest(".cart-product-card");
        let stockToAdd = card.querySelector(".stock-element").querySelector("#PurchaseQuantity").innerHTML;
        let price = Number(e.innerHTML);
        subTotalPrice += (price * stockToAdd);
    });

    setTimeout(() => {
        let tax = subTotalPrice * 0.18;
        let finalTotal = subTotalPrice + tax;

        subTotalElement.innerHTML = subTotalPrice.toFixed(2);
        taxElement.innerHTML = tax.toFixed(2);
        finalTotalElement.innerHTML = finalTotal.toFixed(2);
    }, 200);
}

container.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeBtn")) {
        let itemToRemove = e.target.closest(".cart-product-card");
              
        if (itemToRemove) {
            clearTimeout(timeout); 

            notification.innerHTML = "Product removed from cart";
            notification.style.transition = "none"; 
            notification.style.right = "-100%"; // 

            setTimeout(() => {
                notification.style.transition = "right 0.5s ease-in-out"; 
                notification.style.right = "3%"; 
            }, 10); 

            timeout = setTimeout(() => {
                notification.style.right = "-100%"; // Hide after 2s
            }, 2000);
            itemToRemove.remove();
            localStorage.setItem("CheckOutCard", container.innerHTML);
            loadCartTotals();
            HandleCartValue();
        }
    }

    if (e.target.id === "plusBtn" || e.target.id === "minusBtn") {
        updateProductQuantity(e);
    }
});

function updateProductQuantity(e) {
    let card = e.target.closest(".stock-element");
    let incre = card.querySelector("#PurchaseQuantity");
    let target = e.target.parentElement;
    let Card = target.closest(".cart-product-card");
    let price = Card.querySelector(".price");
    let priceVal = parseFloat(price.querySelector("#priceVal").innerHTML);

    let stock = Card.querySelector("#stockVal").innerHTML;
    let stockVal = parseInt(stock, 10);
  
    let currentIncre = parseInt(incre.textContent, 10) || 0;
    let newIncre;
  
    if (e.target.id === "plusBtn" && currentIncre < stockVal) {
        newIncre = currentIncre + 1;
        incre.textContent = newIncre;
        IncreTotal(priceVal);
    } else if (e.target.id === "minusBtn" && currentIncre > 1) {
        newIncre = currentIncre - 1;
        incre.textContent = newIncre;
        DecreTotal(priceVal);
    }
}

function IncreTotal(price) {
    let subTotalElement = document.getElementById("sub-total");
    let taxElement = document.getElementById("tax");
    let finalTotalElement = document.getElementById("final-total");

    let subTotal = parseFloat(subTotalElement.innerHTML) || 0;
    let total = subTotal + price;
    setTimeout(() => { 
        let tax = total * 0.18;
        let finalTotal = total + tax;

        subTotalElement.innerHTML = total.toFixed(2);
        taxElement.innerHTML = tax.toFixed(2);
        finalTotalElement.innerHTML = finalTotal.toFixed(2);
    }, 200);
    localStorage.setItem("CheckOutCard", container.innerHTML);
    loadCartTotals();
}

function DecreTotal(price) {
    let subTotalElement = document.getElementById("sub-total");
    let taxElement = document.getElementById("tax");
    let finalTotalElement = document.getElementById("final-total");

    let subTotal = parseFloat(subTotalElement.innerHTML) || 0;
    let total = subTotal - price;
    
    setTimeout(() => { 
        let tax = total * 0.18;
        let finalTotal = total + tax;

        subTotalElement.innerHTML = total.toFixed(2);
        taxElement.innerHTML = tax.toFixed(2);
        finalTotalElement.innerHTML = finalTotal.toFixed(2);
    }, 200);
    localStorage.setItem("CheckOutCard", container.innerHTML);
    loadCartTotals();
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
  
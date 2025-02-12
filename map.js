var map = L.map('map').setView([28.7041, 77.1025], 8);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker, circle, zoomed;

// Get user's current location
navigator.geolocation.getCurrentPosition(success, error);
function success(pos) {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, long]).addTo(map);
    circle = L.circle([lat, long], { radius: accuracy }).addTo(map);

    if (!zoomed) {
        zoomed = map.fitBounds(circle.getBounds());
    }

    map.setView([lat, long]);

    // Fetch city and state name for user's location
    getCityAndState(lat, long, marker);
}

function error(err) {
    if (err.code === 1) {
        // alert("Please allow location access.");
    } else {
        // alert("Cannot get current location.");
    }
}

// ** Allow user to select a location by clicking on the map **
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const long = e.latlng.lng;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, long]).addTo(map);
    getCityAndState(lat, long, marker);
});

// ** Function to Get City & State Name **
function getCityAndState(lat, long, marker) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let city = data.address.city || data.address.town || data.address.village || "Unknown City";
            let state = data.address.state || "Unknown State";
            let country = data.address.country || "Unknown Country";

            let locationText = `${city}, ${state}, ${country}`;
            marker.bindPopup(locationText).openPopup();
            console.log(`User's location: ${locationText}`);
        })
        .catch(error => {
            console.error("Error fetching location data:", error);
            marker.bindPopup("Location not found").openPopup();
        });
}


function HandleCartValue(){
    let CartValue = document.querySelectorAll(".cartValue");
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

HandleCartValue();


let mobileNav = document.querySelector(".mobile-nav");
let closeBtn = document.querySelector(".closeBtn");
let menuBtn = document.querySelector(".menu");



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
  
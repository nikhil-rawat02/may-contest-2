const apiKey = `a6738ee95662410d99bb512257b90d03`;
const baseUrl = `https://api.geoapify.com/v1/geocode/`;
const inputAddress = document.getElementById("find-address-input");
const responseContainer = document.getElementById("response-container")
//get lat and long from browser by using promise if promise reolve show data and if promise reject show alert

function appendUserLocationOnUI(data) {
    document.getElementById("zone-name").innerText = document.getElementById("zone-name").innerText + ` ${data.timezone.name}`;
    document.getElementById("lat").innerText = document.getElementById("lat").innerText + ` ${data.lat}`;
    document.getElementById("long").innerText = document.getElementById("long").innerText + ` ${data.lon}`;
    document.getElementById("zone-std").innerText = document.getElementById("zone-std").innerText + ` ${data.timezone.offset_STD}`;
    document.getElementById("zone-std-sec").innerText = document.getElementById("zone-std-sec").innerText + ` ${data.timezone.offset_STD_seconds}`;
    document.getElementById("zone-dst").innerText = document.getElementById("zone-dst").innerText + ` ${data.timezone.offset_DST}`;
    document.getElementById("zone-dst-sec").innerText = document.getElementById("zone-dst-sec").innerText + ` ${data.timezone.offset_DST_seconds}`;
    document.getElementById("zone-country").innerText = document.getElementById("zone-country").innerText + ` ${data.country}`;
    document.getElementById("zone-postcode").innerText = document.getElementById("zone-postcode").innerText + ` ${data.postcode}`;
    document.getElementById("zone-city").innerText = document.getElementById("zone-city").innerText + ` ${data.county}`;
}

async function fetchDatafromGeoApify(userData) {
    let response = await fetch(`${baseUrl}reverse?lat=${userData[0]}&lon=${userData[1]}&apiKey=${apiKey}`)
    let data = await response.json();
    let reqData = data.features[0].properties;
    appendUserLocationOnUI(reqData);
}

function getLocation() {
    return new Promise((resolve, reject) => {
        function getPosition(position) {
            resolve([position.coords.latitude, position.coords.longitude])
        }

        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.")
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.")
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.")
                    break;
                case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.")
                    break;
            }
        }

        navigator.geolocation.getCurrentPosition(getPosition, showError);
    })
}

let location_promise = getLocation();

location_promise.then((data) => {
    fetchDatafromGeoApify(data);
})

// get location data using address
function appendDataOnUI(data) {
    console.log(data);
    
    responseContainer.style.border = '1px solid gray';
    responseContainer.style.color = "white";
    const yourResult = document.createElement("h1");
    yourResult.innerText = "Your Result";
    responseContainer.appendChild(yourResult);
   
    const zoneName = document.createElement("p");
    zoneName.innerText = `Name of Time Zone : ${data.timezone.name}`
    responseContainer.appendChild(zoneName);

    const latLongDiv = document.createElement("div");
    latLongDiv.className = "lat-long";
    const latSpan = document.createElement("span");
    latSpan.innerText = `Lat: ${data.lat}`;
    latLongDiv.appendChild(latSpan);
    const longSpan = document.createElement("span");
    longSpan.innerText = `Long: ${data.lon}`; 
    latLongDiv.appendChild(longSpan);
    responseContainer.appendChild(latLongDiv);

    const zoneStd = document.createElement("p");
    zoneStd.innerText = `Offset STD : ${data.timezone.offset_STD}`;
    responseContainer.appendChild(zoneStd);

    const zoneStdSec = document.createElement("p");
    zoneStdSec.innerText = `Offset STD Seconds : ${data.timezone.offset_STD_seconds}`;
    responseContainer.appendChild(zoneStdSec);

    const zoneDst = document.createElement("p");
    zoneDst.innerText =`Offset DST : ${data.timezone.offset_DST}` ;
    responseContainer.appendChild(zoneDst);

    const zoneDstSec = document.createElement("p");
    zoneDstSec.innerText = `Offset DST Seconds : ${data.timezone.offset_DST_seconds}`;
    responseContainer.appendChild(zoneDstSec);

    const country = document.createElement("p");
    country.innerText = `Country : ${data.country}`;
    responseContainer.appendChild(country);

    const postCode = document.createElement("p");
    postCode.innerText = `Postcode : ${data.postcode}` ;
    responseContainer.appendChild(postCode);

    const city = document.createElement("p");
    city.innerText = `City : ${data.county}`;
    responseContainer.appendChild(city);
    
}
function appendError (){
    
    alert("server is busy please try again later");
}
function searchAddress(address) {
    if(address.trim() !==''){
        fetch(`${baseUrl}search?text=${address}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => { appendDataOnUI(data.features[0].properties) })
        .catch(err => { appendError()})
    }else{
        responseContainer.innerText = "Please enter an address!"
        responseContainer.style.color ="red";
    }

}
document.getElementById("find-address-btn").addEventListener("click", () => { 
    responseContainer.innerHTML ='';
    responseContainer.style.border = 'none';
    searchAddress(inputAddress.value) 
});
'use strict';
let mapPart = document.querySelector(".map-part");
const IPAddressText = document.querySelector(".ip-address-text");
const locationText = document.querySelector(".location-text");
const timezoneText = document.querySelector(".timezone-text");
const ISPText = document.querySelector(".isp-text");
const paraghraph = document.querySelectorAll("p");
const searchBtn = document.querySelector(".search-btn");
const searchField = document.querySelector(".search-field");
const mainContainer = document.querySelector(".main-container");
const mainMap = document.querySelector(".main-map");
const IPPart = document.querySelector(".ip-part");
//########################################################
let map;
const loadMap = function(lat,lng){
    map = L.map(mapPart).setView([lat,lng], 11);
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.orgcopyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    const myIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [30, 38],
    });

    L.marker([lat,lng],{icon:myIcon}).addTo(map);
    console.log(map);
}
//#################################################################################
let coords;
let IP = '';
let lat,lng;
paraghraph.forEach((p) => p.classList.add("hidden"));
const geolocation = async function(IP){
    try{
        const res = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=3a84495c890f4795b02a51daac87f220${IP}`);
        coords = await res.json();
        console.log(coords);
        IPAddressText.textContent = coords.ip_address;
        if(coords.country === null) throw new Error();
        locationText.textContent = coords.country;
        coords.timezone.name === null? timezoneText.textContent = "---":timezoneText.textContent = `${coords.timezone.name}-0${coords.timezone.gmt_offset < 0? (coords.timezone.gmt_offset * -1) : coords.timezone.gmt_offset}:00`;
        coords.connection.isp_name === ""? ISPText.textContent = "---" : ISPText.textContent = coords.connection.isp_name;
        paraghraph.forEach((p) => p.classList.remove("hidden"));
        lat = coords.latitude;
        lng = coords.longitude;
        loadMap(lat,lng);
    }
    catch(error){
        IPPart.innerHTML = '';
        const html = `
            <div class="ip-address div">
                <h2>Enter a Valid IP</h2>
                <p class="ip-address-text">We couldn't find the location plz reload the page</p>
            </div>
        `;
        IPPart.insertAdjacentHTML("afterbegin",html);
    }
}
geolocation(IP);

searchBtn.addEventListener('click',function(e){
    e.preventDefault();
    IP = `&ip_address=${searchField.value}`;
    geolocation(IP);
    map.remove();
    
})

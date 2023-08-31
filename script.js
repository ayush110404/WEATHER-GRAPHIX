import{ APIkey} from "./apikey.js";
// const APIkey = require('./apikey.js')
let liveBtn = document.getElementById('live');
let searchBtn = document.getElementById('search');
let searchBar = document.getElementById('searchbar');
let selectMenu = document.getElementById('heatmap')
// const APIkey = `95b5389e5c6f2f552252807b4f76d157`
searchBtn.addEventListener('click',searchLocation)
liveBtn.addEventListener('click',coordLocation)
// reloadBtn.addEventListener('click',()=>{window.location.reload()})
searchBar.addEventListener('keypress',(eve)=>{if(eve.keyCode==13){searchBtn.click()}},false)


async function searchLocation(){
    let city = searchBar.value
    const web = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;
    const res = await fetch(web);
    console.log(res);
    const data = await res.json();
    // console.log(data);
    let {lon,lat} = data.coord;
    console.log(lon,lat);
    displayMap(lat,lon,data);
}
async function coordLocation(){
    navigator.geolocation.getCurrentPosition(async(pos)=>{
        // map.destroyMap();
        let {latitude,longitude} = pos.coords;
        console.log(latitude,longitude);
        const web2 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIkey}&units=metric`
        const res2 = await fetch(web2);
        const data2 = await res2.json();
        // console.log(data2);
        displayMap(latitude,longitude,data2);
    },(err)=>{console.log(err)})
}

var map;
function displayMap(lat,lon,data){
    var mapContainer = document.getElementById('mapArea')
    if(mapContainer._leaflet_id){
        map.remove() 
    }
    let layer = `${selectMenu.value}`
    map= L.map('mapArea',{minZoom:3,maxZoom:6}).setView([lat,lon], 7)
    map.setView([lat,lon], 7)
    console.log(layer)
    const web = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${APIkey}`
    L.tileLayer(web, {
        attribution: '&copy; <a href="https://www.openweathermap.org/copyright">OpenWeatherMap</a> contributors'
        }).addTo(map);
        L.marker([lat,lon]).addTo(map)
            .bindPopup(`${data.name}`)
            .openPopup();
        showWeather(data);

    // function myOwmMarker(data) {
    //     // just a Leaflet default marker
    //     return L.marker([data.coord.lat, data.coord.lon]);
    // }
    
    // function myOwmPopup(data) {
    //     // just a Leaflet default popup with name as content
    //     return L.popup().setContent(data.name);
    // }
    
    // var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 18, attribution: '[insert correct attribution here!]' });
    
    //     var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5, appId: `${APIkey}`});
    //     var city = L.OWM.current({intervall: 15, lang: 'en',markerFunction: myOwmMarker, popupFunction: myOwmPopup});
        
    // map = L.map('mapArea', { center: new L.LatLng(lat, lon), zoom:34, layers: [osm] });
    // var baseMaps = { "OSM Standard": osm };
    // var overlayMaps = { "Clouds": clouds, "Cities": city };
    // var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
    // myOwmMarker(data);myOwmPopup(data)
}
   

const showWeather = (data) => {
    console.log(data);
    let city = data.name
    let country = data.sys.country
    let arealoc = `${city},${country}`
    let temp = Math.floor(data.main.temp) 
    let status = data.weather[0].main;
    let icon = data.weather[0].icon;
    console.log(icon)
    document.getElementById('Area').innerText = `${arealoc}`
    document.getElementById('img').innerHTML = `<h2>${ status }\n</h2><img src=" https://openweathermap.org/img/wn/${icon}@2x.png">`
    document.getElementById('temp').innerText = `  ${temp}℃  `
    document.getElementById('humidity').innerText = `${data.main.humidity}% `
    document.getElementById('realfeel').innerText = `${data.main.feels_like}℃ `
    document.getElementById('wind').innerText = `\u00A0\u00A0\u00A0\u00A0\u00A0${data.wind.speed}m/s `
    document.getElementById('cloud').innerText = `\u00A0\u00A0\u00A0\u00A0${data.clouds.all}% `
}
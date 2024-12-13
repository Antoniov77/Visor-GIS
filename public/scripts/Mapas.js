// Inicializar el mapa
var map = L.map('map').setView([7.885988, -76.638339], 13);

// Mapas base
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});



document.getElementById('Departamento').addEventListener('change', function(e){
    let coords = e.target.value.split(",");
    map.flyTo(coords,8);

})

var baseMaps = {
    "Esri World Imagery": Esri_WorldImagery,
    "OpenStreetMap": osm,
    "Mapa Hot": osmHOT
};

// Control de capas para los overlays
var overlayMaps = {};

// Establecer la vista inicial del mapa centrada en Oficina_TPF
var initialCoordinates = [7.885988, -76.63833]; // Coordenadas de Oficina_TPF
var initialZoom = 14; // Nivel de zoom inicial
map.setView(initialCoordinates, initialZoom);

var marker1 = L.marker([7.885988, -76.63833]).addTo(map);
marker1.bindPopup("<b>Oficina_TPF</b><br>Working.").openPopup();

var marker = L.marker([7.3133066, -76.4830631]).addTo(map);
marker.bindPopup("<b>Vda. Surrambay</b><br>Compensación Vías de las Americas.").openPopup();

var marker = L.marker([8.5949698, -74.6630839]).addTo(map);
marker.bindPopup("<b>Majagual_Sucre</b><br>Compensación Vías de las Americas.").openPopup();

var marker = L.marker([8.5418789, -76.7620786]).addTo(map);
marker.bindPopup("<b>Correjimiento El Mellito</b><br>Compensación Vías de las Americas.<br>").openPopup();
// var circle = L.circle([7.885946, -76.636965], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 50
// }).addTo(map);

// Crear variables globales
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
var estiloBarrio = {
    radius: 8,
    fillColor: "#FF0000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// Función para cargar un GeoJSON y añadirlo al mapa
function cargarGeoJSON(url, nombreCapa) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Crear la capa GeoJSON con estilos y popups
            let capa = L.geoJSON(data, {
                style: estiloBarrio,
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.Area) {
                        layer.bindPopup("Área: " + feature.properties.Area);
                    } else if (feature.properties && feature.properties.AREA) {
                        layer.bindPopup("Área: " + feature.properties.AREA);
                    }
                }
            }).addTo(map);

            // Añadir la capa al control de capas
            layerControl.addOverlay(capa, nombreCapa);

            // Ajustar la vista al polígono cuando se selecciona la capa
            map.on('overlayadd', function (event) {
                if (event.name === nombreCapa) {
                    map.fitBounds(capa.getBounds());
                }
            });
        })
        .catch(err => console.error('Error cargando el archivo GeoJSON:', err));
}

// Cargar las capas GeoJSON
cargarGeoJSON('GeoJSON1/caucheras1.geojson', 'Caucheras');
cargarGeoJSON('GeoJSON1/Mellito.geojson', 'Mellito');
cargarGeoJSON('GeoJSON1/Majagual.geojson', 'Majagual');


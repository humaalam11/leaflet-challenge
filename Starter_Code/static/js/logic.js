// STEP 1: Get the Earthquake Url:
const samples_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// STEP 2: Initialize the function. Create dropdown. 
function createMap(earthquakeLayer) {
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the earthquake layer.
    let overlayMaps = {
        "Earthquake": earthquakeLayer
    };

    // Create the map object with options.
    let map = L.map("map", {
        center: [40.3381653, -90.1953316],
        zoom: 3,
        layers: [streetmap, earthquakeLayer]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
};


function createMarkers(response) {
    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];

    // Loop through the earthquake coordinates array and add markers for each earthquake.
    response.features.forEach(feature => {
        var lon = feature.geometry.coordinates[0];
        var lat = feature.geometry.coordinates[1];
        var mag = feature.properties.mag;
        var popupText = "Magnitude: " + mag;

        for (let i = 0; i < mag.length; i++) {

            // Conditionals for country gdp_pc
            let color = "";
            if (mag[i] < 10) {
                color = "green";
            }
            else if (mag[i] > 30) {
                color = "green yellow";
            }
            else if (mag[i] > 50) {
                color = "yellow";
            }
            else if (mag[i] > 70) {
                color = "orange"
            }
            else {
                color = "red";
            }


            let earthquakeMarker = L.circleMarker([lat, lon], {
                interactive: false,
                color: "white",
                fillColor: color,
                radius: Math.sqrt(mag[i]) * 500,
                fillOpacity: 0.8
            })


            earthquakeMarker.bindPopup(popupText);

            // Add the marker to the earthquakeMarkers array.
            earthquakeMarkers.push(earthquakeMarker);

        }
    });

    // Create a layer group for the earthquake markers and call createMap with it.
    //let earthquakeLayer = L.layerGroup(earthquakeMarkers);
    createMap(L.layerGroup(earthquakeMarkers));
};

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);

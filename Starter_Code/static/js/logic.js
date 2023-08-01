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

    // Creating a legend control
    let legend = L.control({ position: "bottomright" });

    // Function to generate the HTML content for the legend
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let grades = [0, 10, 30, 50, 70];
        let colors = ["green", "greenyellow", "yellow", "orange", "red"];

        // loop through the intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: "
                + colors[i]
                + "'></i> "
                + grades[i]
                + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(map);
}

function createMarkers(response) {
    // Initialize an array to hold earthquake markers.
    let earthquakeMarkers = [];

    // Loop through the earthquake coordinates array and add markers for each earthquake.
    response.features.forEach(feature => {
        var lon = feature.geometry.coordinates[0];
        var lat = feature.geometry.coordinates[1];
        var mag = parseFloat(feature.properties.mag);
        var popupText = "Magnitude: " + mag;

        // Conditionals for magnitude
        let color = "";
        if (mag <= 10) {
            color = "green";
        } else if (mag >= 30) {
            color = "greenyellow";
        } else if (mag >= 50) {
            color = "yellow";
        } else if (mag > 70) {
            color = "orange";
        } else {
            color = "red";
        }

        let earthquakeMarker = L.circleMarker([lat, lon], {
            interactive: false,
            color: "black",
            fillColor: color,
            radius: mag * 3.5,
            fillOpacity: 0.5
        });

        earthquakeMarker.bindPopup(popupText);

        // Add the marker to the earthquakeMarkers array.
        earthquakeMarkers.push(earthquakeMarker);
    });

    // Create a layer group for the earthquake markers and call createMap with it.
    createMap(L.layerGroup(earthquakeMarkers));
}

// Perform an API call to get the earthquake information and call createMarkers when it completes.
d3.json(samples_url).then(createMarkers);

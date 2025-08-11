// Replace with your Azure Maps Key
const subscriptionKey = "YOUR_AZURE_MAPS_KEY";

// Sample campus data
const campusLocations = [
    { name: "Library", coords: [77.5946, 12.9716] },
    { name: "Engineering Block", coords: [77.5950, 12.9721] },
    { name: "Cafeteria", coords: [77.5938, 12.9712] }
];

// Initialize map
var map = new atlas.Map('myMap', {
    center: [77.5946, 12.9716],
    zoom: 17,
    authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey: subscriptionKey
    }
});

map.events.add('ready', function () {
    var datasource = new atlas.source.DataSource();
    map.sources.add(datasource);

    // Add campus markers
    campusLocations.forEach(loc => {
        datasource.add(new atlas.data.Feature(
            new atlas.data.Point(loc.coords),
            { title: loc.name }
        ));
    });

    var symbolLayer = new atlas.layer.SymbolLayer(datasource, null, {
        textOptions: { textField: ['get', 'title'], offset: [0, -1.5] }
    });
    map.layers.add(symbolLayer);

    // Search and route function
    document.getElementById("findBtn").addEventListener("click", () => {
        let searchValue = document.getElementById("searchBox").value.trim();
        let found = campusLocations.find(l => l.name.toLowerCase() === searchValue.toLowerCase());

        if (found) {
            drawRoute(campusLocations[0].coords, found.coords); // Route from Library
        } else {
            alert("Location not found.");
        }
    });
});

// Draw route using Azure Maps Route API
function drawRoute(startCoords, endCoords) {
    fetch(`https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=${subscriptionKey}&query=${startCoords[1]},${startCoords[0]}:${endCoords[1]},${endCoords[0]}&travelMode=pedestrian`)
        .then(res => res.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                let coords = data.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);

                let lineSource = new atlas.source.DataSource();
                map.sources.add(lineSource);
                lineSource.add(new atlas.data.LineString(coords));

                let lineLayer = new atlas.layer.LineLayer(lineSource, null, {
                    strokeColor: "red",
                    strokeWidth: 4
                });
                map.layers.add(lineLayer);

                map.setCamera({ bounds: atlas.data.BoundingBox.fromPositions(coords), padding: 50 });
            }
        });
}

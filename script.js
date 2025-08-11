const subscriptionKey = "YOUR_AZURE_MAPS_KEY";

// Campus data with colors for each building
const campusLocations = [
    { name: "Library", coords: [77.5946, 12.9716], color: 'rgba(0,128,255,0.5)' },
    { name: "Engineering Block", coords: [77.5950, 12.9721], color: 'rgba(0,200,100,0.5)' },
    { name: "Cafeteria", coords: [77.5938, 12.9712], color: 'rgba(255,165,0,0.5)' }
];

var map = new atlas.Map('myMap', {
    center: [77.5946, 12.9716],
    zoom: 17,
    authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey
    }
});

map.events.add('ready', function () {
    var polygonSource = new atlas.source.DataSource();
    var markerSource = new atlas.source.DataSource();

    map.sources.add(polygonSource);
    map.sources.add(markerSource);

    campusLocations.forEach(loc => {
        // Sample square polygon for each building
        polygonSource.add(new atlas.data.Polygon([[
            [loc.coords[0] - 0.0001, loc.coords[1] + 0.0001],
            [loc.coords[0] + 0.0001, loc.coords[1] + 0.0001],
            [loc.coords[0] + 0.0001, loc.coords[1] - 0.0001],
            [loc.coords[0] - 0.0001, loc.coords[1] - 0.0001],
            [loc.coords[0] - 0.0001, loc.coords[1] + 0.0001]
        ]]));

        markerSource.add(new atlas.data.Feature(
            new atlas.data.Point(loc.coords),
            { title: loc.name }
        ));
    });

    // Add building polygons
    map.layers.add(new atlas.layer.PolygonLayer(polygonSource, null, {
        fillColor: ['get', 'color'],
        strokeColor: '#333',
        strokeWidth: 2
    }));

    // Add labels
    map.layers.add(new atlas.layer.SymbolLayer(markerSource, null, {
        textOptions: { textField: ['get', 'title'], offset: [0, -1.5], color: "#000" },
        iconOptions: { image: 'marker-blue', anchor: 'center', allowOverlap: true }
    }));

    // Search button
    document.getElementById("findBtn").addEventListener("click", () => {
        let searchValue = document.getElementById("searchBox").value.trim();
        let found = campusLocations.find(l => l.name.toLowerCase() === searchValue.toLowerCase());

        if (found) {
            drawRoute(campusLocations[0].coords, found.coords);
        } else {
            alert("Location not found.");
        }
    });
});

// Draw route function
function drawRoute(startCoords, endCoords) {
    fetch(`https://atlas.microsoft.com/route/directions/json?api-version=1.0&subscription-key=${subscriptionKey}&query=${startCoords[1]},${startCoords[0]}:${endCoords[1]},${endCoords[0]}&travelMode=pedestrian`)
        .then(res => res.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                let coords = data.routes[0].legs[0].points.map(p => [p.longitude, p.latitude]);
                let lineSource = new atlas.source.DataSource();
                map.sources.add(lineSource);
                lineSource.add(new atlas.data.LineString(coords));

                map.layers.add(new atlas.layer.LineLayer(lineSource, null, {
                    strokeColor: "red",
                    strokeWidth: 4
                }));

                map.setCamera({ bounds: atlas.data.BoundingBox.fromPositions(coords), padding: 50 });
            }
        });
}

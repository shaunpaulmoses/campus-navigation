import React, { useEffect, useRef, useState } from "react";
import * as atlas from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

export default function MapView() {
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const subscriptionKey = "YOUR_AZURE_MAPS_KEY"; // 🔑 Replace with your Azure Maps key

  useEffect(() => {
    const map = new atlas.Map(mapRef.current, {
      center: [80.1625, 12.9832], // Rajalakshmi Engineering College coords
      zoom: 17,
      view: "Auto",
      style: "road",
      authOptions: {
        authType: atlas.AuthenticationType.subscriptionKey,
        subscriptionKey: subscriptionKey,
      },
    });

    map.events.add("ready", () => {
      const dataSource = new atlas.source.DataSource();
      map.sources.add(dataSource);

      const buildings = [
        { name: "Main Building", coordinates: [80.1625, 12.9832] },
        { name: "Library", coordinates: [80.1623, 12.9834] },
        { name: "ECE Block", coordinates: [80.1627, 12.9830] },
        { name: "Canteen", coordinates: [80.1629, 12.9827] },
        { name: "Mechanical Block", coordinates: [80.1621, 12.9836] },
      ];

      buildings.forEach((b) => {
        const point = new atlas.data.Feature(new atlas.data.Point(b.coordinates), {
          name: b.name,
        });
        dataSource.add(point);
      });

      const symbolLayer = new atlas.layer.SymbolLayer(dataSource, null, {
        iconOptions: {
          image: "pin-round-blue",
          allowOverlap: true,
          size: 0.8,
        },
        textOptions: {
          textField: ["get", "name"],
          offset: [0, -2],
          color: "#000",
          font: ["standard", "bold"],
        },
      });

      map.layers.add(symbolLayer);

      // Add popup for building info
      const popup = new atlas.Popup();

      map.events.add("click", symbolLayer, (e) => {
        if (e.shapes && e.shapes.length > 0) {
          const properties = e.shapes[0].getProperties();
          const position = e.shapes[0].getCoordinates();
          popup.setOptions({
            content: `<div style="padding:10px;"><b>${properties.name}</b></div>`,
            position: position,
          });
          popup.open(map);
        }
      });
    });

    return () => map.dispose();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search a building..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button className="bg-recBlue text-white px-6 py-2 rounded-md mt-3 md:mt-0 hover:bg-recGold hover:text-black transition">
          Search
        </button>
      </div>
      <div ref={mapRef} className="w-full h-[75vh] rounded-xl shadow-xl border" />
    </div>
  );
}

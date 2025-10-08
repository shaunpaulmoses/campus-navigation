import React from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto mt-6">
        <MapView />
      </main>
      <footer className="bg-recBlue text-white text-center py-3 mt-6">
        © 2025 Rajalakshmi Engineering College | Campus Navigation System
      </footer>
    </div>
  );
}

export default App;

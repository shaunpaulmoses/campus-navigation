import React from "react";

export default function Header() {
  return (
    <header className="bg-recBlue text-white py-4 px-6 shadow-lg flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/f/fc/Rajalakshmi_Engineering_College_logo.png"
          alt="REC Logo"
          className="w-12 h-12 rounded-full border border-yellow-400"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-wide">
            Rajalakshmi Engineering College
          </h1>
          <p className="text-sm text-recGold italic">
            Campus Navigation System
          </p>
        </div>
      </div>
      <nav className="mt-3 md:mt-0">
        <ul className="flex space-x-6">
          <li className="hover:text-recGold cursor-pointer">Home</li>
          <li className="hover:text-recGold cursor-pointer">Map</li>
          <li className="hover:text-recGold cursor-pointer">About</li>
        </ul>
      </nav>
    </header>
  );
}

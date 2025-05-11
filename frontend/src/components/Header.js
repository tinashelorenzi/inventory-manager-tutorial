// src/components/Header.js
import React from 'react';

function Header() {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold">Inventory Manager</h1>
        <p className="mt-1 text-blue-100">A simple database management application</p>
      </div>
    </header>
  );
}

export default Header;
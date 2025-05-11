// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';
import AddItemForm from './components/AddItemForm';
import Header from './components/Header';

//fetch the backend URL
const backendURL = "https://inventory-manager-tutorial.vercel.app/"

function App() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuantity, setSearchQuantity] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name' or 'quantity'

  // Fetch all inventory items
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/inventory');
      setInventory(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch inventory items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search by name
  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchType === 'name' && searchTerm) {
        const response = await axios.get(`/search?name=${searchTerm}`);
        setInventory(response.data);
      } else if (searchType === 'quantity' && searchQuantity) {
        const response = await axios.get(`/search/quantity?quantity=${searchQuantity}`);
        setInventory(response.data);
      } else {
        // If search terms are empty, fetch all inventory
        fetchInventory();
      }
      setError(null);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const handleAddItem = async (name, quantity) => {
    try {
      await axios.post('/inventory/add', { name, quantity: parseInt(quantity, 10) });
      fetchInventory(); // Refresh the list
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
    }
  };

  // Delete an item
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete('/inventory/delete', { data: { id } });
      fetchInventory(); // Refresh the list
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
    }
  };

  // Load inventory on component mount
  useEffect(() => {
    fetchInventory();
    
    // Set up axios base URL
    axios.defaults.baseURL = backendURL;
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <AddItemForm onAddItem={handleAddItem} />
        </div>
        
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Search Inventory</h2>
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchQuantity={searchQuantity}
            setSearchQuantity={setSearchQuantity}
            searchType={searchType}
            setSearchType={setSearchType}
            onSearch={handleSearch}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory List</h2>
          {loading ? (
            <p className="text-center py-4">Loading inventory...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : (
            <InventoryTable inventory={inventory} onDeleteItem={handleDeleteItem} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
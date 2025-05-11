// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryTable from './components/InventoryTable';
import SearchBar from './components/SearchBar';
import AddItemForm from './components/AddItemForm';
import Header from './components/Header';

// Hard-coded backend URL
const backendURL = "https://inventory-manager-tutorial.vercel.app";

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
      console.log(`Fetching inventory from: ${backendURL}/inventory`);
      const response = await axios.get('/inventory');
      
      console.log('Response data:', response.data);
      
      // Ensure we're setting an array
      const inventoryData = Array.isArray(response.data) ? response.data : [];
      setInventory(inventoryData);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(`Failed to fetch inventory items: ${err.message}`);
      // Set inventory to empty array on error
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  // Search by name
  const handleSearch = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchType === 'name' && searchTerm) {
        console.log(`Searching by name: ${searchTerm}`);
        response = await axios.get(`/search?name=${searchTerm}`);
      } else if (searchType === 'quantity' && searchQuantity) {
        console.log(`Searching by quantity: ${searchQuantity}`);
        response = await axios.get(`/search/quantity?quantity=${searchQuantity}`);
      } else {
        // If search terms are empty, fetch all inventory
        return fetchInventory();
      }
      
      console.log('Search response:', response.data);
      const searchData = Array.isArray(response.data) ? response.data : [];
      setInventory(searchData);
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError(`Search failed: ${err.message}`);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const handleAddItem = async (name, quantity) => {
    try {
      console.log(`Adding item: ${name}, quantity: ${quantity}`);
      const response = await axios.post('/inventory/add', { 
        name, 
        quantity: parseInt(quantity, 10) 
      });
      console.log('Add response:', response.data);
      fetchInventory(); // Refresh the list
    } catch (err) {
      console.error('Error adding item:', err);
      setError(`Failed to add item: ${err.message}`);
    }
  };

  // Delete an item
  const handleDeleteItem = async (id) => {
    try {
      console.log(`Deleting item with ID: ${id}`);
      const response = await axios.delete('/inventory/delete', { data: { id } });
      console.log('Delete response:', response.data);
      fetchInventory(); // Refresh the list
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(`Failed to delete item: ${err.message}`);
    }
  };

  // Load inventory on component mount
  useEffect(() => {
    // Set up axios base URL
    axios.defaults.baseURL = backendURL;
    console.log(`Setting axios base URL to: ${backendURL}`);
    
    // Add some debug information
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Backend URL:', backendURL);
    
    fetchInventory();
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
            <div className="text-red-500 text-center py-4">
              <p>{error}</p>
              <button 
                onClick={fetchInventory} 
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <InventoryTable inventory={inventory} onDeleteItem={handleDeleteItem} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
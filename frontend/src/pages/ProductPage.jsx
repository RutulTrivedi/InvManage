import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import EmptyProduct from '../assets/panel/emptyproduct.png';

const API_BASE = 'https://invmanage-v22c.onrender.com/api/products';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', categoryId: '', unit: '', price: '', description: '', lowStockThreshold: '' });
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  const userId = Cookies.get('userId');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [userId]);

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API_BASE}/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchCategories = () => {
    fetch(`http://localhost:5000/api/category/user/${userId}`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    setForm({
      name: product?.name || '',
      categoryId: product?.categoryId?._id || '',
      unit: product?.unit || '',
      price: product?.price || '',
      description: product?.description || '',
      lowStockThreshold: product?.lowStockThreshold || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setForm({ name: '', categoryId: '', unit: '', price: '', description: '', lowStockThreshold: '' });
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    const payload = { ...form, userId };
    try {
      const response = await fetch(
        editingProduct ? `${API_BASE}/${editingProduct._id}` : API_BASE,
        {
          method: editingProduct ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error');
      Swal.fire({ icon: 'success', title: editingProduct ? 'Product Updated' : 'Product Added', confirmButtonColor: '#F8486E' });
      closeModal();
      fetchProducts();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F8486E',
      cancelButtonColor: '#888',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          Swal.fire('Deleted!', data.message, 'success');
          fetchProducts();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      }
    });
  };

  const filteredProducts = products
    .filter(p => (filterCategory ? p.categoryId?._id === filterCategory : true))
    .sort((a, b) => {
      if (sortOption === 'priceAsc') return a.price - b.price;
      if (sortOption === 'priceDesc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#F8486E]">Manage Products</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#F8486E] text-white px-4 py-2 rounded-lg hover:bg-[#e13c63]"
        >
          Add Product
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label> */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-[#F8486E] focus:border-[#F8486E]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          {/* <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label> */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-[#F8486E] focus:border-[#F8486E]"
          >
            <option value="">None</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>

        {/* <div className="mt-5"> */}
        <div>
          <button
            onClick={() => {
              setFilterCategory('');
              setSortOption('');
            }}
            className="flex items-center text-sm text-gray-500 hover:text-[#F8486E] transition"
            title="Reset filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m0 0A7.003 7.003 0 0112 5c3.866 0 7 3.134 7 7 0 .75-.118 1.47-.338 2.145M20 20v-5h-.581m0 0A7.003 7.003 0 0112 19c-3.866 0-7-3.134-7-7 0-.75.118-1.47.338-2.145" />
            </svg>
            Reset
          </button>
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-[#F8486E] border-dashed rounded-full animate-spin"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500 mt-12">
          <img src={EmptyProduct} alt="No Data" className="w-32 h-64 mb-4" />
          <p>No products found</p>
        </div>
      ) : (
        <table className="w-full table-auto border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <thead className="bg-[#F8486E] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Low Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.categoryId?.name}</td>
                <td className="p-3">{p.unit}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.lowStockThreshold}</td>
                <td className="p-3 flex justify-center gap-4">
                  <button onClick={() => openModal(p)} className="text-blue-500 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4 text-[#F8486E]">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded" />
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border p-2 rounded">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border p-2 rounded" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Low Stock Threshold" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} className="border p-2 rounded" />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal} className="px-4 py-2 border border-gray-400 rounded-md">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-[#F8486E] text-white rounded-md hover:bg-[#e13c63]">
                {editingProduct ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
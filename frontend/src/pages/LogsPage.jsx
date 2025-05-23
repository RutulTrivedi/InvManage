import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import emptyIllustration from '../assets/panel/emptylogs.png'; // <--- Replace with your actual path

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const userId = Cookies.get('userId');
  const API_BASE = 'https://invmanage-v22c.onrender.com/api';

  useEffect(() => {
    fetchLogs();
    fetchProducts();
    fetchLocations();
  }, [userId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/logs/user/${userId}`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/products/user/${userId}`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchLocations = async () => {
    const res = await fetch(`${API_BASE}/locations/user/${userId}`);
    const data = await res.json();
    setLocations(data);
  };

  const handleDelete = async (logId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the log permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F8486E',
      cancelButtonColor: '#888',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`${API_BASE}/logs/${logId}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok) {
          Swal.fire('Deleted!', data.message, 'success');
          fetchLogs();
        } else {
          Swal.fire('Error', data.error, 'error');
        }
      }
    });
  };

  const resetFilters = () => {
    setFilterType('');
    setFilterProduct('');
    setFilterLocation('');
  };

  const filteredLogs = logs.filter(log =>
    (!filterType || log.type === filterType) &&
    (!filterProduct || log.productId?._id === filterProduct) &&
    (!filterLocation || log.locationId?._id === filterLocation)
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#F8486E] mb-6">Inventory Logs</h2>

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border p-2 rounded w-40">
          <option value="">All Types</option>
          <option value="in">In</option>
          <option value="out">Out</option>
          <option value="adjustment">Adjustment</option>
          <option value="transfer">Transfer</option>
        </select>
        <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="border p-2 rounded w-40">
          <option value="">All Products</option>
          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="border p-2 rounded w-40">
          <option value="">All Locations</option>
          {locations.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
        </select>

        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded-full bg-[#FEEEF2] text-[#F8486E] hover:bg-[#fdd7df] transition"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-[#F8486E] border-dashed rounded-full animate-spin"></div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center mt-16">
          <img src={emptyIllustration} alt="No logs" className="w-64 mx-auto mb-6" />
          <p className="text-gray-500 text-lg">No logs found</p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border shadow-md rounded overflow-hidden">
            <thead className="bg-[#F8486E] text-white">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Note</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 capitalize">{log.type}</td>
                  <td className="p-3">{log.productId?.name}</td>
                  <td className="p-3">
                    {log.type === 'transfer'
                      ? `${log.transferDetails?.fromLocationId?.name} ➝ ${log.transferDetails?.toLocationId?.name}`
                      : log.locationId?.name}
                  </td>
                  <td className="p-3">{log.quantity}</td>
                  <td className="p-3">{log.note || '-'}</td>
                  <td className="p-3">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(log._id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogsPage;
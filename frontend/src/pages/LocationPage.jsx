import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import EmptyLocation from '../assets/panel/emptylocation.png';

const API_BASE = 'https://invmanage-v22c.onrender.com/api/locations';

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [form, setForm] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);

  const userId = Cookies.get('userId');

  useEffect(() => {
    fetchLocations();
  }, [userId]);

  const fetchLocations = () => {
    setLoading(true);
    fetch(`${API_BASE}/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setLocations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const openModal = (location = null) => {
    setEditingLocation(location);
    setForm({
      name: location?.name || '',
      address: location?.address || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingLocation(null);
    setForm({ name: '', address: '' });
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    const payload = { ...form, userId };
    try {
      const response = await fetch(
        editingLocation ? `${API_BASE}/${editingLocation._id}` : API_BASE,
        {
          method: editingLocation ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error');
      Swal.fire({
        icon: 'success',
        title: editingLocation ? 'Location Updated' : 'Location Added',
        confirmButtonColor: '#F8486E'
      });
      closeModal();
      fetchLocations();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the location.',
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
          fetchLocations();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#F8486E]">Manage Locations</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#F8486E] text-white px-4 py-2 rounded-lg hover:bg-[#e13c63]"
        >
          Add Location
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-[#F8486E] border-dashed rounded-full animate-spin"></div>
        </div>
      ) : locations.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500 mt-12">
          <img src={EmptyLocation} alt="No Data" className="w-64 mb-4" />
          <p>No locations found</p>
        </div>
      ) : (
        <table className="w-full table-auto border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <thead className="bg-[#F8486E] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id} className="border-b">
                <td className="p-3">{loc.name}</td>
                <td className="p-3">{loc.address}</td>
                <td className="p-3 flex justify-center gap-4">
                  <button
                    onClick={() => openModal(loc)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loc._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#F8486E]">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h3>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 border border-gray-400 rounded-md">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#F8486E] text-white rounded-md hover:bg-[#e13c63]"
              >
                {editingLocation ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPage;
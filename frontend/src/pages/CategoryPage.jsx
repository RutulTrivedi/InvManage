import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import EmptyCategory from '../assets/panel/emptycategory.png';

const API_BASE = 'http://localhost:5000/api/category';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const userId = Cookies.get('userId');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  const openModal = (category = null) => {
    setEditingCategory(category);
    setForm({
      name: category?.name || '',
      description: category?.description || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '' });
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    const payload = { ...form, userId };

    try {
      const response = await fetch(
        editingCategory ? `${API_BASE}/${editingCategory._id}` : `${API_BASE}`,
        {
          method: editingCategory ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error');

      Swal.fire({
        icon: 'success',
        title: editingCategory ? 'Category Updated' : 'Category Added',
        confirmButtonColor: '#F8486E'
      });
      closeModal();
      refreshCategories();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const refreshCategories = () => {
    setLoading(true);
    fetch(`${API_BASE}/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
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
          refreshCategories();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#F8486E]">Manage Categories</h2>
        <button
          onClick={() => openModal()}
          className="bg-[#F8486E] text-white px-4 py-2 rounded-lg hover:bg-[#e13c63]"
        >
          Add Category
        </button>
      </div>

      {!loading && categories.length === 0 ? (
        <div className="text-center py-10">
          <img src={EmptyCategory} alt="No Categories" className="mx-auto w-64 h-48 mb-4" />
          <p className="text-gray-500 text-lg">No categories found.</p>
        </div>
      ) : (
        <table className="w-full table-auto border border-gray-200 shadow-sm rounded-md overflow-hidden">
          <thead className="bg-[#F8486E] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b">
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.description}</td>
                <td className="p-3 flex justify-center gap-4">
                  <button
                    onClick={() => openModal(cat)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
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
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-[#F8486E]">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
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
              <label className="block mb-1 font-semibold">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                {editingCategory ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
};

export default CategoryPage;
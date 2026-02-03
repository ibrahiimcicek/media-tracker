// src/components/AddMediaModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react'; // Search ikonunu kaldırdık, metin kullanacağız

const AddMediaModal = ({ isOpen, onClose, onRefresh, editData }) => {
  const [formData, setFormData] = useState({
    title: '', type: 'Movie', status: 'To Do', rating: 0, progress: 0, imageUrl: ''
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setSearchQuery("");
      setShowResults(false);
    } else {
      setFormData({ title: '', type: 'Movie', status: 'To Do', rating: 0, progress: 0, imageUrl: '' });
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [editData, isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setShowResults(true);
    
    // API Anahtarını alıyoruz
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&language=tr-TR`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("API Hatası:", error);
      alert("Arama yapılamadı. İnternet bağlantınızı veya API Key'i kontrol edin.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectMovie = (movie) => {
    setFormData({
      ...formData,
      title: movie.title,
      type: 'Movie',
      rating: movie.vote_average ? Number(movie.vote_average.toFixed(1)) : 0,
      imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
    });
    setShowResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editData 
        ? `https://media-tracker-api.onrender.com${editData._id}` 
        : 'https://media-tracker-api.onrender.com';
      const method = editData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onRefresh();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Hata: ${errorData.message}`);
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {editData ? 'Kaydı Düzenle' : 'Yeni Medya Ekle'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* --- ARAMA ALANI (Sadece Yeni Eklemede Görünür) --- */}
          {!editData && (
            <div className="mb-6 relative bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
                Otomatik Doldur (TMDB)
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Film adı yazın..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
                
                {/* --- İŞTE ARAMA BUTONU BURADA --- */}
                <button 
                  type="button" 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-md transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  {isSearching ? <Loader2 className="animate-spin" /> : 'ARA'}
                </button>
                {/* ---------------------------------- */}
                
              </div>

              {/* SONUÇ LİSTESİ */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 max-h-60 overflow-y-auto z-50">
                  {searchResults.map((movie) => (
                    <div 
                      key={movie.id} 
                      onClick={() => selectMovie(movie)}
                      className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                    >
                      {movie.poster_path ? (
                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                      ) : (
                        <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                      )}
                      <div>
                        <div className="font-bold text-sm text-gray-800">{movie.title}</div>
                        <div className="text-xs text-gray-500">{movie.release_date?.split('-')[0]} • ⭐ {movie.vote_average}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- MANUEL FORM --- */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500">
                  <option value="Movie">Film</option>
                  <option value="Book">Kitap</option>
                  <option value="Game">Oyun</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500">
                  <option value="To Do">Yapılacak</option>
                  <option value="In Progress">Devam Ediyor</option>
                  <option value="Completed">Tamamlandı</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Puan</label>
                <input type="number" name="rating" min="0" max="10" step="0.1" value={formData.rating} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İlerleme (%)</label>
                <input type="number" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resim URL</label>
              <div className="flex gap-2">
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" />
                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="h-10 w-8 object-cover rounded border" />}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium">İptal</button>
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-lg shadow-blue-500/30">
                {loading ? 'Kaydediliyor...' : (editData ? 'Güncelle' : 'Kaydet')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMediaModal;
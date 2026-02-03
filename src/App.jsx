// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Search, Filter } from 'lucide-react'; // Yeni ikonlar eklendi
import AddMediaModal from './components/AddMediaModal';

function App() {
  // --- STATE TANIMLARI ---
  const [mediaList, setMediaList] = useState([]); // Tüm veriler burada
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Arama ve Filtreleme State'leri
  const [searchTerm, setSearchTerm] = useState(""); 
  const [activeTab, setActiveTab] = useState("All"); // Varsayılan: Hepsi

  // --- VERİ ÇEKME ---
  const fetchMedia = async () => {
    try {
      const response = await fetch('https://media-tracker-api.onrender.com/api/media');
      const data = await response.json();
      setMediaList(data);
      setLoading(false);
    } catch (error) {
      console.error("Hata:", error);
      setLoading(false);
    }
  };

  // --- SİLME VE DÜZENLEME ---
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    try {
      await fetch(`https://media-tracker-api.onrender.com${id}`, { method: 'DELETE' });
      setMediaList(mediaList.filter(m => m._id !== id));
    } catch (error) { console.error(error); }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  useEffect(() => { fetchMedia(); }, []);

  // --- FİLTRELEME MANTIĞI (EN ÖNEMLİ KISIM) ---
  const filteredMedia = mediaList.filter((item) => {
    // 1. Arama Metni Kontrolü (Küçük/büyük harf duyarsız)
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Kategori Kontrolü (Tümü seçiliyse hepsi, yoksa türe göre)
    const matchesTab = activeTab === "All" || item.type === activeTab;

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      
      {/* --- HEADER ALANI --- */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Media Tracker
          </h1>
          <button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all active:scale-95">
            + Yeni Ekle
          </button>
        </div>

        {/* --- ARAMA VE FİLTRE ALANI --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Arama Kutusu */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Film, kitap veya oyun ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Kategori Sekmeleri */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Movie', 'Book', 'Game'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab === 'All' ? 'Tümü' : tab === 'Movie' ? 'Filmler' : tab === 'Book' ? 'Kitaplar' : 'Oyunlar'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <AddMediaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchMedia} 
        editData={editingItem} 
      />

      {/* --- LİSTELEME ALANI --- */}
      <div className="max-w-7xl mx-auto">
        {loading ? <div className="text-center text-slate-500 mt-20">Yükleniyor...</div> : (
          <>
            {/* Eğer arama sonucu boşsa uyarı ver */}
            {filteredMedia.length === 0 ? (
              <div className="text-center py-20">
                <Filter className="mx-auto text-slate-300 mb-4" size={48} />
                <p className="text-slate-500 text-lg">Aradığınız kriterlere uygun kayıt bulunamadı.</p>
                <button onClick={() => {setSearchTerm(""); setActiveTab("All")}} className="text-blue-600 font-medium mt-2 hover:underline">Filtreleri Temizle</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {/* filteredMedia kullanıyoruz! */}
                {filteredMedia.map((media) => (
                  <div key={media._id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative">
                    
                    <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(media)} className="bg-blue-500/80 hover:bg-blue-600 text-white p-1.5 rounded-full"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(media._id)} className="bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full"><Trash2 size={16} /></button>
                    </div>

                    <div className="h-72 bg-slate-200 relative">
                      <img src={media.imageUrl || "https://via.placeholder.com/300x450?text=No+Image"} alt={media.title} className="w-full h-full object-cover object-top" />
                      <span className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm backdrop-blur-sm">
                        {media.type === 'Movie' ? 'Film' : media.type === 'Book' ? 'Kitap' : 'Oyun'}
                      </span>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-slate-800 truncate">{media.title}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded text-yellow-700 font-bold text-sm"><span>★</span>{media.rating}</div>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                        <div className={`h-full transition-all duration-500 ${media.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${media.progress || 0}%` }}></div>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
                         <span className={`px-2 py-1 rounded-full ${media.status === 'Completed' ? 'bg-green-100 text-green-700' : media.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                           {media.status === 'To Do' ? 'Yapılacak' : media.status === 'In Progress' ? 'Devam Ediyor' : 'Tamamlandı'}
                         </span>
                         <span>%{media.progress || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
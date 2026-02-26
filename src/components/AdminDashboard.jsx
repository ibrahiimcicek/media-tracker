import React, { useState, useEffect } from "react";
import { X, Users } from "lucide-react";

const AdminDashboard = ({ token, onClose }) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch("https://media-tracker-api.onrender.com/api/media/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAllData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Admin veri çekme hatası:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

  return (
    <div className="fixed inset-0 bg-slate-100 z-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Kontrol Paneli</h1>
              <p className="text-sm text-slate-500">Sistemdeki tüm kullanıcıların aktiviteleri</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition"
          >
            <X size={20} className="inline mr-1"/> Kapat
          </button>
        </div>

        {loading ? (
          <div className="text-center text-slate-500 mt-20">Veriler yükleniyor...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="p-4 font-semibold">Kullanıcı</th>
                  <th className="p-4 font-semibold">İçerik Adı</th>
                  <th className="p-4 font-semibold">Tür</th>
                  <th className="p-4 font-semibold">Durum</th>
                  <th className="p-4 font-semibold">Puan</th>
                </tr>
              </thead>
              <tbody>
                {allData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {item.userId?.username || "Bilinmiyor"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.userId?.email || "-"}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{item.title}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-yellow-500">★ {item.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allData.length === 0 && (
              <div className="p-8 text-center text-slate-500">Henüz sisteme hiç veri eklenmemiş.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
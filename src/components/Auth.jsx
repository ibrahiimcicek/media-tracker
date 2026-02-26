import React, { useState } from "react";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // True ise Giriş ekranı, False ise Kayıt ekranı
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Hangi kapıya (endpoint) gideceğimizi belirliyoruz
    const endpoint = isLogin ? "login" : "register";
    //const url = `http://localhost:5000/api/auth/${endpoint}`;
      const url = `https://media-tracker-api.onrender.com/api/auth/${endpoint}`;

    try {
      console.log("Tam Adres:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email: formData.email, password: formData.password }
            : formData,
        ),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Giriş başarılıysa Token'ı tarayıcıya (localStorage) kaydet ve App.jsx'e haber ver
          localStorage.setItem("token", data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          onLogin(data.token);
        } else {
          // Kayıt başarılıysa Giriş ekranına yönlendir
          alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
          setIsLogin(true);
        }
      } else {
        alert(`Hata: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu." + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
    <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
      {isLogin ? 'Hoş Geldin' : 'Hesap Oluştur'}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      {!isLogin && (
        <input
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Kullanıcı Adı"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          required
        />
      )}
      <input
        type="email"
        name="email"
        onChange={handleChange}
        placeholder="E-posta Adresi"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
        required
      />
      <input
        type="password"
        name="password"
        onChange={handleChange}
        placeholder="Şifre"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
        required
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
      >
        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
      </button>
    </form>

    <p className="text-center text-gray-500 mt-6 text-sm">
      {isLogin ? 'Hesabın yok mu? ' : 'Zaten bir hesabın var mı? '}
      <span
        onClick={() => setIsLogin(!isLogin)}
        className="text-indigo-600 font-semibold cursor-pointer hover:underline"
      >
        {isLogin ? 'Hemen Kayıt Ol' : 'Giriş Yap'}
      </span>
    </p>
  </div>
</div>
  );
};

export default Auth;

import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true); // True ise Giriş ekranı, False ise Kayıt ekranı
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Hangi kapıya (endpoint) gideceğimizi belirliyoruz
    const endpoint = isLogin ? 'login' : 'register';
    const url = `https://media-tracker-api.onrender.com/api/auth/${endpoint}`; // Kendi localhost portunda deniyorsan burayı http://localhost:5000... yapabilirsin

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // Giriş başarılıysa Token'ı tarayıcıya (localStorage) kaydet ve App.jsx'e haber ver
          localStorage.setItem('token', data.token);
          onLogin(data.token);
        } else {
          // Kayıt başarılıysa Giriş ekranına yönlendir
          alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
          setIsLogin(true);
        }
      } else {
        alert(`Hata: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Bir hata oluştu.' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <input type="text" name="username" placeholder="Kullanıcı Adı" onChange={handleChange} required />
        )}
        <input type="email" name="email" placeholder="E-posta" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Şifre" onChange={handleChange} required />
        
        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? 'Bekleniyor...' : (isLogin ? 'Giriş' : 'Kayıt Ol')}
        </button>
      </form>

      <p style={{ marginTop: '15px', cursor: 'pointer', color: 'blue' }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
      </p>
    </div>
  );
};

export default Auth;
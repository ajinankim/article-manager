import { useState } from 'react'

import { useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  
  const article = {
    title: "기사 제목을 여기에 입력하세요",
    url: "URL을 여기에 입력하세요",
    description: "기사 설명을 여기에 입력하세요",
    image: "https://via.placeholder.com/300x150"
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>기사 앱에 오신 것을 환영합니다</h1>
        <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Google 계정으로 로그인
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '300px', margin: '2rem auto', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <img src={article.image} alt={article.title} style={{ width: '100%', borderRadius: '4px' }} />
      <h2>{article.title}</h2>
      <p>{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
        기사 읽기
      </a>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>로그인 사용자: {user.displayName}</p>
    </div>
  )
}

export default App

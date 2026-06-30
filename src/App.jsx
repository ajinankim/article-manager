import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzvVPXFuQ_TdhSaAu3xYkSSJZ49aTYWSJJT-JFi9JmaJ-o4bZazobPO8bgNvGmbMhxj/exec');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleUpdateFromEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://script.google.com/macros/s/AKfycbzvVPXFuQ_TdhSaAu3xYkSSJZ49aTYWSJJT-JFi9JmaJ-o4bZazobPO8bgNvGmbMhxj/exec?action=processEmails', {
        method: 'POST',
      });
      const result = await response.json();
      alert('업데이트 완료: ' + result.message);
      fetchArticles();
    } catch (error) {
      console.error("Error updating:", error);
      alert('업데이트 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-container">
      <header className="hero">
        <h1>기술 트렌드 인사이트</h1>
        <p>글로벌 기술 변화를 빠르게 파악하세요.</p>
        <button className="action-btn" onClick={handleUpdateFromEmail} disabled={loading}>
          {loading ? '처리 중...' : '데이터 업데이트'}
        </button>
      </header>
      
      {loading ? <p style={{textAlign: 'center'}}>데이터를 불러오는 중입니다...</p> : (
        <main className="article-grid">
          {articles.map((article, index) => (
            <article key={index} className="card">
              <h2>{article.userName}의 추천</h2>
              <p>{article.summary}</p>
              <a href={article.articleUrl} target="_blank" rel="noopener noreferrer">원문 읽기 →</a>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // 백엔드에서 데이터 가져오기
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
      fetchArticles(); // 데이터 새로고침
    } catch (error) {
      console.error("Error updating:", error);
      alert('업데이트 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-container">
      <h1>📰 오늘의 뉴스레터</h1>
      <button onClick={handleUpdateFromEmail} disabled={loading}>
        {loading ? '처리 중...' : '이메일에서 기사 가져오기'}
      </button>
      {loading ? <p style={{textAlign: 'center'}}>로딩 중...</p> : (
        <div className="article-list">
          {articles.map((article, index) => (
            <div key={index} className="card">
              <h2>{article.userName}의 추천 기사</h2>
              <p>{article.summary}</p>
              <a href={article.articleUrl} target="_blank" rel="noopener noreferrer">기사 원문 읽기 →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

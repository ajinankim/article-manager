import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 기능 유지
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

  // 기능 유지
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
    <div className="container">
      <header className="header">
        <h1 className="title">TECH INSIGHT</h1>
        <p className="subtitle">Curated trends from the global tech front.</p>
        <button className="button" onClick={handleUpdateFromEmail} disabled={loading}>
          {loading ? 'Processing...' : 'SYNC ARTICLES'}
        </button>
      </header>
      
      {loading ? (
        <p style={{textAlign: 'center'}}>Loading data...</p>
      ) : (
        <main className="grid">
          {articles.map((article, index) => (
            <article key={index} className="card">
              <span className="card-title">{article.userName} Insights</span>
              <p className="card-summary">{article.summary}</p>
              <a 
                href={article.articleUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="card-link"
              >
                Read Article →
              </a>
            </article>
          ))}
        </main>
      )}
    </div>
  );
}

export default App;

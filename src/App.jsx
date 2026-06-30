import { useState, useEffect, useMemo } from 'react';
import { Search, Menu, User, Bell, ChevronRight, Mail, ArrowRight, PlayCircle, RefreshCw } from 'lucide-react';
import './App.css';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(articles.map(a => a.category))];
    return cats.filter(c => c && c.trim() !== "");
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') return articles;
    return articles.filter(a => a.category === selectedCategory);
  }, [articles, selectedCategory]);

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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="p-2 -ml-2 mr-2 text-gray-600 hover:text-black md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <span className="font-extrabold text-2xl tracking-tighter text-black">
                  THE MIILK<span className="text-blue-600">.</span>
                </span>
              </div>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <a href="#" className="text-gray-900 border-b-2 border-black font-bold px-1 pt-1 text-sm">홈</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 font-medium px-1 pt-1 text-sm transition-colors">트렌드</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 font-medium px-1 pt-1 text-sm transition-colors">인사이트</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 font-medium px-1 pt-1 text-sm transition-colors flex items-center">
                  비디오 <PlayCircle size={14} className="ml-1" />
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-6">
              <button className="text-gray-500 hover:text-black transition-colors" onClick={fetchArticles}>
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button 
                className="bg-blue-600 text-white px-4 py-2 text-sm font-bold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                onClick={handleUpdateFromEmail}
                disabled={loading}
              >
                {loading ? 'SYNCING...' : 'SYNC ARTICLES'}
              </button>
              <div className="hidden sm:flex items-center space-x-3 border-l border-gray-200 pl-6">
                <button className="text-sm font-medium text-gray-700 hover:text-black">로그인</button>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="pt-2 pb-3 space-y-1 px-4">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${selectedCategory === cat ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}
                  onClick={() => { setSelectedCategory(cat); setIsMobileMenuOpen(false); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col mb-12">
          <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Article Manager 인사이트</h2>
            <div className="hidden md:flex space-x-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading && articles.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <div key={index} className="group cursor-pointer flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">{article.category}</span>
                      <span className="text-xs text-gray-400">{article.timestamp}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow whitespace-pre-wrap line-clamp-4">
                      {article.summary}
                    </p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">by {article.userName}</span>
                      <a 
                        href={article.articleUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-bold text-black flex items-center group-hover:text-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Read More <ArrowRight size={14} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredArticles.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              해당 카테고리에 등록된 기사가 없습니다.
            </div>
          )}
        </div>
      </main>

      <footer className="bg-black text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-extrabold text-2xl tracking-tighter text-white mb-6 block">
            THE MIILK<span className="text-blue-500">.</span> CLONE
          </span>
          <p className="text-gray-500 text-sm mb-8">© 2026 Jinan's Article Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Menu, User, Bell, ChevronRight, Mail, ArrowRight, PlayCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // 캐시 방지를 위해 타임스탬프 추가
      const response = await fetch('https://script.google.com/macros/s/AKfycbzvVPXFuQ_TdhSaAu3xYkSSJZ49aTYWSJJT-JFi9JmaJ-o4bZazobPO8bgNvGmbMhxj/exec?t=' + Date.now());
      const data = await response.json();
      console.log("Fetched data:", data);
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
    const cats = ['All', ...new Set(articles.map(a => a.category).filter(Boolean))];
    return cats;
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu size={24} />
              </button>
              <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
                <span className="font-extrabold text-2xl tracking-tight">
                  aJinan's <span className="text-indigo-600 font-black">Manager</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors" onClick={fetchArticles}>
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button 
                className="bg-indigo-600 text-white px-5 py-2 text-sm font-bold rounded-full hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
                onClick={handleUpdateFromEmail}
                disabled={loading}
              >
                {loading ? '동기화 중...' : '이메일 동기화'}
              </button>
            </div>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-2">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`block w-full text-left px-4 py-2 rounded-lg ${selectedCategory === cat ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-600'}`}
                onClick={() => { setSelectedCategory(cat); setIsMobileMenuOpen(false); }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">최신 아티클</h1>
            <p className="text-slate-500 text-sm mt-1">Jinan을 위해 선별된 미디어 인사이트</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-400'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {loading && articles.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((article, index) => {
              const hasImage = article.imageUrl && article.imageUrl.startsWith('http');
              return (
                <div 
                  key={index} 
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                  onClick={() => window.open(article.articleUrl, '_blank')}
                >
                  {/* Thumbnail */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    {hasImage ? (
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-200 text-slate-400 opacity-60">
                        <ImageIcon size={48} className="mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{article.category || 'ARTICLE'}</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                      {article.category || '기타'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-4 whitespace-pre-wrap font-medium">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Contributor</span>
                        <span className="text-xs font-bold text-slate-700">{article.userName}</span>
                      </div>
                      <div className="flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                        Read Story <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-24 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl">
            No articles found in this category.
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-black text-white mb-4">aJinan's Manager</div>
          <p className="text-sm mb-8">Curated for Jinan • Built by aJinan</p>
          <div className="text-[10px] uppercase tracking-widest opacity-50">
            © 2026 aJinan Clone Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

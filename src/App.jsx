import { useState, useEffect, useMemo } from 'react';
import { Search, Menu, User, Bell, ChevronRight, Mail, ArrowRight, PlayCircle, RefreshCw, Image as ImageIcon, ExternalLink, Bookmark } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                className="p-2 -ml-2 text-slate-600 hover:text-indigo-600 md:hidden rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} />
              </button>
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1">
                  aJinan's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Manager</span>
                </span>
              </div>
              <nav className="hidden md:ml-10 md:flex md:space-x-8">
                <a href="#" className="text-indigo-600 border-b-2 border-indigo-600 font-bold px-1 pt-1 text-sm">홈</a>
                <a href="#" className="text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-300 font-medium px-1 pt-1 text-sm transition-colors">트렌드</a>
                <a href="#" className="text-slate-500 hover:text-slate-900 border-b-2 border-transparent hover:border-slate-300 font-medium px-1 pt-1 text-sm transition-colors">인사이트</a>
              </nav>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-6">
              <button
                className="text-slate-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-slate-100"
                onClick={fetchArticles}
                title="새로고침"
              >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                className="bg-slate-900 text-white px-5 py-2 text-sm font-semibold rounded-full hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleUpdateFromEmail}
                disabled={loading}
              >
                {loading ? '동기화 중...' : '이메일 동기화'}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white absolute w-full shadow-lg">
            <div className="pt-2 pb-4 space-y-1 px-4 max-h-80 overflow-y-auto">
              <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">카테고리</p>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-colors ${selectedCategory === cat ? 'text-indigo-700 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  onClick={() => { setSelectedCategory(cat); setIsMobileMenuOpen(false); }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">최신 아티클</h1>
              <p className="text-slate-500 text-sm">이메일로 수집된 최신 뉴스 및 인사이트를 확인하세요.</p>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading && articles.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse">
                  <div className="w-full h-48 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="flex justify-between mb-3">
                    <div className="w-16 h-5 bg-slate-200 rounded"></div>
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-3/4 h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="w-full h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="w-5/6 h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="w-full border-t border-slate-100 pt-4 mt-auto flex justify-between">
                    <div className="w-20 h-4 bg-slate-200 rounded"></div>
                    <div className="w-16 h-4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => {
                const imgUrl = article.imageUrl || article.image || article.thumbnail || article.thumbnailUrl;

                return (
                  <div
                    key={index}
                    className="group flex flex-col bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => window.open(article.articleUrl, '_blank')}
                  >
                    <div className="relative w-full h-52 bg-slate-100 overflow-hidden border-b border-slate-100">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}

                      <div className={`w-full h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-200 text-slate-400 ${imgUrl ? 'hidden' : 'flex'}`}>
                        <div className="flex flex-col items-center opacity-60">
                          <ImageIcon size={36} className="mb-2" />
                          <span className="text-xs font-medium uppercase tracking-widest">{article.category || 'ARTICLE'}</span>
                        </div>
                      </div>

                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                        {article.category || '기타'}
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && filteredArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-white rounded-3xl border border-slate-200 border-dashed">
              <Search size={48} className="text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-700">등록된 기사가 없습니다.</p>
              <p className="text-sm mt-1">이메일 동기화를 진행하거나 다른 카테고리를 선택해보세요.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-extrabold text-2xl tracking-tight text-white flex items-center gap-1 justify-center md:justify-start mb-2">
              aJinan's <span className="text-indigo-400">Manager</span>
            </span>
            <p className="text-slate-500 text-sm">개인 맞춤형 뉴스 및 아티클 관리 플랫폼</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">문의하기</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800/50 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} aJinan's Article Manager. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

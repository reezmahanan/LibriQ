import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Transactions from './pages/Transactions';
import Members from './pages/Members';
import Login from './pages/Login';
import Register from './pages/Register';
import BookModal from './components/BookModal';
import IssueModal from './components/IssueModal';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, loading, isAdmin } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [preselectedBookId, setPreselectedBookId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-9 h-9 animate-spin text-blue-600" />
          <span className="text-sm font-semibold tracking-wide">Starting LibriQ LMS...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Login or Register
  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  // Handlers for Modals
  const handleOpenAddBook = () => {
    setBookToEdit(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setBookToEdit(book);
    setIsBookModalOpen(true);
  };

  const handleOpenIssue = (bookId = null) => {
    setPreselectedBookId(bookId);
    setIsIssueModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onOpenIssueModal={() => handleOpenIssue(null)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onOpenIssueModal={() => handleOpenIssue(null)}
              onOpenAddBookModal={handleOpenAddBook}
            />
          )}

          {activeTab === 'books' && (
            <Books
              onOpenAddBook={handleOpenAddBook}
              onOpenEditBook={handleOpenEditBook}
              onIssueBook={(bookId) => handleOpenIssue(bookId)}
            />
          )}

          {activeTab === 'transactions' && (
            <Transactions onOpenIssueModal={() => handleOpenIssue(null)} />
          )}

          {activeTab === 'members' && isAdmin && (
            <Members onIssueToMember={() => handleOpenIssue(null)} />
          )}
        </main>
      </div>

      {/* Global Book Add/Edit Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSave={() => {
          // Re-render can be triggered by state or pages fetching on mount
        }}
        bookToEdit={bookToEdit}
      />

      {/* Global Issue Modal */}
      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssued={() => {
          // Triggers refresh when pages change or remount
        }}
        preselectedBookId={preselectedBookId}
      />
    </div>
  );
}

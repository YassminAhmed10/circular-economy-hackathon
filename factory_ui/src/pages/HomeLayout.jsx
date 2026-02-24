// ── في AppContent أو HomeLayout – أضف هذا ──────────────────────────────────
// 1. أضف الـ state في AppContent:

const [lang, setLang] = useState('ar');
const [dark, setDark] = useState(false);

// 2. في HomeLayout – مرّر الـ props:
function HomeLayout({ children, user, onLogout, lang, setLang, dark, setDark }) {
  return (
    <div className="app-container" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {user ? (
        <Navbar user={user} onLogout={onLogout} />
      ) : (
        <HomeNavbar
          user={user}
          onLogout={onLogout}
          lang={lang}
          setLang={setLang}
          dark={dark}
          setDark={setDark}
        />
      )}
      <main className="main-content">
        {children}
      </main>
      {!user && <Footer />}
    </div>
  );
}

// 3. في الـ Route – مرّر الـ props للـ Home:
<Route path="/" element={
  <HomeLayout user={user} onLogout={handleLogout} lang={lang} setLang={setLang} dark={dark} setDark={setDark}>
    <Suspense fallback={<PageLoader />}>
      <Home user={user} lang={lang} dark={dark} />
    </Suspense>
  </HomeLayout>
} />
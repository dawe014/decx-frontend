// src/app/magazine/layout.jsx
export default function MagazineLayout({ children }) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    );
  }
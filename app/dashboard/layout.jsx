export const metadata = {
  title: "Dashboard | DECx Marketing Agency",
  description: "Admin and Brand Owner Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <div className="">
      <div className="flex min-h-screen">
        {/* Sidebar can include navigation links based on user role */}

        <main className="flex-1">
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
}

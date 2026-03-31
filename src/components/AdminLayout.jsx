import AdminNavbar from './AdminNavbar';

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <main className="main-content">{children}</main>
    </>
  );
}
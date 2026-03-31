import Footer from './Footer';
import UserNavbar from './UserNavbar';

export default function UserLayout({ children }) {
  return (
    <>
      <UserNavbar />
      <main className="main-content">{children}</main>
      <Footer />
    </>
  );
}
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/PublicLayout';
import About from './pages/About';
import Cabins from './pages/Cabins';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import Menu from './pages/Menu';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCabins from './pages/admin/AdminCabins';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGallery from './pages/admin/AdminGallery';
import AdminLogin from './pages/admin/AdminLogin';
import AdminMenu from './pages/admin/AdminMenu';

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#0b0908] text-white">
      <div className="text-center">
        <h1 className="font-serif text-5xl">Page not found</h1>
        <a className="mt-6 inline-block text-[#d9ad5f]" href="/">
          Return home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cabins" element={<Cabins />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="cabins" element={<AdminCabins />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="gallery" element={<AdminGallery />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

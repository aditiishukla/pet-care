import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Pets from './pages/Pets.jsx';
import PetFormPage from './pages/PetFormPage.jsx';
import Vets from './pages/Vets.jsx';
import VetDetails from './pages/VetDetails.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import Appointments from './pages/Appointments.jsx';
import NearbyClinics from './pages/NearbyClinics.jsx';
import HealthLibrary from './pages/HealthLibrary.jsx';
import HealthArticleDetail from './pages/HealthArticleDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/new" element={<PetFormPage />} />
          <Route path="/pets/:id/edit" element={<PetFormPage />} />
          <Route path="/vets" element={<Vets />} />
          <Route path="/vets/:id" element={<VetDetails />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/book" element={<BookAppointment />} />
          <Route path="/clinics" element={<NearbyClinics />} />
          <Route path="/health" element={<HealthLibrary />} />
          <Route path="/health/:id" element={<HealthArticleDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Experiences from "./pages/Experiences";
import ExperienceDetails from "./pages/ExperienceDetails";
import ShareExperience from "./pages/ShareExperience";
import AIAdvisor from "./pages/AIAdvisor";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import VerifiedExperiences from "./pages/VerifiedExperiences";
import Preparation from "./pages/Preparation";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import Contributors from "./pages/Contributors";
import Messages from "./pages/Messages";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
  path="/companies"
  element={
    <ProtectedRoute>
      <Companies />
    </ProtectedRoute>
  }
/>

<Route
  path="/experiences"
  element={
    <ProtectedRoute>
      <Experiences />
    </ProtectedRoute>
  }
/>
<Route
  path="/experiences/:id"
  element={
    <ProtectedRoute>
      <ExperienceDetails />
    </ProtectedRoute>
  }
/>

<Route
  path="/ai-advisor"
  element={
    <ProtectedRoute>
      <AIAdvisor />
    </ProtectedRoute>
  }
/>

<Route
  path="/preparation"
  element={
    <ProtectedRoute>
      <Preparation />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/share-experience"
  element={
    <ProtectedRoute>
      <ShareExperience />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

<Route
  path="/manage-users"
  element={
    <AdminRoute>
      <ManageUsers />
    </AdminRoute>
  }
/>

<Route
  path="/verified-experiences"
  element={
    <AdminRoute>
      <VerifiedExperiences />
    </AdminRoute>
  }
/>

<Route
  path="/connections"
  element={
    <ProtectedRoute>
      <Connections />
    </ProtectedRoute>
  }
/>

<Route
  path="/messages/:connectionId"
  element={
    <ProtectedRoute>
      <Messages />
    </ProtectedRoute>
  }
/>

<Route
  path="/contributors"
  element={
    <ProtectedRoute>
      <Contributors />
    </ProtectedRoute>
  }
/>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
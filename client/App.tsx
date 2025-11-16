import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClerkWrapper from "@/components/ClerkWrapper";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SOS from "./pages/SOS";
import Guardians from "./pages/Guardians";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Map from "./pages/Map";
import ActivityHistory from "./pages/ActivityHistory";
import HealthCheck from "./pages/HealthCheck";
import EmergencyContacts from "./pages/EmergencyContacts";
import IncidentReports from "./pages/IncidentReports";
import Analytics from "./pages/Analytics";
import SafetyTips from "./pages/SafetyTips";
import Notifications from "./pages/Notifications";
import { AlertProvider } from "./state/AlertContext";

const queryClient = new QueryClient();

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Protected Route Component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const user = localStorage.getItem('user');
  return user ? element : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ClerkWrapper>
        <AlertProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/alerts" element={<ProtectedRoute element={<Alerts />} />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
              <Route path="/activity" element={<ProtectedRoute element={<ActivityHistory />} />} />
              <Route path="/health" element={<ProtectedRoute element={<HealthCheck />} />} />
              <Route path="/map" element={<ProtectedRoute element={<Map />} />} />
              <Route path="/sos" element={<ProtectedRoute element={<SOS />} />} />
              <Route path="/guardians" element={<ProtectedRoute element={<Guardians />} />} />
              <Route path="/emergency-contacts" element={<ProtectedRoute element={<EmergencyContacts />} />} />
              <Route path="/incidents" element={<ProtectedRoute element={<IncidentReports />} />} />
              <Route path="/analytics" element={<ProtectedRoute element={<Analytics />} />} />
              <Route path="/safety-tips" element={<ProtectedRoute element={<SafetyTips />} />} />
              <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AlertProvider>
      </ClerkWrapper>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);

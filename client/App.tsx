import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClerkWrapper from "@/components/ClerkWrapper";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/activity" element={<ActivityHistory />} />
              <Route path="/health" element={<HealthCheck />} />
              <Route path="/map" element={<Map />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/guardians" element={<Guardians />} />
              <Route path="/emergency-contacts" element={<EmergencyContacts />} />
              <Route path="/incidents" element={<IncidentReports />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/safety-tips" element={<SafetyTips />} />
              <Route path="/notifications" element={<Notifications />} />
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

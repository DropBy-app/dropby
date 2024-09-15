import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "@/components/ui/sonner";
import posthog from "posthog-js";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

posthog.init("phc_koQTZmGlqvAIdYCuEeXflz4Kn4b9DYdDur002krDsM", {
  api_host: "https://us.i.posthog.com",
  person_profiles: "always", // or 'always' to create profiles for anonymous users as well
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
      <Toaster />
    </ConvexProvider>
  </StrictMode>
);

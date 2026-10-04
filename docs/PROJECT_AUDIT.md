# MindXray Project Audit — Updated

The original product UI and core reasoning flows are preserved. This version replaces the previous local/demo authentication and browser-only history approach with real Supabase-backed persistence and authentication.

## Frontend
React 19, Vite 7, React Router, Framer Motion, Three.js / React Three Fiber, Lucide, jsPDF.

## Backend
FastAPI, Pydantic, Google GenAI SDK, httpx.

## Data flow
Supabase Auth → React session → FastAPI bearer token → Supabase Auth validation → Gemini reasoning → PostgREST with user's access token → RLS-protected persistence → Results/History.

## Removed
Custom local JWT sessions, demo auth endpoints, seeded fake history, and the browser-only history as the source of truth.

## Preserved
Decision Canvas, Reasoning X-Ray, Assumption Stress Test, critical questions, glassmorphic UI, 3D scenes, report downloads, responsive pages.

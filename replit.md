# ReCicla+ Angola - Recycling Platform

## Overview

ReCicla+ Angola is a digital platform designed to connect waste generators (households, condominiums, businesses) with recyclers in Angola. The platform transforms recycling into an organized, transparent, and incentivized process, promoting a circular economy. Users can create collection requests for recyclable materials, track their environmental impact through points and statistics, and visualize collection locations on an interactive map.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing instead of React Router

**UI Component Strategy**
- **shadcn/ui** component library built on Radix UI primitives, following the "New York" style variant
- **Tailwind CSS** for utility-first styling with custom design tokens
- All UI components are co-located in `client/src/components/ui/` for easy discovery and modification
- Custom theme system supporting light/dark modes via React Context

**State Management**
- **TanStack Query (React Query)** for server state management, caching, and data fetching
- Local state handled via React hooks (useState, useContext)
- Authentication state managed through a custom AuthContext provider

**Design System**
- Follows hybrid design approach inspired by Linear's clean interface and Material Design
- Mobile-first responsive design targeting Angola's mobile-heavy user base
- Typography uses Inter font family from Google Fonts
- Consistent spacing system based on Tailwind's spacing scale
- Custom CSS variables for theming in `client/src/index.css`

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with TypeScript
- Modular route structure defined in `server/routes.ts`
- Custom middleware for request logging and JSON response capture
- In development, integrates with Vite's middleware mode for HMR

**Authentication & Authorization**
- **JWT (JSON Web Tokens)** for stateless authentication with 7-day expiration
- **bcryptjs** for secure password hashing
- Custom middleware (`requireAuth`) validates tokens on protected routes
- User sessions stored client-side in localStorage

**Data Layer**
- **In-memory storage** via `MemStorage` class (development/demo mode)
- Schema defined using **Drizzle ORM** with PostgreSQL dialect in `shared/schema.ts`
- Database configuration expects PostgreSQL via `DATABASE_URL` environment variable
- Type-safe schema validation using **Zod** schemas derived from Drizzle tables

**API Design**
- RESTful API endpoints under `/api` prefix
- Endpoints for authentication (`/api/auth/login`, `/api/auth/register`)
- Collection management (`/api/collections`, `/api/collections/:id/accept`, `/api/collections/:id/complete`)
- User statistics (`/api/stats`) and point transaction history (`/api/points/history`)
- Consistent error handling with JSON responses

### Data Models

**User Model**
- Two user types: "gerador" (waste generator) and "reciclador" (recycler)
- Stores geolocation (latitude/longitude) for map-based matching
- Tracks points earned and total kilograms recycled
- Supports full profile with contact information (email, phone, address)

**Collection Model**
- Represents a waste collection request
- Six waste types: plastic, paper, glass, metal, electronics, organic
- Four status states: available, accepted, completed, cancelled
- Links generator and recycler users
- Includes geolocation, quantity, description, and optional photo URL
- Tracks timestamps for creation, acceptance, and completion

**Point Transaction Model**
- Records all point-based activities
- Transaction types: collection earnings, availability rewards, spending, conversion
- Linked to user and optionally to specific collections

### External Dependencies

**UI Libraries**
- **Radix UI** - Unstyled, accessible component primitives (accordion, dialog, dropdown, select, toast, etc.)
- **Leaflet** - Interactive mapping library for displaying collection locations
- **Lucide React** - Icon library for consistent iconography
- **date-fns** - Date manipulation and formatting with Portuguese (Brazil) locale support
- **React Hook Form** with **Zod** resolver for type-safe form validation

**Styling & Theming**
- **Tailwind CSS** v3+ with custom configuration
- **class-variance-authority** - Type-safe component variant management
- **tailwind-merge** & **clsx** - Utility for merging Tailwind classes safely
- PostCSS with Autoprefixer for CSS processing

**Development Tools**
- **Replit plugins** - Cartographer for codebase mapping, dev banner, runtime error overlay
- **tsx** - TypeScript execution for development server
- **esbuild** - Fast bundler for production server build
- **drizzle-kit** - Database migrations and schema management CLI

**Database Driver**
- **@neondatabase/serverless** - PostgreSQL driver optimized for serverless/edge environments
- Configured for Drizzle ORM integration

**Build & Development**
- Production build creates two outputs: Vite-bundled client in `dist/public` and esbuild-bundled server in `dist`
- Development mode runs both Vite dev server and Express server concurrently
- Server serves static files from Vite build in production
# ThunderFast Electronics

## Overview

ThunderFast Electronics is a pilot e-commerce platform for rapid electronics delivery in Bangalore, India. The core value proposition is same-city electronics delivery in 30-120 minutes from local partner stores. The application aggregates products from multiple local electronics stores and displays pricing/availability comparisons, allowing customers to choose based on price, delivery time, and store ratings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration and meta images

The frontend follows a pages-based structure with reusable components organized into:
- `components/ui/` - shadcn/ui primitives (buttons, cards, dialogs, etc.)
- `components/layout/` - Header, Footer
- `components/modules/` - Feature-specific components (Hero, ProductCard, PilotModal, StoreCard)
- `pages/` - Route components (Home, Search, Store, Admin)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful JSON API under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration

Key API endpoints:
- `GET /api/stores` - List all partner stores
- `GET /api/products` - List all products
- `GET /api/products/search?q=` - Search products
- `GET /api/offers` - List all store-product offers with pricing
- `POST /api/pilot-signup` - Collect pilot program signups
- `POST /api/click-events` - Track user interactions

### Data Model
The schema defines five main entities:
- **Users** - Basic authentication (username/password)
- **Stores** - Partner electronics shops with location, rating, delivery times
- **Products** - Electronics items with SKU, category, specs, images
- **Offers** - Junction table linking products to stores with pricing, delivery fees, stock, ETA
- **PilotSignups/ClickEvents** - Analytics and waitlist tracking

### Development vs Production
- Development: Vite dev server with HMR, served through Express middleware
- Production: Static files built by Vite, served from `dist/public`
- Build process uses esbuild for server bundling with selective dependency bundling for faster cold starts

## External Dependencies

### Database
- **PostgreSQL** - Primary data store via `DATABASE_URL` environment variable
- **Drizzle Kit** - Database migrations and schema push (`db:push` command)

### Third-Party Services
- **connect-pg-simple** - PostgreSQL session storage for Express sessions

### Key NPM Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `express` / `express-session` - HTTP server and sessions
- `wouter` - Client-side routing
- `recharts` - Admin dashboard charts
- Extensive Radix UI primitives for accessible components

### Asset Management
- Static images stored in `attached_assets/` and `client/public/`
- Stock product images referenced from `attached_assets/stock_images/`
- Vite handles asset bundling and path resolution
# Jibreel Bornat Portfolio

## Overview

This is a professional portfolio website for Jibreel Bornat, a Computer Engineering student at Birzeit University. The application features a bilingual (English/Arabic) portfolio with dark/light theme support and an admin panel for content management. It showcases the developer's projects, skills, and contact information in a premium-styled interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with **React 18** using TypeScript and modern development practices:
- **Component Library**: Utilizes Radix UI primitives with shadcn/ui for consistent, accessible components
- **Styling**: TailwindCSS with custom CSS variables for theming and premium design elements
- **State Management**: React Context for theme and language state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Internationalization**: Custom context-based system supporting English and Arabic (RTL)

### Backend Architecture
The server uses **Express.js** with TypeScript in ESM mode:
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit OIDC integration with session-based auth using connect-pg-simple
- **API Design**: RESTful endpoints with proper error handling and request logging
- **Development**: Hot module replacement via Vite integration in development mode

### Database Schema
PostgreSQL database with the following core tables:
- **users**: User profiles from Replit auth (id, email, name, profile image)
- **projects**: Portfolio projects with bilingual content (English/Arabic names and descriptions)
- **contact_messages**: Contact form submissions
- **sessions**: Session storage for authentication

### Authentication & Authorization
- **Provider**: Replit OIDC for secure authentication
- **Session Management**: PostgreSQL-backed sessions with configurable TTL
- **Access Control**: Protected admin routes require authentication
- **Public Access**: Portfolio content is publicly viewable

### UI/UX Design Decisions
- **Theme System**: Dynamic light/dark mode with CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Premium Aesthetics**: Glass morphism effects, premium shadows, and smooth animations
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML structure

### Performance Optimizations
- **Asset Bundling**: Vite's optimized bundling with code splitting
- **Image Optimization**: Proper asset management through Vite's static asset handling
- **Caching Strategy**: TanStack Query handles client-side caching with infinite stale time
- **Database**: Indexed queries and proper connection pooling

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL driver for serverless environments
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library for React

### UI Component Libraries
- **@radix-ui/***: Comprehensive set of accessible UI primitives including dialogs, dropdowns, navigation menus, and form controls
- **@hookform/resolvers**: Form validation with react-hook-form
- **class-variance-authority**: Utility for creating component variants
- **clsx & tailwind-merge**: CSS class manipulation utilities

### Authentication & Session Management
- **openid-client**: OIDC authentication client for Replit integration
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development & Build Tools
- **vite**: Build tool and development server
- **@vitejs/plugin-react**: React support for Vite
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for production server builds

### Styling & Design
- **tailwindcss**: Utility-first CSS framework
- **autoprefixer**: CSS vendor prefix automation
- **date-fns**: Date manipulation utilities
- **lucide-react**: Icon library

### Type Safety & Validation
- **zod**: Schema validation for forms and API endpoints
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation
- **typescript**: Type system for enhanced developer experience
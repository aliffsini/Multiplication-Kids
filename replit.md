# Multiplication Quiz App for Kids

## Overview

This is a gamified multiplication quiz web application designed to help children (ages 6-11) practice their times tables. The app features multiple difficulty levels, customizable quiz settings, timer options, and motivational feedback to make learning multiplication engaging and effective.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks and TanStack Query for server state
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the application
- **API Pattern**: RESTful API with `/api` prefix
- **Development**: Hot module replacement via Vite middleware in development

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations with push-based workflow
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Key Components

### Quiz Engine
- **Question Generation**: Smart algorithm preventing commutative duplicates (e.g., 7×8 vs 8×7)
- **Difficulty Levels**: Easy (2,3,4), Medium (5,6,7), Hard (8,9,12), Extreme (2-12 mixed)
- **Customization**: Manual table selection, question count (10-100), timer options
- **Progress Tracking**: Real-time scoring and performance analytics

### User Interface Components
- **QuizSetup**: Configuration screen for selecting difficulty and options
- **QuizInterface**: Main quiz interaction with timer, progress bar, and feedback
- **ResultsScreen**: Performance summary with detailed answer review
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces

### State Management
- **Quiz State**: Centralized quiz configuration, questions, scoring, and timing
- **Answer Tracking**: Individual question responses and timing data
- **Achievement System**: Performance-based rewards and encouragement

## Data Flow

1. **Setup Phase**: User selects difficulty preset or custom tables → Quiz generator creates question set
2. **Quiz Phase**: Questions presented sequentially → User answers → Immediate feedback → Progress tracking
3. **Results Phase**: Performance calculation → Achievement determination → Detailed review display
4. **Restart Flow**: Option to retry same quiz or configure new parameters

## External Dependencies

### UI Framework
- **Radix UI**: Accessible component primitives (dialogs, buttons, forms)
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lucide React**: Icon library for consistent visual elements

### Development Tools
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form validation and management
- **Date-fns**: Date manipulation utilities
- **Class Variance Authority**: Component variant management

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle Kit**: Database migration and schema management
- **Connect PG Simple**: PostgreSQL session store

## Deployment Strategy

### Build Process
- **Client Build**: Vite bundles React app for static hosting
- **Server Build**: ESBuild compiles TypeScript server for Node.js runtime
- **Asset Optimization**: Automatic code splitting and tree shaking

### Environment Configuration
- **Development**: Local development with Vite HMR and memory storage
- **Production**: Compiled server with static asset serving
- **Database**: Environment-based connection string configuration

### Hosting Requirements
- **Node.js Runtime**: ES modules support required
- **PostgreSQL Database**: Connection via DATABASE_URL environment variable
- **Static Assets**: Served from dist/public directory

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
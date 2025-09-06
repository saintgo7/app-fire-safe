# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a React application built with Create React App. Use these commands for development:

- `npm start` - Start development server (runs on port 3000)
- `npm run build` - Build production bundle
- `npm test` - Run tests with Jest (currently no tests exist)
- `npm test -- --watch` - Run tests in watch mode
- `npm test -- --coverage` - Run tests with coverage report
- `npm run eject` - Eject from Create React App (not recommended)

## Architecture Overview

This is a Korean fire safety management application (소방 안전 관리 앱) with the following structure:

### Core Application Structure
- **App.js** - Main application component with React Router setup
- **index.js** - React application entry point
- **src/components/** - Reusable UI components
- **src/pages/** - Page-level components for different routes
- **src/services/** - Service layer (currently empty)
- **src/utils/** - Utility functions (currently empty)

### Key Components and Pages
- **Header** - Navigation component with Korean text and fire truck emoji
- **Home** - Landing page with feature cards and fire prevention tips
- **EmergencyReport** - Emergency reporting form with 119 direct call functionality
- **SafetyCheck** - Interactive safety checklist with progress tracking

### Routing Structure
- `/` - Home page
- `/emergency` - Emergency reporting page
- `/safety-check` - Safety inspection checklist page

## Important Implementation Details

### Korean Language Support
- All UI text is in Korean (한국어)
- Form labels, buttons, and content are localized
- Emergency features include direct 119 calling functionality

### Emergency Features
- Direct 119 calling via `tel:119` links
- Emergency report form with location, description, severity, and contact fields
- Form validation for required fields

### Safety Checklist System
- Interactive checklist with 6 predefined safety items
- Progress tracking with percentage completion
- Notes section for recording findings
- Real-time completion rate calculation

### State Management
- Uses React hooks (useState) for local component state
- No external state management library (Redux, Context API) currently implemented
- Form data handled locally within components

### Data Flow Patterns
- **EmergencyReport**: Form state managed locally, submitted via console.log and alert
- **SafetyCheck**: Checklist state with completion tracking, no persistence
- **No backend integration**: All data handling is client-side only

## Testing and Development

- Uses standard Create React App testing setup with Jest and React Testing Library
- Test files should follow `*.test.js` or `*.spec.js` naming convention
- Tests directory exists but is currently empty
- When adding tests, place them adjacent to components or in `src/__tests__/` directory

## CSS and Styling
- Component-specific CSS files (e.g., `Header.css`, `Home.css`)
- CSS classes use kebab-case naming convention
- Responsive design patterns should be followed for mobile fire safety use cases

## Browser and Accessibility
- HTML lang attribute set to "ko" for Korean language support
- Meta description in Korean: "소방 안전 관리 앱"
- Includes noscript fallback message in Korean
- Application title: "소방 안전 앱"
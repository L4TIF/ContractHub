# ContractHub

A modern contract management application that allows users to create reusable contract blueprints (templates) and generate contracts from those blueprints. The application features a visual canvas-based editor for designing contract layouts and managing contract workflows.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture and Design Decisions](#architecture-and-design-decisions)
- [Assumptions and Limitations](#assumptions-and-limitations)

## Setup Instructions

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm** or **yarn** or **bun**: Package manager of your choice

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd ContractHub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:8080
   ```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application in development mode
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

### Building for Production

```bash
npm run build
```

The production build will be generated in the `dist` directory and can be deployed to any static hosting service.

## Architecture and Design Decisions

### Technology Stack

- **React 18.3** - Modern UI library with hooks and functional components
- **TypeScript** - Type safety and improved developer experience
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **Zustand** - Lightweight state management with persistence
- **TanStack Query (React Query)** - Server state management (prepared for future API integration)
- **shadcn/ui** - High-quality, accessible component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management and validation
- **Zod** - Schema validation library

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── Blueprint*.tsx  # Blueprint-related components
│   ├── Contract*.tsx   # Contract-related components
│   ├── Dashboard.tsx   # Main dashboard component
│   └── Layout.tsx      # Application layout wrapper
├── pages/              # Page-level components
│   └── NotFound.tsx    # 404 page
├── store/              # State management
│   └── useStore.ts     # Zustand store with persistence
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── types/              # TypeScript type definitions
└── test/               # Test files
```

### State Management

**Zustand** was chosen for state management due to:
- Minimal boilerplate compared to Redux
- Built-in persistence middleware for localStorage
- Simple API that works well with TypeScript
- No need for context providers or complex setup

The store manages:
- **Blueprints**: Reusable contract templates with field definitions
- **Contracts**: Instances created from blueprints with field values and status
- **Initialization**: Default blueprints are loaded on first run

### Data Persistence

- **Local Storage**: All data (blueprints and contracts) is persisted to browser localStorage using Zustand's `persist` middleware
- **Storage Key**: `contract-management-storage`
- **No Backend**: The application currently operates entirely client-side

### Contract Workflow

The application implements a linear contract status workflow:

```
created → approved → sent → signed → locked
```

- **created**: Initial state when a contract is created from a blueprint
- **approved**: Contract has been reviewed and approved
- **sent**: Contract has been sent to signatories
- **signed**: Contract has been signed by all parties
- **locked**: Contract is finalized and cannot be modified
- **revoked**: Contract has been cancelled (can only be revoked from `created` or `sent` status)

### Visual Canvas Editor

- **Blueprint Canvas**: Allows drag-and-drop positioning of form fields on a visual canvas
- **Contract Canvas**: Displays contracts with fields positioned according to their blueprint
- **Field Types**: Supports text, date, checkbox, and signature fields
- **Positioning**: Fields are positioned using absolute coordinates (x, y) on the canvas

### Design Patterns

1. **Component Composition**: Reusable UI components from shadcn/ui
2. **Custom Hooks**: Encapsulated logic in custom hooks (e.g., `use-toast`, `use-mobile`)
3. **Type Safety**: Comprehensive TypeScript types for all data structures
4. **Form Validation**: Zod schemas for form validation (where applicable)
5. **Route-based Code Organization**: Components organized by feature/route

### UI/UX Decisions

- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Accessibility**: Radix UI primitives ensure WCAG compliance
- **Dark Mode Ready**: Theme system in place (next-themes) for future dark mode support
- **Toast Notifications**: User feedback via Sonner toast library
- **Status Indicators**: Visual badges and timelines for contract status tracking

## Assumptions and Limitations

### Assumptions

1. **Single User Application**: The application is designed for single-user use. No authentication or multi-user features are implemented.

2. **Client-Side Only**: All data is stored in browser localStorage. No backend server or database is required.

3. **Browser Compatibility**: The application assumes modern browser support for:
   - ES6+ JavaScript features
   - LocalStorage API
   - CSS Grid and Flexbox

4. **Contract Workflow**: The linear workflow (created → approved → sent → signed → locked) is assumed to be sufficient for most use cases.

5. **Field Types**: The current field types (text, date, checkbox, signature) are assumed to cover common contract needs.

6. **Signature Field**: Signature fields are treated as boolean values. Actual signature capture/rendering is not implemented.

7. **No Version Control**: Blueprint and contract versions are not tracked. Updates overwrite previous versions.

8. **No Collaboration**: Contracts cannot be shared or collaborated on. Each user manages their own contracts independently.

9. **No Export/Import**: There is no functionality to export contracts as PDFs or import external documents.

10. **Default Blueprints**: The application initializes with 6 default blueprints (Employee Contract, Client Agreement, NDA, Freelancer Agreement, Rental Agreement, Sales Agreement).

### Limitations

1. **Data Loss Risk**: 
   - Data is stored only in localStorage, which can be cleared by users
   - No backup or sync functionality
   - Data is browser-specific and not shared across devices

2. **Scalability**:
   - localStorage has size limitations (~5-10MB depending on browser)
   - Large numbers of contracts/blueprints may impact performance
   - No pagination or virtualization for large lists

3. **Security**:
   - No encryption of sensitive contract data
   - No access control or permissions
   - Signatures are not cryptographically verified

4. **Functionality Gaps**:
   - No actual signature capture (signature fields are boolean)
   - No PDF generation or document export
   - No email integration for sending contracts
   - No notifications or reminders
   - No audit trail or change history
   - No search functionality
   - No filtering beyond status-based filtering

5. **Browser Dependencies**:
   - Requires JavaScript to be enabled
   - Requires localStorage to be available
   - May not work in private/incognito mode if localStorage is restricted

6. **Performance**:
   - All data is loaded into memory on application start
   - No lazy loading or code splitting beyond Vite's default
   - Canvas rendering may be slow with many fields

7. **Testing**:
   - Limited test coverage
   - No E2E tests
   - Test infrastructure is set up but not fully utilized

8. **Accessibility**:
   - While using accessible components, full accessibility audit has not been performed
   - Keyboard navigation may not be complete for all features

9. **Internationalization**:
   - No i18n support
   - All text is in English
   - Date formats are not localized

10. **Mobile Experience**:
    - Canvas editor may be difficult to use on small screens
    - Touch interactions for drag-and-drop may not be optimal

### Future Enhancements (Not Currently Implemented)

- Backend API integration
- User authentication and authorization
- Multi-user collaboration
- PDF export functionality
- Email notifications
- Cloud storage sync
- Advanced search and filtering
- Contract templates marketplace
- Version control and history
- Audit logging
- Digital signature integration
- Mobile app version

---

## License

This project is private and proprietary.

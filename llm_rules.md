# LLM Instruction Rules for Habit Tracker WebApp

## 1. Core Constraint: File Size Limit
- **STRICT RULE:** NO file shall exceed 100 lines of code. 
- If a file approaches this limit, immediately refactor and extract logic into smaller, dedicated files (e.g., custom hooks, utility functions, or sub-components).

## 2. Tech Stack & Architecture
- **Framework:** React + TypeScript via Vite.
- **Platform:** Progressive Web App (PWA) optimized specifically for iOS Safari.
- **Hosting:** GitHub Pages (Frontend-only architecture).
- **Data Storage:** 100% local within the browser using `localStorage`.

## 3. Directory Structure
Adhere strictly to this modular structure:
- `/src/components`: Reusable, stateless "dumb" components (e.g., Button, Heatmap).
- `/src/features`: Complex, domain-specific "smart" components (e.g., HabitForm, StatsView).
- `/src/hooks`: Extracted React hooks for state and lifecycle management.
- `/src/store`: Global state management logic (e.g., Zustand or Context).
- `/src/utils`: Pure, stateless functions (e.g., date calculations, validation, file parsing).
- `/src/types`: TypeScript interfaces and type definitions.

## 4. Key Features & Business Logic
- **Habit Configuration:** Must support highly customizable intervals (e.g., daily, weekly, or specific timeframes like "3 times from Monday to Friday").
- **Positive Statistics:** The UI and data visualization must be encouraging. Use a GitHub-style heatmap. Missing a habit should be visualized neutrally (no red colors, no punishing wording). The focus is purely on highlighting progress.
- **Data Portability:** Implement a robust JSON export and import feature directly in the settings, allowing users to backup and restore their `localStorage` state seamlessly.

## 5. Coding Standards
- Write clean, self-documenting code.
- Always provide fully typed TypeScript interfaces for data models (Habits, Records).
- Apply separation of concerns: UI in components, business logic in hooks/utils.

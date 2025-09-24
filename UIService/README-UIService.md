# UI Service

This React application provides the user-facing UI and CLI for the modernized accounting system. It implements:
- Authentication (JWT), session management, and role-based (admin) access
- Account operations: balance inquiry, credit, debit (all routed to API Gateway)
- Audit logs UI for administrators
- Centralized input validation and error handling
- Accessibility (WCAG 2.1) and responsive design
- CLI for batch/automation scenarios
- Telemetry via feedback endpoint
- Modular separation: presentation (React), business via API Gateway (no business logic locally), data access via API client

## Environment Variables
Create `.env` with:
- REACT_APP_API_BASE_URL=https://api.example.com/api/v1

Do not commit secrets.

## Scripts
- npm start — run the web UI (http://localhost:3000)
- npm test — run tests
- npm run build — production build
- npm run cli -- <command> — run CLI
  - Examples:
    - npm run cli -- login --username alice --password secret
    - npm run cli -- balance
    - npm run cli -- credit --amount 10
    - npm run cli -- debit --amount 5
    - npm run cli -- audit-logs
    - npm run cli -- feedback --type feedback --message "Great!"

## Accessibility
- Proper use of roles, aria-labels, aria-live regions, and visible focus
- Semantic headings and form labels
- Reduced motion supported

## Testing Hooks
- The UI uses deterministic labels and roles for Selenium
- The CLI prints JSON outputs suitable for parsing in CI

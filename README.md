# AI-Powered Support Ticket Triage

A full-stack application that analyzes support tickets using local, heuristic-based NLP logic. It categorizes tickets, detects urgency signals, calculates a confidence score, and assigns a priority level.

## Features
- **Frontend**: React SPA built with Vite and vanilla CSS styling.
- **Backend**: Node.js + Express with an SQLite database for data persistence.
- **Analysis Logic**: Domain-specific heuristic-based text analysis.
- **Containerization**: Dockerized frontend and backend via `docker-compose`.

## Setup & Execution

1. **Prerequisites**: Ensure Docker and Docker Compose are installed on your environment.
2. **Start the Application**:
   ```bash
   docker-compose up --build -d
   ```
3. **Access the Services**:
   - Frontend interface: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

## Tests
Basic tests can be run in the `backend/` directory:
```bash
cd backend
npm install
npm test
```

## Architecture & Design Notes
- **Persistence Layer**: Employs SQLite via the `tickets` table to store raw messages alongside computed metrics (category, priority, urgency signals, and confidence).
- **Application Structure**: Separates routing request handling from core business logic using a Controller/Service pattern (`ticket.controller.js` and `analyzer.service.js`).
- **Styling**: Utilizes standard CSS constructs including custom properties, flexbox/grid layouts, and backdrop filters for UI components.
- **Classification Engine**: Keyword-matching algorithm designed for rapid, localized classification handling priority assessments and domain escalations.

## Reflection
### Design Decisions & Trade-offs
- **Data Model & SQLite**: I chose SQLite for zero-setup persistence. The `tickets` table stores raw messages alongside the computed AI metrics (category, priority, urgency_signals (JSON), and confidence). This flattened structure simplifies the API while fulfilling the requirements within the time constraint.
- **REST API + Controller/Service Pattern**: I separated the request handling (`ticket.controller.js`) from the business logic (`analyzer.service.js`). This separation of concerns makes the NLP logic highly testable in isolation.
- **Custom CSS over Tailwind**: To ensure a premium, customized look without relying on heavy frameworks, I used Vanilla CSS with modern properties like CSS variables, flexbox/grid, and backdrop-filter for glassmorphism.

### Future Improvements (With More Time)
1. **Advanced NLP**: Replace exact keyword matching with TF-IDF vectors or a small local model (like a quantized BERT) via ONNX Runtime or TensorFlow.js for true semantic understanding.
2. **Authentication**: Add JWT-based auth for admin dashboards to manage tickets.
3. **Real-time Updates**: Implement WebSockets (Socket.io) to push new tickets to the frontend dashboard instantly, rather than relying on standard polling/refetching.
4. **Pagination**: Implement cursor-based or offset pagination for the history endpoint.

## Customization Rationale: The "Security Risk" Rule

### Rationale
In SaaS and support platforms, a security vulnerability (e.g., a data leak or a hacked account) is severely more critical than a downed server or a billing issue, due to legal and PR ramifications. 

### Implementation
I added a special rule in `analyzer.service.js`. If the text contains words like `hacked`, `breach`, `stolen`, `leak`, or `unauthorized`:
1. The **Priority** is immediately forced to **P0 (Critical)**.
2. The **Category** is forced to **Security**, overriding 'Technical' or 'Account'.
3. The frontend displays a pulsating red alert style specifically tailored to alert support agents of a severe security risk. This bypasses the normal flow and ensures immediate attention.

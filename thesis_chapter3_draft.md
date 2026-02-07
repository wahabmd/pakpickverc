# Chapter 3: System Analysis and Design

## 3.1 Introduction
This chapter outlines the detailed analysis and design phases of PakPick AI. It transitions from the "what" of the problem statement to the "how" of the implementation. We define the requirements, provide a comprehensive view of the system architecture, detail the data models, and explain the algorithmic logic behind the autonomous agents and machine learning modules.

## 3.2 Requirement Analysis
Requirements are divided into functional tasks the system must perform and non-functional qualities the system must possess.

### 3.2.1 Functional Requirements (FRs)
*   **FR1: Keyword-Based Product Discovery:** The system must allow users to input keywords to fetch live market data from Daraz and Telemart.
*   **FR2: Smart Survey Logic:** The system must implement a multi-step diagnostic tool to recommend products based on user-defined constraints (Budget, Category, Risk).
*   **FR3: Autonomous Scraping:** The backend must deploy agents capable of navigating marketplace DOMs to extract price, ratings, and review counts.
*   **FR4: Trend Visualization:** The system must generate interactive time-series graphs showing price movements and estimated sales growth.
*   **FR5: Sentiment Analysis:** The system must process customer reviews to produce a qualitative "Customer Satisfaction" score using NLP.

### 3.2.2 Non-Functional Requirements (NFRs)
*   **NFR1: Performance:** Response time for cached search results must be under 200ms.
*   **NFR2: Scalability:** The database must be able to handle a 100% increase in product records without performance degradation.
*   **NFR3: Resiliency:** The scraping agents must implement semantic mapping to remain functional even if the source website changes its HTML structure slightly.
*   **NFR4: Security:** Environment variables (API keys, DB strings) must be managed using encrypted `.env` configurations.

## 3.3 System Architecture
PakPick AI utilizes a **Three-Tier Architecture** to ensure separation of concerns and maintainability.

### 3.3.1 Presentation Layer (Frontend)
Built using **React.js (TypeScript)** and **Vite**. This layer handles the user interface, state management (using React Hooks), and interactive data visualizations through the **Recharts** library. The styling follows a "Glassmorphism" design system implemented via **Tailwind CSS**.

### 3.3.2 Logic Layer (Backend)
The core intelligence resides in a **FastAPI** (Python) environment. This layer acts as the bridge between the UI and the data sources. It handles:
*   **API Management:** RESTful endpoints for search and recommendations.
*   **Agent Orchestration:** Managing the lifecycle of Playwright-based scraping agents.
*   **ML Execution:** Running forecasting models (Prophet/LSTM) on retrieved data.

### 3.3.3 Data Layer (Database)
A **MongoDB (NoSQL)** database is used for persistent storage. This cluster stores product metadata, historical price points, and ML-generated sentiment scores.

## 3.4 Database Design
Unlike traditional e-commerce apps, PakPick AI requires a flexible schema to handle data from multiple platforms with different attributes.

### 3.4.1 Document-Oriented Schema
We chose a NoSQL approach because marketplace data is heterogeneous.
*   **Collection: `products`**
    *   `_id`: Unique identifier.
    *   `title`: Product name.
    *   `platform`: Daraz or Telemart.
    *   `history`: An array of objects tracking `price` and `review_count` indexed by `timestamp`.
    *   `ml_metrics`: Calculated growth prediction and sentiment flags.

## 3.5 Process Design (Workflows)

### 3.5.1 The Data Fetching Pipeline
1.  User enters a query.
2.  Backend checks **Redis/MongoDB** for a recent snapshot.
3.  If no fresh data exists, the **Autonomous Scraping Agent** is dispatched.
4.  Agent extracts raw HTML -> AI Layer parses data -> Database performs an **Upsert**.
5.  Frontend receives the structured JSON and renders the product table.

### 3.5.2 ML Prediction Logic
The system uses **Review Velocity** as a proxy for sales. 
*   **Algorithm:** `PredictedSales = f(ΔReviews, ΔPrice, SeasonalWeight)`.
*   The **Prophet** model analyzes the `history` array from the database to project a 30-day growth trend line shown in the "Detailed Analysis" view.

## 3.6 UI/UX Design Principles
To provide a premium feel for the FYP defense, the UI follows these principles:
*   **Dark Mode Optimization:** Reducing eye strain while providing a "high-tech" analytics aesthetic.
*   **Progressive Disclosure:** Using the "Details" button to show complex charts only when needed, avoiding information overload on the main search page.
*   **Feedback Loops:** Using loading skeletons and animated messages (e.g., "Scraping Agents are fetching live data...") to keep the user informed of background processes.

## 3.7 Summary
The design of PakPick AI prioritizes flexibility and intelligence. By combining a modern React frontend with a high-performance Python/FastAPI backend and a NoSQL data store, the system provides a robust foundation for real-time marketplace intelligence in Pakistan.

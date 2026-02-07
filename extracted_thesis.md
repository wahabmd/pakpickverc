                              Smart Product Hunting Assistant using AI



    Submitted By:
Wahab Muhammad (COMSC-F22-022)
Muhammad Huzaifa (COMSC-F22-026)

Supervised By:
Junaid Hussain
                                                 Bachelor of Studies in Computer Science

		            	            Academic Year 2022-26

1. Introduction
Project members are working in E-commerece Industry as seller and UGC artist, they came up with the concept to develop a support system that addresses "Choosing a High-Performing Product for online selling," a very stressful problem for new e-commerce sellers.
2. Problem Statement
The e-commerce sector in Pakistan is expanding rapidly, with major local platforms experiencing significant growth in both users and transactions. This growth presents a significant opportunity for entrepreneurs. However, success is fundamentally dependent on identifying the right product—one that has verifiable demand but is not yet highly competitive.
3. Existing Systems and Their Limitations
Existing product hunting tools, such as Helium, Jarvis, and Xenon Hunt, often fall short for local Pakistani sellers due to several key limitations:
Global Focus:
 Tools are typically designed for international markets (Amazon, Shopify, eBay) and often lack localized data for platforms like Daraz, resulting in irrelevant trend predictions and unreliable results for the local Pakistani market.
Passive Overlays:
 Current local tools are often simple browser extensions that provide a basic data overlay on the platform. They require the seller to manually perform analysis, categorization, and tracking of high-potential products using external spreadsheets. The approach is time-consuming, highly inefficient, and prone to human error.

Data Inaccessibility:
 Crucial metrics like real-time sales volume are proprietary and inaccessible. This forces 
existing tools to rely on unreliable, loosely correlated data.
4. Proposed Solution 
The Assistant addresses these problems by:
Fetching Proxy Metrics: We will calculate a Product Opportunity Score (POS) based on publicly available Proxy Metrics (like Review Velocity and Competitive Density). This novel approach bypasses the proprietary sales data barrier while accurately quantifying product demand and market risk.
Survey Guide: The Guided Survey feature will use the seller's specific constraints (budget, margin, etc.) to dynamically adjust the algorithm's weights, ensuring the recommendations are not just popular, but also feasible for that specific seller's business.
Providing Visualization: The system will offer a comprehensive dashboard with interactive trend graphs, shifting the seller from manual data collection and guesswork to data-driven decision-making within a unified platform.
User Interaction: The User can export the reports of a specific product or category for further analysis or save them for future use.
5. Objectives
The primary goal is to develop a product hunting assistant that assists new users in selecting a high-performing product to initiate their e-commerce journey.  To achieve this, the research will focus on the following measurable objectives: 
 Scrapping Agent: Develop and deploy Python-based scraping agents integrated with Celery to reliably collect proxy metrics from at least two distinct local e-commerce platforms on a scheduled basis.
Category Recommendation System: Design and implement a classification logic that aggregates Product Opportunity Score (POS) data to rank and recommend the most promising product categories to the user.
POS Algorithm Implementation: Implement the Product Opportunity Score (POS) algorithm in the backend, which calculates opportunity based on dynamic Metrics (Reviews, Competitive Density, Price Stability).
Trend Detection: Implement and validate a Velocity Trigger mechanism that flags new products as "Quickly Trending."
Interactive Visualization: Develop a Next.js dashboard with Recharts/Chart.js integration that displays comparative data and interactive historical POS trend graphs for multi-platform analysis.
6. Scope of the Project
The system will cover:
Data Sourcing: Collection and normalization of proxy metrics from two different local e-commerce platforms (e.g., Daraz and Markaz).
Model Training: Implementation of the POS algorithm, the Velocity Trigger, and the Category Recommendation System.
Out of Scope
Not more than two platforms and product categories as of now.
Use of proprietary, non-public data (e.g., advertisements, actual sales volume, or specific revenue numbers).
7. Development Flow
Data Layer (Phase I): Develop the Python Scrapers for both platforms. Set up Firestore schemas. Integrate scraping scripts with Celery Beat for periodic, robust data collection and ingestion into Firestore.
Intelligence Layer (Phase II): Implement all logic within the Django backend. This includes the POS formula, the Guided Survey weighting mechanism, the Velocity Trigger logic, and the Category Recommendation classification function. We will utilize Pandas to analyze historical data and empirically tune the algorithm's weights.
Presentation Layer (Phase III): Build the responsive UI using Next.js. The frontend will fetch the pre-calculated POS scores, category rankings, and time-series data via fast Django API endpoints and display them using interactive Recharts graphs.
  Workflow Diagram

# Use official Playwright image as base (contains necessary drivers)
FROM mcr.microsoft.com/playwright/python:v1.45.0-jammy

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers (already in base, but ensure they are linked for python)
RUN playwright install chromium

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=7860

# Command to run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]

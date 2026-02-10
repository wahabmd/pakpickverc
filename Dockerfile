FROM python:3.10

# Set user to avoid permission issues
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Install playwright system dependencies (requires root)
USER root
RUN apt-get update && apt-get install -y \
    libgbm-dev \
    libnss3 \
    libasound2 \
    libxss1 \
    libxtst6 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

USER user
COPY --chown=user backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN playwright install chromium

COPY --chown=user . .

ENV PYTHONPATH=/app
ENV PORT=7860

# FastAPI app run command
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]

FROM python:3.11-slim

# Instalar dependencias y driver ODBC de Microsoft
RUN apt-get update && apt-get install -y

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

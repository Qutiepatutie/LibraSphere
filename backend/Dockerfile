# Use python image
FROM python:3.13-slim

# Go to backend directory
WORKDIR /backend

# Copy dev requirements
COPY dev-requirements.txt ./

# Install requirements
RUN python -m pip install --no-cache-dir -r dev-requirements.txt

# Copy rest of the files to the container
COPY . .

# Expose port for backend
EXPOSE 8000

# Run the backend
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
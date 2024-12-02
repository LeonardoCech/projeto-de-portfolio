
FROM python:3.11-buster as builder

RUN pip install poetry==1.4.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY poetry.lock pyproject.toml ./

RUN target=$POETRY_CACHE_DIR poetry install --without dev --no-root

FROM python:3.11-slim-buster as runtime

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

WORKDIR /app

COPY ./api ./api
COPY ./controller ./controller
COPY ./model ./model
COPY ./src ./src
COPY ./ws ./ws
COPY ./tests ./tests
COPY main.py ./
COPY app.yaml ./
COPY pyproject.toml ./
COPY README.md ./
COPY requirements.txt ./

ARG ENV
ARG CRED

RUN printf "%s" "${CRED}" > /app/gcloud-secret-key.json

RUN echo "ENV=${ENV}" > /app/.env && \
    echo "GOOGLE_APPLICATION_CREDENTIALS=/app/gcloud-secret-key.json" >> /app/.env

EXPOSE 7000

CMD ["python", "main.py"]


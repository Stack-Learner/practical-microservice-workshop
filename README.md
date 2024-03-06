# practical-microservice-workshop

## Run Kong and necessary services

```bash
docker compose -f .\kong-docker-compose.yml up
```

## Run microservices dependency

```bash
docker compose up
```

## Run Keycloak

```bash

docker compose -f ./keycloak-docker-compose.yml up
```

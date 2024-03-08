# practical-microservice-workshop

## Run Kong and necessary services

```bash
cd kong-docker-compose && docker compose -f .\kong-docker-compose.yml up
```

## Run Keycloak

```bash

cd docker keycloak-docker-compose && docker compose -f ./keycloak-docker-compose.yml up
```

## Run microservices dependency

```bash
docker compose up
```

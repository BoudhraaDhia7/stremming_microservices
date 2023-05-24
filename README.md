# Project Name

Short project description or tagline

## Description

This project provides a GraphQL API for movie-related operations, including retrieving movies, publishing movies to Kafka, retrieving movies from microservices, and managing reservations.

The API communicates with other microservices using gRPC and Kafka. It allows users to interact with the API endpoints to perform various actions related to movies and reservations.

## Installation

1. Clone the repository: `git clone https://github.com/your/repo.git`
2. Install dependencies: `npm install`

## Usage

1. Start the server: `npm start`
2. Access the GraphQL API endpoints using HTTP requests.

## GraphQL API Documentation

This is the documentation for the GraphQL API endpoints in the project.

### Table of Contents

- [Introduction](#introduction)
- [Endpoints](#endpoints)
  - [Movies](#movies)
    - [Retrieve Movies](#retrieve-movies)
    - [Publish Movie to Kafka](#publish-movie-to-kafka)
    - [Get Movies from Microservice](#get-movies-from-microservice)
  - [Reservations](#reservations)

### Introduction

The GraphQL API provides access to various functionalities related to movies and reservations. It communicates with other microservices using gRPC and Kafka.

To interact with the GraphQL API, send HTTP requests to the appropriate endpoints described below.

### Endpoints

#### Movies

##### Retrieve Movies

- Method: GET
- Endpoint: `/api/v1/movies`

This endpoint retrieves a list of movies.

**Example Request:**

```bash
GET /api/v1/movies
```

**Example Response:**

````HTTP/1.1 200 OK
Content-Type: application/json

[

{
"id": 1,
"title": "Movie 1",
"genre": "Action"
},
{
"id": 2,
"title": "Movie 2",
"genre": "Comedy"
}
]```
````

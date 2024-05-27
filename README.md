# Event Management API

### Project brief

Backend System for a Virtual Event Management Platform

### Project Description:

backend system for a virtual event management platform focusing on user registration, event scheduling, and participant management, all managed through Prisma ORM and Postgres Database

### User schema:

```
{
  "id": UUID
  "name": string,
  "email": string,
  "password": string,
  "eventsOrganized": Array<Event>
  "eventsParticipated": Array<Event>
}
```

### Event schema:

```
{
  "id": UUID
  "title": string,
  "description": string,
  "date": string,
  "time": string,
  "organizerId": UUID
  "organizer": User
  "participants": Array<User>
}
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/cksadhukhan/event-management
```

Go to the project directory

```bash
  cd event-management
```

Install dependencies

```bash
  npm install
```

Start the production server

```bash
  npm run start
```

Start the development server

```bash
  npm run dev
```

## Endpoints

### Auth

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | /users/register | Register the user          |
| POST   | /users/login    | Singin the registered user |

### Event

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | /events              | Create an event       |
| GET    | /events              | Get all events        |
| GET    | /events/:id          | Get an event          |
| PUT    | /events/:id          | Update an event       |
| DELETE | /events/:id          | Delete an event       |
| POST   | /events/:id/register | Register for an event |


-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "active" boolean,
    "email" boolean,
    "clearance" INT DEFAULT 1
);

CREATE TABLE "exercise" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (80) UNIQUE NOT NULL,
    "description" VARCHAR (500) NOT NULL,
    "resources" VARCHAR
);

CREATE TABLE "workout" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "week" DATE,
    "feedback" VARCHAR (1000)
);

CREATE TABLE "exercise_workout" (
    "id" SERIAL PRIMARY KEY,
    "exercise_id" INT REFERENCES "exercise",
    "workout_id" INT REFERENCES "workout",
    "reps" INT,
    "sets" INT,
    "weight" INT,
    "completed" boolean,
    "tips" VARCHAR (1000),
    "feedback" INT
);
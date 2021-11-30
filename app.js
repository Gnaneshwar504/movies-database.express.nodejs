const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log(db.filename);
    app.listen(3000, () => {
      console.log(`server is Running`);
    });
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertMovieDBObjectToResponseObject = (DBObject) => {
  return {
    movieId: DBObject.movie_id,
    directorId: DBObject.director_id,
    movieName: DBObject.movie_name,
    leadActor: DBObject.lead_actor,
  };
};

const convertDirectorDBObjectToResponseObject = (DBObject) => {
  return {
    directorId: DBObject.director_id,
    directorName: DBObject.director_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT
     movie_name
     FROM 
    movie;`;

  const movieArray = await db.all(getMovieQuery);
  response.send(
    movieArray.map((eachMovie) => ({
      movieName: eachMovie.movie_name,
    }))
  );
});

app.post("/movies", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMoviesQuery = `INSERT 
    INTO 
    movie(director_id, movie_name, lead_actor)
    VALUES
    (${directorId}, '${movieName}', '${leadActor}');`;
  await db.run(postMoviesQuery);
  response.send("movie successfully added");
});

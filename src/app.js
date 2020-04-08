const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validId);

const repositories = [];


function validBody(request, response, next) {
  const {title, url, techs} = request.body;
  if (title && url && Array.isArray(techs)) {
    return next();
  } else {
    return response.status(400).json({"error": "Provide a valid body with title, url and techs (array)!"});
  }
}

function validId(request, response, next) {
  const { id } = request.params;
  if (isUuid(id)) {
    return next();
  } else {
    return response.status(400).json({"error": "The provided ID is not a valid."});
  }
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", validBody, (request, response) => {
    const {title, url, techs} = request.body;
    const id = uuid();
    const likes = 0;

    const project = {
      id,
      title,
      url,
      techs,
      likes
    };
    repositories.push(project);
    return response.json(project)

});

app.put("/repositories/:id", validBody, (request, response) => {
    const { id } = request.params;
    const {title, url, techs} = request.body;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);    

    if (repositoryIndex < 0){
      return response.status(400).json({"error": "The provided ID doesn't exists"})
    } else {
        const { likes } = repositories[repositoryIndex];
        const repository = {
          id,
          title,
          url,
          techs,
          likes
        };
        repositories[repositoryIndex] = repository;
        return response.json(repository);
    }
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(item => item.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({"error": "The provided ID doesn't exists"})
  } else {
    repositories.splice(repositoryIndex, 1);
    return response.status(204).send();
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(item => item.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({"error": "The provided ID doesn't exists"})
  } else {
    const repository = repositories.find(item => item.id === id);
    const newRepository = {...repository, likes: repository.likes +1 };
    repositories[repositoryIndex] = newRepository;
    return response.json({likes : newRepository.likes});
  }
});

module.exports = app;

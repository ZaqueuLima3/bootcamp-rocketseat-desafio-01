const express = require("express");

const server = express();

server.use(express.json());

let projects = [];

function checkProjectExist(req, res, next) {
  const { id } = req.params;

  if (!id) return res.status(401).json({ error: "you must send the ID" });

  projects.map(project => {
    if (project.id == id) {
      req.project = project;

      return next();
    }
  });

  return res.status(401).json({ error: "project not exist" });
}

let reqs = 0;
function checkTotalRequest(req, res, next) {
  console.log(`Total de requisições ${++reqs}`);

  return next();
}

server.use(checkTotalRequest);

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  projects.splice([projects.indexOf(req.project)], 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(req.project);
});

server.listen(3000);

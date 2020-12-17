const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;

const { verifySignUp } = require("../middleware");
const auth_controller = require("../controllers/auth.controller");

const user_controller = require("../controllers/user.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  app.post('/api/todos', todosController.create);
  app.get('/api/todos', todosController.list);
  app.get('/api/todos/:todoId', todosController.retrieve);
  app.put('/api/todos/:todoId', todosController.update);
  app.delete('/api/todos/:todoId', todosController.destroy);

  app.post('/api/todos/:todoId/items', todoItemsController.create);
  app.put('/api/todos/:todoId/items/:todoItemId', todoItemsController.update);
  app.delete(
    '/api/todos/:todoId/items/:todoItemId', todoItemsController.destroy
  );
  app.all('/api/todos/:todoId/items', (req, res) => res.status(405).send({
    message: 'Method Not Allowed',
  }));


  //auth
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    auth_controller.signup
  );

  app.post("/api/auth/signin", auth_controller.signin);

  //user
  app.get("/api/test/all", user_controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    user_controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    user_controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    user_controller.adminBoard
  );

};

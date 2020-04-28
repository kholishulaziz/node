const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const status = require("http-status");
const user = db.users;
const Op = db.Sequelize.Op;

// Create
const create = (req, res) => {
  let newUser = {
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 8)
  };

  user.create(newUser)
    .then(data => {
      res.status(status.CREATED).send(data);
    })
    .catch(e => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        message: e.message 
      });
    });
};

// Retrieve all
const findAll = (req, res) => {
  let email = req.query.email;
  let condition = email ? { email: { [Op.like]: `%${email}%` } } : null;

  user.findAll({ where: condition })
    .then(data => {
      if (data.length > 0) {
        res.send(data);
      } else {
        res.status(status.NO_CONTENT).send();
      }
    })
    .catch(e => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    });
};

// Retrieve a single with id
const findOne = (req, res) => {
  let user_id = req.params.user_id;

  user.findByPk(user_id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(status.NO_CONTENT).send();
      }
    })
    .catch(e => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    });
};

// Update with id
const update = (req, res) => {
  let user_id = req.params.user_id;

  user.update(req.body, {
    where: { user_id: user_id }
  })
    .then(num => {
      let id = (req.body.user_id != null ? req.body.user_id : user_id)
      if (num == 1) {user.findByPk(id)
        .then(data => {
          res.send(data);
        })
      } else {
        res.status(status.NO_CONTENT).send();
      }
    })
    .catch(e => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    });
};

// Delete with id
const deleteOne = (req, res) => {
  let user_id = req.params.user_id;

  user.destroy({
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send();
      } else {
        res.status(status.NO_CONTENT).send();
      }
    })
    .catch(e => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    });
};

// Delete all 
const deleteAll = (req, res) => {
  user.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(e => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    });
};

const checkDuplicateUserOrEmail = (req, res, next) => {
  let user_id = req.body.user_id;
  let email = req.body.email;

  user.findByPk(user_id)
    .then(user => {
      if (user) {
        res.status(status.BAD_REQUEST).send({
          message: `Failed! Username '${user_id}' is already in use!`
        });
        return;
      }
    });

  user.findOne({
      where: { email: email }
    })
      .then(user => {
        if (user) {
          res.status(status.BAD_REQUEST).send({
            message: `Failed! Email '${email}' is already in use!`
          });
          return;
        }
    });
  next();
};

const verifyUser = (req, res) => {
  let user_id = req.body.user_id;
  let password = req.body.password;

  user.findByPk(user_id)
    .then(data => {
        if (!data) {
          return res.status(status.NOT_FOUND).send({ 
            message: `User Not found.` 
          });
        }
        let passwordIsValid = bcrypt.compareSync(
          password,
          data.password
        );
        if (!passwordIsValid) {
          return res.status(status.UNAUTHORIZED).send({
            message: `Invalid Password!`
          });
        }

        let token = jwt.sign({ id: user_id }, process.env.AUTH_KEY, {
          expiresIn: +process.env.AUTH_EXP_5_MINUTES
        });
    
        res.send({
          user_id: data.user_id,
          email: data.email,
          role: data.role,
          accessToken: token
        });      
    })
    .catch(e => {
      res.status(status.INTERNAL_SERVER_ERROR).send({
        message: e.message
      });
    });
};

const isAdmin = (req, res, next) => {
  user.findByPk(req.user_id)
    .then(data => {
      if (data.role == "ADMIN") {
        next();
        return;
      } else {
        res.status(status.FORBIDDEN).send({
          message: `Require Admin Role!`
        });
        return;
      }
    })
    .catch(e => console.log(`Error: `+e))
}

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  deleteAll,
  checkDuplicateUserOrEmail,
  verifyUser,
  isAdmin
}
const db = require("../models");
const bcrypt = require("bcryptjs");
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

module.exports = {
  create,
  findAll,
  findOne,
  update,
  deleteOne,
  deleteAll
}
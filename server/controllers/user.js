const { v4: uuidv4 } = require("uuid");
const db = require("../models");
const User = db.User;

/** Create and Save a new User  */
exports.create = async (req, res) => {
  const { identity, password, name, email, mbti, gender } = req.body;

  if (!req.body.identity) {
    res.status(400).send({
      message: "ID can not be empty!",
    });
    return;
  }

  const user = {
    id: uuidv4(),
    identity,
    password,
    email,
    name,
    // mbti,
    // gender,
  };

  try {
    const created = await User.create(user);
    res.send(created);
  }
  catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the User.",
    });
  }
};

/** Retrieve all Users from the database. */
exports.findAll = async (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

/** Find a single User with an id  */
exports.findOne = async (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

exports.findByIdentityAndPassword = async (req, res) => {
  const { identity, password } = req.body;

  try {
    const foundUser = await User.findOne({
      where: {
        identity: identity,
        password: password,
      },
    });

    return foundUser;
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving User with id=" + id,
    });
  }
};

/** Update a User by the id in the request  */
exports.update = async (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

/** Delete a User with the specified id in the request */
exports.delete = async (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

/** Delete all Users from the database.  */
exports.deleteAll = async (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

/** Find all published Users  */
exports.findAllPublished = async (req, res) => {
  User.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

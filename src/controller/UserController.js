require("dotenv").config();

const { usuarios } = require("../database/models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  async createUser(req, res) {
    try {
      const { nome, email, senha, CPF, ADM } = req.body;
      const userEmail = await usuarios.findOne({ where: { email } });
      const userCPF = await usuarios.findOne({ where: { CPF } });

      const { requesting_user } = req.params;
      const requestingUser = await usuarios.findOne({
        where: { id: requesting_user },
      });

      if (userEmail) {
        res
          .status(400)
          .json({ message: "Já existe um usuário com este email" });
        return;
      }
      if (userCPF) {
        res.status(400).json({ message: "Já existe um usuário com este CPF" });
        return;
      }
      if (nome === "" || email === "" || senha === "" || CPF === "" || DATANASC === "") {
        res.status(400).json({ message: "Campos não podem ser nulos" });
        return;
      }
      if (requestingUser.ADM) {
        bcrypt.hash(senha, 10).then(async (hash) => {
          usuarios.create({
            nome: nome,
            email: email,
            senha: hash,
            CPF: CPF,
            ADM: ADM,
            DATANASC: DATANASC,
          });
          res.status(201).json({ message: "Usuário criado com sucesso" });
        });
      } else {
        res.status(401).json({ message: "Não permitido" });
      }
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  },

  async updateUser(req, res) {
    try {
      const { requesting_user, id } = req.params;
      const { nome, email, senha, ADM, DATANASC } = req.body;
      const user = await usuarios.findOne({ where: { id } });
      const requestingUser = await usuarios.findOne({
        where: { id: requesting_user },
      });

      if (requestingUser.ADM == true) {
        if (!user) {
          res.status(400).json({ message: "Nenhum usuário encontrado" });
        } else {
          bcrypt.hash(senha, 10).then((hash) => {
            usuarios.update(
              { nome: nome, email: email, senha: hash, ADM: ADM, DATANASC: DATANASC },
              { where: { id: id } }
            );
            res.status(202).json({ message: "Usuário Alterado" });
          });
        }
      } else {
        res.status(401).json({ message: "Não permitido" });
      }
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  },

  async deleteUser(req, res) {
    try {
      const { requesting_user, id } = req.params;
      const requestingUser = await usuarios.findOne({
        where: { id: requesting_user },
      });
      const user = await usuarios.findOne({ where: { id: id } });

      if (requestingUser.ADM == true) {
        if (!user) {
          res.json({ message: "Usuário não existe" });
        } else {
          usuarios.destroy({ where: { id: id } });
          res.status(200).json({ message: "Usuário excluído" });
        }
      } else {
        res.status(401).json({ message: "Não permitido" });
      }
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  },

  async userList(req, res) {
    try {
      const users = await usuarios.findAll();

      if (!users) {
        res.status(400).json({ message: "Não há usuario cadastrados" });
      }
      res.status(200).json({ users });
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  },

  async userAuth(req, res) {
    try {
      const { email, senha } = req.body;

      const user = await usuarios.findOne({ where: { email: email } });

      bcrypt.compare(senha, user.senha).then((match) => {
        if (!match) {
          res.json({ error: "Usuário ou senha errados" });
          return;
        }

        const accessToken = sign(
          { id: user.id, nome: user.nome, email: email, ADM: user.ADM },
          process.env.SECRET
        );
        res.json({
          token: accessToken,
          nome: user.nome,
          email: email,
          ADM: user.ADM,
        });
      });
    } catch (error) {
      res.status(400).json({ error: `${error}` });
    }
  },

  async validToken(req, res) {
    res.json(req.user);
  },
};

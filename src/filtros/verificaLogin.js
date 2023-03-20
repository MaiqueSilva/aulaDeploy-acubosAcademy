const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');
const knex = require('../conexao');

const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, senhaHash);

        const query = await knex("usuarios").where("id",id);

        if (query.length === 0) {
            return res.status(400).json("O usuario não foi encontrado");
        }

        // const query = 'select * from usuarios where id = $1';
        // const { rows, rowCount } = await conexao.query(query, [id]);

        // if (rowCount === 0) {
        //     return res.status(404).json('Usuario não encontrado');
        // }

        const { senha, ...usuario } = query[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = verificaLogin
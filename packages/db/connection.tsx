import { Sequelize } from 'sequelize';

const client = new Sequelize(process?.env?.DB_URL ?? '');

export default client


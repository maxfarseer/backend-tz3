import { dropCollections, closeConnection, cleanDb } from './utils';
import mongoose from 'mongoose';
import config from '../config';

let connection;
beforeAll(async () => {
  connection = mongoose.connect(`mongodb://${config.database.host}/${config.database.databaseName}`, config.database.options, (err) => {
    if (err) throw err;
  });

  await new Promise(res => mongoose.connection.on('connected', () => {  
    console.log('Mongoose default connection open to');
    res();
  }));
}, 5000);

// await or real connections closes
afterAll(async () => {
  cleanDb();
  await closeConnection(connection);
});

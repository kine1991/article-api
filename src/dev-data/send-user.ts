// select current directory, after npx ts-node send-user.ts --import or npx ts-node send-user.ts --delete
import fs from 'fs'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../models/userModel';

dotenv.config({ path: '../../config.env' });


const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD!
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const user = JSON.parse(fs.readFileSync('./user.json', 'utf-8'));

const importData = () => {
  user.map(async (data: any) => {
    try {
      const newUser = await User.create(data);
      console.log('newUser', newUser); 
    } catch (error) {
      console.log('error', error); 
    }
  });
}

// importData();

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await User.deleteMany({});
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--import') {
  importData();
}
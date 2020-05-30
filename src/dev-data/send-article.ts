// select current directory, after npx ts-node send-article.ts --import or npx ts-node send-article.ts --delete
import fs from 'fs'
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../models/userModel';
import Article from '../models/articleModel';

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

  console.log('user');

const getUserIds = async () => {
  const users = await User.find({});
  const userId = users.map(user => user._id)
  return userId;
}

const importData = async () => {
  try {
    const userIds = await getUserIds();
    const authors = ['John Smith', 'Ray Smith', 'Dylan Johnson', 'Justin Johnson', 'Karl Williams', 'Roy Brown', 'Laura Brown', 'Shaun Miller', 'Ted Wilson', 'Tim Anderson']
    
    const articles = JSON.parse(fs.readFileSync('./articles.json', 'utf-8'));
    articles.map((article: any) => {
      const randomuserIdsIndex = Math.ceil(Math.random()*userIds.length);
      article.publisher = userIds[randomuserIdsIndex - 1];
      article.priority = Math.ceil(Math.random()*10);
      // console.log('@@@',Math.ceil(Math.random()*authors.length))
      // console.log('@@@2',authors[Math.ceil(Math.random()*authors.length)])
      article.author = authors[Math.ceil(Math.random()*authors.length - 1)];
    });
  
    await Article.create(articles);
  } catch (error) {
    console.log(error)
  }
  process.exit();
}

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Article.deleteMany({});
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
// getUser().then(x => {
//   console.log('x', x)
// })
// console.log();

// const user = JSON.parse(fs.readFileSync('./user.json', 'utf-8'));

// const importData = () => {
//   user.map(async (data: any) => {
//     try {
//       const newUser = await User.create(data);
//       console.log('newUser', newUser); 
//     } catch (error) {
//       console.log('error', error); 
//     }
//   });
// }

// // importData();

// // DELETE ALL DATA FROM DB
// const deleteData = async () => {
//   try {
//     await User.deleteMany({});
//     console.log('Data successfully deleted!');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// if (process.argv[2] === '--delete') {
//   deleteData();
// } else if (process.argv[2] === '--import') {
//   importData();
// }

// {
//   "title": "",
//   "description": "",
//   "author": "",
//   "content": "",
//   "priority": "",
//   "category": "https://www.sport-express.ru/figure-skating/reviews/chto-proishodit-s-medvedevoy-kto-vyigraet-olimpiadu-2022-goda-intervyu-igorya-bobrina-1677254/",
//   "priority": "",
//   "priority": 1,
// },
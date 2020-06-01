"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// select current directory, after npx ts-node send-article.ts --import or npx ts-node send-article.ts --delete
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/userModel"));
const articleModel_1 = __importDefault(require("../models/articleModel"));
dotenv_1.default.config({ path: '../../config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('DB connection successful!'));
console.log('user');
const getUserIds = async () => {
    const users = await userModel_1.default.find({});
    const userId = users.map(user => user._id);
    return userId;
};
const importData = async () => {
    try {
        const userIds = await getUserIds();
        const authors = ['John Smith', 'Ray Smith', 'Dylan Johnson', 'Justin Johnson', 'Karl Williams', 'Roy Brown', 'Laura Brown', 'Shaun Miller', 'Ted Wilson', 'Tim Anderson'];
        const articles = JSON.parse(fs_1.default.readFileSync('./articles.json', 'utf-8'));
        articles.map((article) => {
            const randomuserIdsIndex = Math.ceil(Math.random() * userIds.length);
            article.publisher = userIds[randomuserIdsIndex - 1];
            article.priority = Math.ceil(Math.random() * 10);
            article.author = authors[Math.ceil(Math.random() * authors.length - 1)];
        });
        await articleModel_1.default.create(articles);
    }
    catch (error) {
        console.log(error);
    }
    process.exit();
};
// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await articleModel_1.default.deleteMany({});
        console.log('Data successfully deleted!');
    }
    catch (err) {
        console.log(err);
    }
    process.exit();
};
if (process.argv[2] === '--delete') {
    deleteData();
}
else if (process.argv[2] === '--import') {
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

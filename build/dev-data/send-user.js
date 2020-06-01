"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// select current directory, after npx ts-node send-user.ts --import or npx ts-node send-user.ts --delete
const fs_1 = __importDefault(require("fs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/userModel"));
dotenv_1.default.config({ path: '../../config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => console.log('DB connection successful!'));
const user = JSON.parse(fs_1.default.readFileSync('./user.json', 'utf-8'));
const importData = () => {
    user.map(async (data) => {
        try {
            const newUser = await userModel_1.default.create(data);
            console.log('newUser', newUser);
        }
        catch (error) {
            console.log('error', error);
        }
    });
};
// importData();
// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await userModel_1.default.deleteMany({});
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

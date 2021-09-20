const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const { 
    router: { repositories }
} = require("../../src/app");


const user1Id = ObjectId();
const user1 = {
    _id: user1Id,
    name: "User1",
    email: "user1@example.com",
    password: "123456789",
    age: 30,
    tokens: [
        {
            token: jwt.sign({ _id: user1Id }, process.env.SECRET)
        }
    ]
};
const user2Id = ObjectId();
const user2 = {
    _id: user2Id,
    name: "User2",
    email: "user2@example.com",
    password: "123456789",
    age: 30,
    tokens: [
        {
            token: jwt.sign({ _id: user2Id }, process.env.SECRET)
        }
    ]
};

const task1 = {
    _id: ObjectId(),
    name: "Task 1",
    description: "Description 1",
    completed: false,
    creator: user1._id
};
const task2 = {
    _id: ObjectId(),
    name: "Task 2",
    description: "Description 2",
    completed: false,
    creator: user1._id
};
const task3 = {
    _id: ObjectId(),
    name: "Task 3",
    description: "Description 3",
    completed: false,
    creator: user2._id
}

const seedUserData = async () => {
    await Promise.all([
        repositories.users.create(user1),
        repositories.users.create(user2)
    ]);
}

const seedTaskData = async () => {
    await Promise.all([
        repositories.tasks.create(task1),
        repositories.tasks.create(task2),
        repositories.tasks.create(task3)
    ]);
}

const clearUserData = async () => {
    await repositories.users.deleteManyForever({});
}

const clearTaskData = async () => {
    await repositories.tasks.deleteManyForever({});
}

module.exports = {
    userSeeds: [user1, user2],
    taskSeeds: [task1, task2, task3],
    seedUserData,
    seedTaskData,
    clearUserData,
    clearTaskData
};
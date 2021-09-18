const User = require("../model");

module.exports = repository => {
    const execute = async (newEntity) => {
        const { name, email, password, age } = newEntity;

        const existingUser = await repository.getOne({ email });
        if(existingUser) throw new Error("Email is already exist");

        const newUser = new User(name, email, password, age);
        const createdUser = await repository.create(newUser);
        const token = await createdUser.generateAuthToken();

        return { createdUser, token };
    };

    return { execute };
};
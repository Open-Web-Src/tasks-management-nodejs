
module.exports = repository => {
    const execute = async ({ email, password }) => {
        const user = await repository.getOne({ email });
        if(!user) throw new Error("Can not find that email");

        const isValidCredentials = await repository.database.validateCredentials(password, user.password);
        if(!isValidCredentials) throw new Error("The provided credentials is invalid");

        const token = await user.generateAuthToken();
        return {
            user,
            token
        }
    };

    return { execute };
};
module.exports = repository => {
    const execute = async (user, credentials) => {
        user.tokens = user.tokens.filter(item => {
            return item.token !== credentials.token;
        });
        await repository.save(user);
    }

    const wipeOutExceptCurrent = async (user, credentials) => {
        user.tokens = user.tokens.filter(item => {
            return item.token === credentials.token;
        });
        await repository.save(user);
    }

    return { execute, wipeOutExceptCurrent };
}
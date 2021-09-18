module.exports = repository => {
    const execute = async (id) => {
        return repository.getById(id);
    }

    return { execute };
}
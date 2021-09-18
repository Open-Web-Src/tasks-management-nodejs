module.exports = repository => {
    const execute = async (id, fields) => {
        return repository.updateById(id, fields);
    }

    return { execute };
}
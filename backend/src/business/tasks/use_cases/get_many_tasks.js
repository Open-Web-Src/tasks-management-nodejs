module.exports = repository => {
    const execute = async (creator, options, filters = {}) => {
        await creator.populate({
            path: 'tasks',
            match: filters,
            options
        });

        return creator.tasks;
    };

    return { execute };
}
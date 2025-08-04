
const buildLevelRepository = ({ logger, getLevelsByOrders }) => {
    const TAG = "buildLevelRepository";
    const levelOrders = [1, 2];

    return {
        getInitLevels: async () => {
            try {
                const levels = await getLevelsByOrders(levelOrders);
                logger.info(TAG, levels);
                return levels;
            } catch (error) {
                logger.error(TAG, error);
                throw error;
            }
        },
    }
};

module.exports = buildLevelRepository;
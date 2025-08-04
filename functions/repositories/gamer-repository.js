
const GameStatus = {
    NEW: "New",
    LOCK: "Lock"
};

const buildGamerRepository = ({ logger, getGamerById, createGamer, addGamesToGamer, getUUID }) => {
    const TAG = "buildGamerRepository";

    return {
        verifyGamerExists: async (gamerId) => {
            try {
                const gamer = await getGamerById(gamerId);
                logger.info(TAG, `gamer is ${gamer}`);
                return gamer !== null && gamer !== undefined;
            } catch (error) {
                logger.error(TAG, error);
                throw error;
            }
        },
        createGamer: async (data) => {
            try {
                const { initLevels, ...gamerData } = data;
                const initGames = getInitGames(initLevels, getUUID);
                await createGamer(gamerData);
                await addGamesToGamer(gamerData.gamer_id, initGames);
                return gamerData.gamer_id;
            } catch (error) {
                logger.error(TAG, error);
                throw error;
            }
        },
    }
};

function getInitGames(initLevels, getUUID) {
    return initLevels.map(initLevel => {
        const game_id = getUUID();
        const { level_id, level_name, level_image } = initLevel;
        const level_info = {
            level_id,
            level_name,
            level_image
        };
        const game_status = initLevel.level_order == 1 ? GameStatus.NEW : GameStatus.LOCK;
        return {
            game_id,
            level_info,
            game_status
        };
    });
}

module.exports = buildGamerRepository;

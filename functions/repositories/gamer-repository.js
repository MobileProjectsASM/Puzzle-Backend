
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
                await addGamesToGamer(gamerData.gamerId, initGames);
                return gamerData.gamerId;
            } catch (error) {
                logger.error(TAG, error);
                throw error;
            }
        },
    }
};

function getInitGames(initLevels, getUUID) {
    return initLevels.map(initLevel => {
        const gameId = getUUID();
        const levelInfo = initLevel;
        const gameStatus = initLevel.levelOrder == 1 ? GameStatus.NEW : GameStatus.LOCK;
        return {
            gameId,
            levelInfo,
            gameStatus
        };
    });
}

module.exports = buildGamerRepository;

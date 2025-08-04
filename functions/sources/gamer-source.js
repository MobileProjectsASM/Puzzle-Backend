const admin = require("firebase-admin");

const buildGamerSource = ({ logger, firestore }) => {
    const TAG = "buildGamerSource";
    const GamerCollections = {
        GAMER_COLLECTION: "gamers",
        GAMES_COLLECTION: "games"
    };

    return {
        getGamerById: async (gamerId) => {
            const documentSnapshot = await firestore.collection(GamerCollections.GAMER_COLLECTION).doc(gamerId).get();
            return documentSnapshot.data();
        },
        createGamer: async (gamerData) => {
            try {
                const gamerRef = firestore.collection(GamerCollections.GAMER_COLLECTION).doc(gamerData.gamer_id);
                await gamerRef.set(gamerData);
            } catch (error) {
                logger.error(TAG, error);
                throw error;
            }
        },
        addGamesToGamer: async (gamerId, games) => {
            try {
                const gamesRef = firestore.collection(GamerCollections.GAMER_COLLECTION).doc(gamerId).collection(GamerCollections.GAMES_COLLECTION);
                const batch = firestore.batch();
                games.forEach(game => {
                    const gameRef = gamesRef.doc(game.game_id)
                    batch.set(gameRef, game)
                });
                await batch.commit();
            } catch (error) {
                logger.error(TAG, error);
                throw error;
            }
        },
    };
};

module.exports = buildGamerSource;
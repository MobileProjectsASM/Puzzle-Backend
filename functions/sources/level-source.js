const admin = require("firebase-admin");

const buildLevelSource = ({ logger, firestore }) => {
    const TAG = "buildLevelSource";
    const LEVEL_COLLECTION = "levels";
    const LevelProperties = {
        LEVEL_ORDER: "levelOrder"
    };

    return {
        getLevelsByOrders: async (levelOrders) => {
            try {
                const querySnapshot = await firestore.collection(LEVEL_COLLECTION).where(LevelProperties.LEVEL_ORDER, "in", levelOrders).get();
                return querySnapshot.docs.map(documentSnapshot => documentSnapshot.data());
            } catch(error) {
                logger.error(TAG, error);
                throw error;
            }
        } 
    };
}

module.exports = buildLevelSource;
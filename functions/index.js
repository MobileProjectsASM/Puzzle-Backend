
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const crypto = require("node:crypto");
const { HttpsError } = require("firebase-functions/https");

const { buildGamerRepository, buildLevelRepository } = require("./repositories/repositories");
const { buildGamerSource, buildLevelSource } = require("./sources/sources")

admin.initializeApp();

const logger = {
    info: (tag, message) => functions.logger.info(`[${tag}]: ${message}`),
    error: (tag, message) => functions.logger.error(`[${tag}]: ${message}`),
}

exports.createGamer = functions.https.onCall(async (data, context) => {
    const TAG = "createGamerCallable";
    if (!context.auth) throw new HttpsError("unauthenticated", "No user authenticated");
    const gamer_id = data.gamer_id;
    if (!gamer_id || gamer_id == "") throw new HttpsError("invalid-argument", "gamer id is null, undefined or blank");
    const firestore = admin.firestore();
    const gamerSource = buildGamerSource({ logger, firestore });
    const gamerRepository = buildGamerRepository({ logger, getUUID: crypto.randomUUID, ...gamerSource, });
    const gamerExists = await gamerRepository.verifyGamerExists(gamer_id);
    if (gamerExists) throw new HttpsError("already-exists", "gamer exists");
    const levelSource = buildLevelSource({ logger, firestore });
    const levelRepository = buildLevelRepository({ logger, ...levelSource });
    try {
        const initLevels = await levelRepository.getInitLevels();
        const gamerId = await gamerRepository.createGamer({ ...data, initLevels });
        logger.info(TAG, "Gamer created");
        return { gamer_id: gamerId };
    } catch (error) {
        logger.error(TAG, error);
        throw new HttpsError(
            "aborted",
            "error to create gamer",
        );
    }
});

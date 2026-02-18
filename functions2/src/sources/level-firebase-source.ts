import { Level } from "../data/entities";
import { LevelSource, Logger } from "./sources";
import { Firestore } from "firebase-admin/firestore";

export class LevelFirebaseSource implements LevelSource {

    static TAG = "level-firebase-source";
    private static LEVEL_COLLECTION = "levels";
    private static LevelProperties = {
        LEVEL_ORDER: "levelOrder"
    }

    constructor(private logger: Logger, private db: Firestore) {}

    async getLevelsByOrder(order: number[]): Promise<Level[]> {
        try {
            const querySnapshot = await this.db.collection(LevelFirebaseSource.LEVEL_COLLECTION).where(LevelFirebaseSource.LevelProperties.LEVEL_ORDER, "in", order).get();
            return querySnapshot.docs.map(documentSnapshot => documentSnapshot.data() as Level);
        } catch (err) {
            if (err instanceof Error) {
                this.logger.error(LevelFirebaseSource.TAG, 'error to get levels by their order', err)
                throw err
            } else {
                this.logger.error(LevelFirebaseSource.TAG, 'error to get levels by their order, unknown error')
                throw new Error("unknown error")
            }
        }
    }
}
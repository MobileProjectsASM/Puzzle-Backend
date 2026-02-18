import { Game, Gamer } from "../data/entities";
import { GamerSource, Logger } from "./sources";
import { Firestore } from "firebase-admin/firestore";

export class GamerFirebaseSource implements GamerSource {

    static TAG = "gamer-firestore-source";
    private static GAMER_COLLECTION = "gamers";
    private static GAME_COLLECTION = "games";

    constructor(private logger: Logger, private db: Firestore) {}

    async getGamerById(gamerId: string): Promise<Gamer> {
        try {
            const documentSnapshot = await this.db.collection(GamerFirebaseSource.GAMER_COLLECTION).doc(gamerId).get();
            return documentSnapshot.data() as Gamer;
        } catch (err) {
            if (err instanceof Error) {
                this.logger.error(GamerFirebaseSource.TAG, 'error to get gamer by id', err);
                throw err;
            } else {
                this.logger.error(GamerFirebaseSource.TAG, 'error to get gamer by id, unknown error');
                throw new Error("unknown error");
            }
        }
    }

    async createGamer(gamerData: Gamer): Promise<void> {
        try {
            const gamerRef = this.db.collection(GamerFirebaseSource.GAMER_COLLECTION).doc(gamerData.gamerId);
            await gamerRef.set(gamerData);
        } catch (err) {
            if (err instanceof Error) {
                this.logger.error(GamerFirebaseSource.TAG, 'error to create gamer', err);
                throw err;
            } else {
                this.logger.error(GamerFirebaseSource.TAG, 'error to create gamer, unknown error');
                throw new Error("unknown error");
            }
        }
    }

    async addGamesToGamer(gamerId: string, games: Game[]): Promise<void> {
        try {
            const gamesRef = this.db.collection(GamerFirebaseSource.GAMER_COLLECTION).doc(gamerId).collection(GamerFirebaseSource.GAME_COLLECTION);
            const batch = this.db.batch();
            games.forEach(game => {
                const gameRef = gamesRef.doc(game.gameId)
                batch.set(gameRef, game)
            });
            await batch.commit();
        } catch (err) {
            if (err instanceof Error) {
                this.logger.error(GamerFirebaseSource.TAG, 'error to create gamer', err);
                throw err;
            } else {
                this.logger.error(GamerFirebaseSource.TAG, 'error to create gamer, unknown error');
                throw new Error("unknown error");
            }
        }
    }
}
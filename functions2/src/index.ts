/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from 'firebase-functions/v2';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { z } from 'zod';
import {
  GamerFirebaseSource,
  GamerSource,
  LevelFirebaseSource,
  LevelSource,
  Logger,
  LoggerCloud,
  RandomId,
  RandomIdCrypto,
} from './sources';
import { GamerRepository, GamerRepositoryImpl, LevelRepository, LevelRepositoryImpl } from './repositories';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

setGlobalOptions({ maxInstances: 10 });

const logger: Logger = new LoggerCloud();
const randomId: RandomId = new RandomIdCrypto();
const firebase = admin.firestore();

const gamerSource: GamerSource = new GamerFirebaseSource(logger, firebase);
const levelSource: LevelSource = new LevelFirebaseSource(logger, firebase);
const gamerRepository: GamerRepository = new GamerRepositoryImpl(logger, gamerSource, randomId);
const levelRepository: LevelRepository = new LevelRepositoryImpl(logger, levelSource);

const GamerScheme = z.object({
  gamerId: z.string(),
  gamerNickName: z.string().min(1),
  gamerAge: z.number().int().positive(),
  gamerCountry: z.string(),
  gamerCountryFlag: z.string().optional(),
  gamerImage: z.url(),
});

export const createGamer = onCall(async (request) => {
  const TAG = 'create-gamer-function';

  if (!request.auth) {
    logger.error(TAG, 'user-unauthenticated');
    throw new HttpsError('unauthenticated', 'No user authenticated');
  }
  if (!request.data) {
    logger.error(TAG, 'invalid-argument', request.data);
    throw new HttpsError('invalid-argument', 'No data sended');
  }
  const result = GamerScheme.safeParse(request.data);
  if (!result.success) {
    logger.error(TAG, 'invalid-argument', result.error);
    throw new HttpsError('invalid-argument', 'data invalid');
  }
  const gamer = result.data;

  try {
    const gamerExists = await gamerRepository.verifyGamerExists(gamer.gamerId);
    if (gamerExists) throw new HttpsError('already-exists', 'gamer exists');
    const initLevels = await levelRepository.getInitLevels();
    const gamerId = await gamerRepository.createGamer(gamer, initLevels);
    logger.info(TAG, 'gamer created');
    return { gamerId };
  } catch (err) {
    if (err instanceof HttpsError) throw err;
    else throw new HttpsError('aborted', 'error to create gamer');
  }
});

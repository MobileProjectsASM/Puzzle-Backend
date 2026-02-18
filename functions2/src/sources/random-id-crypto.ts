import { RandomId } from "./sources";
import { randomUUID } from "node:crypto"

export class RandomIdCrypto implements RandomId {
    generateId: () => string = randomUUID
}
import { ec as EC } from "elliptic";
// You can use any elliptic curve you want
const ec = new EC("secp256k1");

export default class Key {
  constructor() {}
  generateKeyPair() {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic("hex");
    const privateKey = key.getPrivate("hex");
    return { publicKey, privateKey };
  }
}

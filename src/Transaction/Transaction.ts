import { SHA256 } from "crypto-js";
import { ec as EC } from "elliptic";
import path from "path";
import { dev } from "../contantion";
import logData from "../LogFun/LogData";
var ec = new EC("secp256k1");

export interface ITransaction {
  fromAddress: string | undefined;
  toAddress: string;
  amount: number;
}
var log = new logData(dev, path.join(__dirname, "../logs/transaction.log"));

class Transaction {
  signature: any;
  fromAddress: string | undefined;
  toAddress: string;
  amount: number;
  LogData: logData;
  constructor(dataInput: ITransaction) {
    this.fromAddress = dataInput.fromAddress;
    this.toAddress = dataInput.toAddress;
    this.amount = dataInput.amount;
    this.LogData = log;
  }
  calculateHash() {
    const hash = SHA256(`${this.fromAddress}${this.toAddress}${this.amount}`);

    return hash.toString();
  }
  signTransaction(signingKey: EC.KeyPair) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      this.LogData.error("You cannot sign transactions for other wallets!");
    }
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }
  isValid() {
    if (this.fromAddress === undefined) return true;
    if (!this.signature || this.signature.length === 0) {
      this.LogData.error("No signature in this transaction");
    }
    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

export default Transaction;

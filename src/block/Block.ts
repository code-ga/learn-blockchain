import { SHA256 } from "crypto-js";
import path from "path";
import { dev } from "../contantion";
import logData from "../LogFun/LogData";
import Transaction from "../Transaction/Transaction";

var log = new logData(dev, path.join(__dirname, "../logs/block.log"));

class Block {
  prehash: string;
  timestamp: number;
  transaction: Transaction[];
  private hash: string;
  nonce: number;
  logData: logData;
  difficultyString: string;
  constructor(
    prehash: string,
    transaction: Transaction[],
    logData: logData = log
  ) {
    this.prehash = prehash;
    this.timestamp = new Date().getTime();
    this.transaction = transaction;
    this.nonce = 0;
    this.logData = logData;
    this.hash = "";
    this.difficultyString = "0";
  }
  calculateHash() {
    const hash = SHA256(
      `${this.prehash}${this.timestamp}${JSON.stringify(this.transaction)}${
        this.nonce
      }`
    );

    return hash.toString();
  }
  mineBlock(difficulty: number = 1, test: boolean = false) {
    while (true) {
      if (test) {
        this.hash = this.calculateHash();
        this.logData.log(`hash : ${this.hash}`);
        break;
      }
      this.nonce++;
      this.hash = this.calculateHash();
      this.logData.log(
        `độ khó của chuổi hash : ${difficulty} và kí tự nền là  ${this.difficultyString}`
      );
      this.logData.log(`đây là lần hash số ${this.nonce}`);
      this.logData.log(`hash của block tại thời điểm hiện tại : ${this.hash}`);
      this.logData.log(
        `${difficulty} kí tự đầu tiên của chuổi hash phải bằng ${this.difficultyString.repeat(
          difficulty
        )}`
      );
      if (this.hash.startsWith(this.difficultyString.repeat(difficulty))) {
        break;
      }
    }
    if (!test) {
      this.logData.clear();
    }
  }
  getHash() {
    this.logData.log(
      `hash của block này là : ${this.hash} với data là : ${JSON.stringify(
        this.transaction
      )}`
    );
    return this.hash;
  }

  hasValidTransactions() {
    for (const tx of this.transaction) {
      if (!tx.isValid()) return false;
    }
    return true;
  }
}

export default Block;

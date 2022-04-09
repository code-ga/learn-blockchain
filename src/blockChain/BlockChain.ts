import Block from "../block/Block";
import { dev } from "../contantion";

import logData from "../LogFun/LogData";
import Transaction from "../Transaction/Transaction";
import path from "path";
import { ITransaction } from "./../Transaction/Transaction";

import { ec as EC } from "elliptic";
var ec = new EC("secp256k1");
interface ITransactionForMining extends ITransaction {
  fromAddress: string;
  fromAddressPrivateKey: string;
}

var log = new logData(dev, path.join(__dirname, "../logs/Blockchain.log"));

class Blockchain {
  protected chain: Block[];
  pendingTransaction: Transaction[];
  logData: logData;
  constructor(public difficulty: number = 1) {
    this.chain = [this.getGenesisBlock()];
    this.pendingTransaction = [];
    this.logData = log;
  }
  getGenesisBlock() {
    var firstTransaction = new Transaction({
      fromAddress: undefined,
      toAddress: "Genesis",
      amount: 0,
    });
    return new Block("0000", [firstTransaction]);
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  minePendingTransaction(miningRewardAddress: string) {
    const block = new Block(
      this.getLatestBlock().getHash(),
      this.pendingTransaction
    );
    block.mineBlock(this.difficulty, false);
    this.chain.push(block);
    this.pendingTransaction = [
      new Transaction({
        fromAddress: undefined,
        toAddress: miningRewardAddress,
        amount: this.miningReward(),
      }),
    ];
  }
  addTransaction(transactionData: ITransactionForMining) {
    let transaction = new Transaction(transactionData);
    // Your private key goes here
    const myKey = ec.keyFromPrivate(transactionData.fromAddressPrivateKey, "hex");
    transaction.signTransaction(myKey);
    if (!transaction.fromAddress || !transaction.toAddress) {
      this.logData.error("Transaction must include from and to address");
    }
    if (!transaction.isValid()) {
      this.logData.error("Cannot add invalid transaction to chain");
    }
    this.pendingTransaction.push(transaction);
  }
  miningReward(): number {
    return 100;
  }
  getBalance(address: string) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transaction) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.getHash() !== currentBlock.calculateHash()) {
        return false;
      }
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }
      if (currentBlock.prehash !== previousBlock.getHash()) {
        return false;
      }
      currentBlock.logData.log(
        `${currentBlock.getHash()} block với mã hash trên đã được kiểm tra`
      );
      currentBlock.logData.log(
        `hash đã đạt được yêu cầu và hash đó là ${currentBlock.getHash()}`
      );
    }
    return true;
  }
  getChain() {
    return this.chain;
  }
}
export default Blockchain;

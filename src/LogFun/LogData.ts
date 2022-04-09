import { appendFileSync, writeFileSync } from "fs";

class logData {
  constructor(public dev: boolean = false,public logFile:string = "./log.log") {
    writeFileSync(logFile, "");
  }
  log(...args: any[]) {
    if (this.dev) {
      console.log(...args);
    } else {
      appendFileSync(this.logFile, `log : ${args.join(" ")}`);

      appendFileSync(this.logFile, "\n");
    }
  }
  error(...args: any[]) {
    if (this.dev) {
      console.error(...args);
    } else {
      appendFileSync(this.logFile, `error : ${args.join(" ")}`);
      appendFileSync(this.logFile, "\n");
    }
  }
  clear() {
    writeFileSync(this.logFile, "");
  }
}
export default logData;
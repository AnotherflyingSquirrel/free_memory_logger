const fs = require("node:fs");
const os = require("node:os");
const EventEmitter = require("node:events");
const path = require("node:path");
require("dotenv").config();
class CustomLogger extends EventEmitter {
  emitEvent(message) {
    this.emit("freemem%", { message });
  }
}

// const logFile = path.join(__dirname, "logFile.txt").toString();
const logFilePath = process.env.LOGFILE_PATH
  ? process.env.LOGFILE_PATH
  : "./logFile.txt";
const interval = process.env.INTERVAL_MS ? process.env.INTERVAL_MS : 3000;
const freememLogger = new CustomLogger();

function logToFile(logEventObject) {
  const logContent = `${new Date().toISOString()} - ${
    logEventObject.message
  }\n`;
  fs.appendFileSync(logFilePath, logContent);
}

freememLogger.on("freemem%", logToFile);

freememLogger.emitEvent("Application Started");

setInterval(() => {
  const freemem_percent = (os.freemem() / os.totalmem()) * 100;
  freememLogger.emitEvent(
    `Current memory usage: ${100 - freemem_percent.toFixed(2)}`
  );
}, interval);

// freememLogger.emitEvent("First Log");

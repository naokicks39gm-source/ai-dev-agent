const LOG_LEVEL = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

function format(level, message, meta = {}) {
  return JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    ...meta
  });
}

export const logger = {
  info: (msg, meta) => console.log(format(LOG_LEVEL.INFO, msg, meta)),
  warn: (msg, meta) => console.warn(format(LOG_LEVEL.WARN, msg, meta)),
  error: (msg, meta) => console.error(format(LOG_LEVEL.ERROR, msg, meta)),
  debug: (msg, meta) => console.log(format(LOG_LEVEL.DEBUG, msg, meta))
};

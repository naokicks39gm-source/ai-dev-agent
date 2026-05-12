import { logger as base } from "./logger.js";

export const logger = {
  info: (msg, meta={}) => base.info(msg, meta),
  warn: (msg, meta={}) => base.warn(msg, meta),
  error: (msg, meta={}) => base.error(msg, meta),
  debug: (msg, meta={}) => base.debug(msg, meta),
};

import dayjs from 'dayjs';
import logger from 'pino';
import config from '../config';

const level = config.logger.level;

const log = logger({
  transport: {
    target: 'pino-pretty',
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"Time:" "${dayjs().format()}"`});

  export default log

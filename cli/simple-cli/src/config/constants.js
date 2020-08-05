import packJson from '../../package.json';

const VERSION = packJson.version;
const PACK_NAME = packJson.name;

const isMac = process.platform === 'darwin';
const isWin = process.platform === 'win32';
const HOME = process.env[(isWin == 'win32') ? 'USERPROFILE' : 'HOME']
const FILE_RC = isMac ? `${HOME}/.simplerc` : isWin ? `${HOME}\\.simplerc` : '';

export {
  PACK_NAME,
  VERSION,
  HOME,
  FILE_RC
}
import {FILE_RC} from '../config/constants';
import {isEmptyObject, checkCommander, error} from '../util';
import RC from '../config/rc';

const ini = require('ini')
const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

// handler argv for every subcommander
let handlerCommander = (action, commanderName) => {

  if (!checkCommander(action, commanderName)) {
    return error(`action commander ${action} is not exists ${commanderName} commander`);
  }

  return function (args) {
    let resultArgs = {};
    // commander set
    if (commanderName === 'set') {
      for (let i = 0; i < args.length; i+=2) {
        resultArgs[args[i]] = args[i+1];
      }
    } else if (commanderName === 'get' || commanderName === 'remove') {
      // commander get/remove
      resultArgs = [];
      resultArgs = args.slice(0);
    } else if (commanderName === 'getAll') {
      resultArgs = [];
    }
    return resultArgs;
  }
}

// 命令操作
let getAll = async () => {
  try {
    const stat = await exists(FILE_RC);
    if (!stat) {
      return error('not found .simplerc. please create .simplerc!');
    }
    const content = await readFile(FILE_RC, 'utf8');
    console.log(content);
  }catch(err) {
    error(err);
  }
}

let get = async (argv) => {
  if (isEmptyObject(argv)) {
    return getAll();
  }
  try {
    const stat = await exists(FILE_RC);
    if (stat) {
      let content = await readFile(FILE_RC, 'utf8');
      content = ini.parse(content);
      let getVal = {};
      argv.forEach((arg) => {
        getVal[arg] = content[arg];
      })
      console.log(ini.stringify(getVal));
    } else {
      error('not found .simplerc. please create .simplerc!');
    }
  }catch(err) {
    error(err);
  }
}

let set = async (argv, RC) => {
  if (isEmptyObject(argv)) {
    error('not exists argv');
    return
  }
  try {
    let content;
    const stat = await exists(FILE_RC);
    if (stat) {
      content = await readFile(FILE_RC, 'utf8');
      content = ini.parse(content);
    } else {
      content = RC;
    }
    content = Object.assign({}, content, argv);
    await writeFile(FILE_RC, ini.stringify(content), 'utf8');
  }catch(err) {
    error(err);
  }
}

let remove = async (argv) =>{
  if (isEmptyObject(argv)) {
    error('not exists argv');
    return
  }
  try {
    const stat = await exists(FILE_RC);
    if (!stat) {
      return error('not found .simplerc. if create .simplerc. please create .simplerc by set commander');
    }
    let content = await readFile(FILE_RC, 'utf8');
    content = ini.parse(content);
    argv.forEach((arg) => {
      if (content[arg]) {
        delete content[arg];
      }
    })
    content = ini.stringify(content);
    await writeFile(FILE_RC, content, 'utf8');
  }catch(err) {
    error(err);
  }
}

let config = (argv) => {
  let commanderName = argv[0];
  let args = argv.slice(1);
  let handlerArgs = handlerCommander('config', commanderName);
  let resultArgs = handlerArgs(args);
  switch (commanderName) {
    case 'get':
      get(resultArgs);
      break;
    case 'getAll':
      getAll();
      break;
    case 'set':
      set(resultArgs, RC);
      break;
    case 'remove':
      remove(resultArgs);
      break;
  }
}


export default config;
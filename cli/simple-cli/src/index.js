import {PACK_NAME, VERSION} from './config/constants.js'
import program from 'commander';
import main from './commands/index';


const commandMap = {
  install: {
    alias: 'i',
    description: 'download template',
    examples: [
      `${PACK_NAME} i`,
      `${PACK_NAME} install`
    ],
    action: () => {
      console.log('install cli');
      main()
    },
    help: () => {}
  },
  config: {
    alias: 'c',
    description: 'add,delete,set,get config info',
    action: () => {
      main('config', process.argv.slice(3))
    },
    help: () => {
      console.log('');
      console.log('  set  ', 'set or add .simplerc file', '\n');
      console.log('  get  ', 'get .simplerc file key info', '\n');
      console.log('  getAll  ', 'get all info from .simplerc info', '\n');
      console.log('  remove  ', 'delete point at key of info from .simplerc', '\n');
      console.log('');
      console.log('Examples:');
      console.log(`  ${PACK_NAME} config/c set a 1`, '\n');
      console.log(`  ${PACK_NAME} config/c get a`, '\n');
      console.log(`  ${PACK_NAME} config/c remove a`, '\n');
    }
  }
};


program.name(`${PACK_NAME}`)
       .usage("[options] command")


Object.keys(commandMap).forEach((command) => {
  program.command(command)
         .alias(commandMap[command].alias)
         .description(commandMap[command].description)
         .action(commandMap[command].action)
         .on('-h', commandMap[command].help)
         .on('--help', commandMap[command].help)
})

program.version(VERSION, '-v --version').parse(process.argv);



// const _glob = require('glob');
// const files = _glob.sync('src/');
console.log('-----', program);


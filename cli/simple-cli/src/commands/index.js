import {resolveModule} from '../util';

const main = (action, argv) => {
  const fileName = `../commands/${action}`;
  const module = resolveModule(fileName);
  module(argv);
}
export default main;
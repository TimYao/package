import History from './base';
class Html5History extends History {
  constructor(router) {
    super(router);
    this.router = router;
  }
}

export default Html5History;
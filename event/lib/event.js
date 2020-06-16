const { EventEmitter } = require('events');

/*
   removeListener事件，每次off触发后调用，排除once情况下off情况
*/


class Event extends EventEmitter {
  constructor(){
    super();
    this.events = {};
  }
  on (eventName, listener) {
    this.events[eventName] = this.events[eventName] || [];
    if (eventName !== 'newListener') {
      this.emit('newListener', eventName, listener);
    }
    this.events[eventName].push(listener);
  }
  once (eventName, listener) {
    const once = (...arg) => {
      listener(...arg);
      this.off(eventName, once);
    }
    once.listenerFn = listener;
    this.on(eventName, once);
  }
  off (eventName, listener) {
    if (arguments.length === 0) {
      throw new ReferenceError('请指定要移除的事件类型');
    }
    if (arguments.length < 2) {
      if (!this.events[eventName]) {
        return
      }
      this.events[eventName] = null;
      delete this.events[eventName]
      return
    }
    this.events[eventName] = this.events[eventName].filter((listenerItem) => {
      return listenerItem !== listener && (listenerItem.listenerFn !== listener);
    })
  }
  emit (eventName, ...arg) {
    if (!this.events[eventName]) {
      return
    }
    this.events[eventName].forEach(fn => {
      fn(...arg);
    });
  }
}

module.exports = Event;
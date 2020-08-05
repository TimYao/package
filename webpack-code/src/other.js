// import _ from 'lodash';
/*
 问题。webpack 魔法注释运用兼容性问题
*/
/*
/* webpackInclude: /\.json$/ */
    /* webpackExclude: /a.js$/ */

const n = 'a'

let dynamicModule = () => {
  return import(
    /* webpackChunkName: "ash" */
    /* webpackPreload: true */
    `./css/a.css`
    ).then((_) => {
    return _;
  }).catch(error => 'An error occurred while loading the component');
}

dynamicModule().then((_) => {
  // document.body.appendChild(component);
  console.log(_);
})
console.log('other js');
 import {sum} from './js/demo'
 import './css/index.css'
 import './less/index.less'
 import './css/iconfont.css'
//  完整引入
 import 'core-js'
// 按需引入
// import 'core-js/es/promise'
let sd = 'dsdd'
console.log(sd);
console.log(sum([1, 2, 3]))

document.getElementById("btn").onclick = function() {
  // eslint不能识别动态导入需要，需要额外追加配置
  // /* webpackChunkName: 'math'*/ webpack魔法命名
  import(/* webpackChunkName: "math" */ "./js/math.js").then(({mul}) => {
    console.log(mul(1,2,3));
  }).catch(e => {
    console.log(e);
  })
} 

if (module.hot) {
  module.hot.accept('./js/demo.js')
}
new Promise((reslove) => {
  setTimeout(() => {
    reslove()
  }, 1000)
})
const arr = [1,2,3]
console.log(arr.includes(1));
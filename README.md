## glob
```
glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach((item, i) => {})
```

## module.exports 、exports、export、export default的区别

module.exports和exports是属于 CommonJS 模块规范，export和export default是属于ES6语法。

`module.exports`和`exports`导出模块，用`require`引入模块。对象只有在脚本运行完才会生成

`export`和`export default`导出模块，`import`导入模块。在代码静态解析阶段就会生成

Node应用由模块组成，采用CommonJS模块规范。根据这个规范，每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

CommonJS规范规定，每个模块内部，module变量代表当前模块。这个变量是一个对象，它的exports属性（即module.exports）是对外的接口。加载某个模块，其实是加载该模块的module.exports属性。

#### 1.针对CommonJs:

使用步骤：

（1）使用module.exports导出模块：

新建一个文件demo.js,通过module.exports输出变量x和函数add。
```
var x = 1;
var add = function (val) {
  return val + x;
};
module.exports.x = x;
module.exports.add = add;
```
（2）使用require引入模块

require方法用于加载模块。
```
var demo = require('./demo.js');

console.log(demo.x); // 1
console.log(demo.add(1)); // 6
```
exports 与 module.exports

为了方便，Node为每个模块提供一个exports变量，指向module.exports。这等同在每个模块头部，有一行这样的命令。
```
var exports = module.exports;
```
exports其实是module.exports的引用 ，可以直接在exports对象上添加相关的方法。

（3）使用exports导出模块：

新建一个文件util.js
```
console.log('1=', module.exports); // 结果为：{}
console.log('2=', exports); // 结果为：{}

exports.a = 200; // 由于默认 exports = module.exports 故此时把module.exports的值也改变了 {a : 200}

console.log('3=', module.exports) // {a : 200}
console.log('4=', exports) // {a : 200}

exports = '我不在指向module'

console.log('5=', module.exports) // {a : 200}
console.log('6=', exports) // 我不在指向module

var util = require('./utils')
console.log('test=', util) // { a: 200 }
```
从上面可以看出，其实require导出的内容是module.exports的指向的内存块内容，并不是exports的

#### 2.ES6

通过`export`方式导出，在导入时要加`{ }`，`export default`则不需要，使用`export default`命令，为模块指定默认输出，这样就不需要知道所要加载模块的变量名。

具体使用： 

  （1）export导出：
```
//demo1.js
export const str = 'hello world'  // 变量

export function fuunc(a){ // 函数
    return a+1
}
```
对应的导入方式：
```
//demo2.js
import { str, func } from 'demo' // 也可以分开写两次，导入的时候带花括号
```
（2）export default
```
//demo1.js
export default const str = 'hello world'
```
对应的导入方式：
```
//demo2.js
import str from 'demo1' // 导入的时候没有花括号
```
总结一些用法上的区别：

（1）`module.exports`和`exports`的用法是后面加一个 `=`，再接具体的导出
```
module.exports=...
exports=...
```
（2）`export`和`export default`的用法是后面直接接具体的导出，没有等号.
```
export ...
export default ...
```

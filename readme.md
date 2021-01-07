# replace-in-file-after-plugin
a webpack plugin for replace string in file after webpack building

### Installation
```js
npm install replace-in-file-after-plugin --save-dev
```

###  Usage
```js
// webpack.base.conf.js
const ReplaceInFileAfterPlugin = require('replace-in-file-after-plugin')
...
plugins: [
  new ReplaceInFileAfterPlugin({
    fileReg: /\.wxml$/,
    assetsPath: 'dist',
    search: /\/static\/images/g,
    replace: 'images',
  })
]
```
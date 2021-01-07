'use strict';

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

// 读取文件
function readDir(filePath, options) {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log(chalk.yellow('读取异常', err.message))
    }
    files.forEach((filename) => {
      // 遍历校验是否为文件夹
      fs.stat(`${filePath}/${filename}`, function (err, info) {
        if (info.isDirectory()) {
          readDir(`${filePath}/${filename}`, options)
        } else {
          // console.log(chalk.yellow('filename: ', filename))
          if (!options.fileReg.test(filename)) {
            return
          }
          const filedir = path.resolve(filePath, filename)
          fs.readFile(filedir, 'utf-8', (err, data) => {
            if (err) {
              console.log(chalk.yellow('读取异常', err.message))
              return
            }
            // 正则替换
            const originFunc = options.search
            const newFunc = options.replace
            if (!originFunc.test(data)) {
              console.log(chalk.red(`${filePath}/${filename}: 不存在可匹配项`))
              return
            }
            console.log(chalk.yellow(`filename: ${filePath}/${filename}`))
            console.log(chalk.yellow('替换中。。。'))
            const result = data.replace(originFunc, newFunc)
            fs.writeFile(filedir, result, (err) => {
              if (err) {
                console.log(chalk.red(`写入异常\n${err.message}`))
                return
              }
              console.log(chalk.cyan(`${filename}替换成功`))
            })
          })
        }
      })
    })
  })
}

function ReplaceInFileAfterPlugin(options) {
  this.options = options
}

ReplaceInFileAfterPlugin.prototype.apply = function (compiler) {
  const vm = this
  compiler.plugin('done', function (compilation, callback) {
    const filePath = path.resolve('./', vm.options.assetsPath)
    readDir(filePath, vm.options)
  })
}

module.exports = ReplaceInFileAfterPlugin

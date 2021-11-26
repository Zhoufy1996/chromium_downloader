fork from [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

```
yarn install

yarn start

yarn package
```

```
header:
1. 可拖动
2. 左上显示标题

sidebar:

view:
```

```
脚本


例如
[
  {
    name: "script",
    value: "vscode ."
  },
  {
    name: "arg1",
    value: "xxx"
  },
  {
    name: "arg2",
    value: "yyy"
  }
]


let str = "{script} {arg1} {arg2}"

args.forEach(item => {
  str.replace(RegExp(`{${name}?}/g`), value)
})

=> vscode . xxx yyy
```

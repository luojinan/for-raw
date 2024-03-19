# for-raw
save some file by github-raw Api  like CDN

## github 文件服务

虽然 github提供了源文件获取功能的，但是速度不行

此时可以考虑 [Github RAW 加速服务](https://gitmirror.com/raw.html)

把原github域名替换 `raw.githubusercontent.com` -> `raw.gitmirror.com`

即： `https://域名/人/仓库名/分支名master/文件路径.xx`

👇 获取本仓库为：
```js
const url = 'https://raw.gitmirror.com/luojinan/for-raw/main/favourite-post.md'

fetch(url).then(raw => raw.text()).then(res=> console.log(res))
```

> 另外除了github官方提供源文件读取
> 
> esmsh 也提供了读取github源文件的功能并且走了自己的cdn（github的应该也有cdn缓存处理吧）
> 
> [jsdelivr](https://www.jsdelivr.com/?query=author%3A%20vuejs&docs=gh) 也提供了github文件功能

# Luxirty Search

[search.luxirty.com](https://search.luxirty.com)

一个搜索引擎，基于 Google，屏蔽内容农场，无广告，无跟踪，干净，简洁，快。

如果想添加到浏览器中，搜索语法是 `search.luxirty.com/search?q=`

## 特性&功能
1. 内置内容农场屏蔽，包括csdn、华x云、百度云智能、腾讯云开发者等seo网站，以及一些 stackoverflow 中文翻译站。

> [!NOTE]  
> 你可以在 [/docs/block_list.txt](/docs/block_list.txt)中查看完整的屏蔽名单。

2. 点击`For Program`一键拉高 GitHub、Stackoverflow、v2ex、cnblog 权重，免去手打 site: 的麻烦。

3. 一键搜索 v2ex 、 Raddit

4. 内置广告屏蔽、跟踪链接移除。

## 与 uBlackList, Hit by Hidden 等工具的区别

这些工具在前端屏蔽搜索结果，也就是等到内容农场已经出现在搜索结果中，再将其删除或隐藏。

而 Luxirty Search 通过配置 Annotations 让 Google 直接屏蔽垃圾网站，服务器在执行搜索时就已经将网站排除，可以理解为内置多条 '-site:domain.com' 。

## Contribute
欢迎 pr 和 issue。

本项目并不复杂，只需要基础的前端知识 (css + js) 即可看懂本项目。

下面是几个较简单的切入点，可以尝试从这里入手。

### 优化样式
本项目最大的作用其实是美化 cse 那个上古默认样式，我进行了基础的调整、暗黑适配、移动端适配，但肉眼可见的还有很多问题 Orz。

### 分享黑名单或优化名单
理论上而言，利用 GitHub Action 来自动生成 Annotations 文件是最好的做法，但我还没写(逃，所以目前直接写在 issue 里。

你可以分享这些域名：
1. 黑名单域名：这些域名会直接被屏蔽
2. 代码相关的高质量来源：这些域名被视作优质来源，当点击“For Program”标签时优先级会被提高。
3. 当然，如果你认为有必要添加新的标签也可以提出来。

### 当前的缺陷
1. 对不同尺寸的屏幕适配不完整

2. 暗黑模式下还有部分元素过亮或者过暗

### 未来计划

1. 根据标题进行二次拦截

2. 加入自动翻页（这个还不知道怎么实现）

### 经验分享

如果你在你的博客中介绍了本项目，欢迎将链接分享到issue，如果内容对其它使用本项目的用户有帮助(较为详细的介绍/部署教程/或其它任意有帮助的内容),我们会将您的文章链接添加到readme中。

## 原理

Luxirty Search 基于 Google 的可编程自定义搜索引擎(Google cse)，允许通过 Annotations 自定义屏蔽网站及搜索范围等，同时使用 Refinement Labels 提高 Github 等优质来源的权重。

用人话来说，就是内置了屏蔽哪些网站、优先搜索哪些网站。

### 已知缺陷
这些缺陷是 Google CSE 或其它限制导致的，可能得不到解决。
- 设置为默认引擎时，搜索栏无法自动补全（网页中有自动补全）
- 无法根据时间筛选结果
- 缺乏同义词替换，虽然 Google CSE 基于 Google，但 Google 官网的搜索引擎运用了多种技术来优化搜索结果，最显著的一点是同义词搜索，当使用的术语有所区别时，Google官网会使用意思相近的同义词进行搜索，而 Google CSE 不会，这会导致某些情况下的结果明显少于官网。

# 部署

本项目现在仍然保留 Vue 3 + Vite 的轻量前端，但增加了一个很小的 Node API，用 SQLite 保存运行时配置和管理员会话。因此如果需要后台配置能力，请部署为 Node 服务，而不是纯静态站点。

Google PSE Element 仍然是主搜索源。SQLite 中没有配置 `google_pse_cx` 时，会回退到环境变量 `VITE_GOOGLE_CSE_CX`。

## 后台配置版

### 初始化管理员

不提供开放注册，也没有默认密码。首次启动前用环境变量创建单管理员账户：

```sh
ADMIN_USERNAME=admin ADMIN_PASSWORD=change-me-please pnpm init:admin
```

密码会使用 bcrypt 哈希后写入 SQLite，不会明文保存。默认数据库路径是 `./data/app.sqlite`，可以用 `DATA_DIR` 或 `DATABASE_URL` 覆盖。

### 配置 Google PSE CX

1. 从 Google Programmable Search Engine 获取 `cx`：https://programmablesearchengine.google.com/about/
2. 启动应用后访问 `/login` 登录。
3. 进入 `/admin/settings` 修改 `Google PSE CX`。
4. 保存后配置写入 SQLite，重新打开搜索页即可生效，无需重新 build。

如果 SQLite 中没有配置 `google_pse_cx`，应用会使用 `VITE_GOOGLE_CSE_CX` 作为 fallback。

注意：
1. 如果你使用自己创建的 cse，那么的部署看起来会有区别，页面上的“For Program”等标签是通过 cse 的 “优化” 功能配置的。你需要先添加域名，然后添加对应标签，并在标签中选中想提升的域名。
2. 你还需要修改 opensearch.xml 中的域名，详细请看 https://github.com/KoriIku/luxirty-search/issues/14
3. PSE Element 所需的 `cx` 会暴露给前端，这是 Google PSE 前端嵌入的正常参数。不要把 API key、管理员密码等敏感配置放到前端环境变量里。

### DuckDuckGo 补充

后台有 `duckduckgo_enabled` 开关。开启后只会暴露 `/api/ddg?q=xxx`，并调用 DuckDuckGo Instant Answer API。它只是轻量补充，不爬 DuckDuckGo HTML 搜索结果，也不替代 Google PSE 搜索结果。

## 运行

### 本地开发

```sh
pnpm install
cp .env.example .env
ADMIN_USERNAME=admin ADMIN_PASSWORD=change-me-please pnpm init:admin
pnpm dev
```

`pnpm dev` 会同时启动 Node API 和 Vite。前端开发服务器通过 Vite proxy 访问同源 `/api`。

### 生产运行

```sh
pnpm install
pnpm build
ADMIN_USERNAME=admin ADMIN_PASSWORD=change-me-please pnpm init:admin
pnpm start
```

默认监听 `PORT=8787`。生产环境默认启用 `Secure` session cookie；如果你在纯 HTTP 环境测试，可以显式设置 `COOKIE_SECURE=false`。

### Docker

```sh
docker build -t jkg-search .
docker run --rm -p 8787:8787 -v jkg-search-data:/app/data jkg-search
```

首次运行容器前后都可以用同一份挂载的数据目录执行 `pnpm init:admin` 创建管理员。请不要把默认密码写进镜像或源码。

# 开发

## 参考资料
唯一要看的参考资料：[https://developers.google.com/custom-search/docs/element](https://developers.google.com/custom-search/docs/element)

## 常用命令

```sh
pnpm dev
pnpm build
pnpm start
```


# 更新记录
- 加快了启动速度
- 添加了移除搜索结果中的跟踪链接 data-ct*
- 移除了文字阴影

## Star History

<a href="https://star-history.com/#KoriIku/luxirty-search&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=KoriIku/luxirty-search&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=KoriIku/luxirty-search&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=KoriIku/luxirty-search&type=Date" />
 </picture>
</a>

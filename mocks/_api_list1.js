module.exports = {
	"name": "列表1",
	"url": "/api/list1",
	"method": "get",
	"type": "application/json, text/plain, */*",
	"createTime": "2022-04-03 15:41:35",
	"updateTime": "2022-04-03 15:41:35",
	"isUseMockjs": false,
	"timeout": 0,
	"bodyKey": {},
	"body": {
		"limit_10___page_1___justOriginal_false___order_0": {
			"isok": true,
			"data": {
				"total": 123,
				"list": [
					{
						"articleId": 165,
						"articleTitle": "css/scss常用汇总",
						"articleSubTitle": "## 清除浮动\n\n```scss\n@mixin clearfix {\n  $selector: &;\n\n  @at-root {\n    #{$selector}::before,\n    #{$selector}::after {\n      display: table;\n      content: \"\";\n    }\n    #{$selector}::after {\n      clea",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-03-17T13:29:11.000Z",
						"articleView": 16,
						"articleStart": 0
					},
					{
						"articleId": 164,
						"articleTitle": "css适配ios安全区",
						"articleSubTitle": ">本文转自： https://vant-contrib.gitee.io/vant/#/zh-CN/style#an-quan-qu\n\n```css\n.van-safe-area-top {\n    padding-top: constant(safe-area-inset-top);\n    padding-top: env(safe-area-inset-top)\n}\n\n.van-safe-a",
						"articleNature": 1,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-03-17T13:05:54.000Z",
						"articleView": 21,
						"articleStart": 0
					},
					{
						"articleId": 162,
						"articleTitle": "使用 js 实现 字典",
						"articleSubTitle": "字典是一种以 键值对 形式存数数据的数据结构，`javaScript` 中的 `Object` 类就是以字典的形式设置的，所以使用 `Object` 类本身的特性实现字典 `Dictionary` 类。\n\n## 属性及方法\n\n| 列表 | 属性或方法 | 描述 |\n|----|----|----|\n| add | 方法 | `add(key, value)` 向字典中添加 键值对 |\n| find",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-02-05T06:27:49.000Z",
						"articleView": 91,
						"articleStart": 0
					},
					{
						"articleId": 161,
						"articleTitle": "使用 js 实现 链表",
						"articleSubTitle": "链表是由一组节点组成的集合。\n\n## 单向链表\n\n每个节点都使用一个对象的引用指向它的后驱，指向另一个节点的引用叫做链。在链表的最前面有一个特殊节点，叫做头节点。\n\n### 单向链表插入\n\n向链表中插入一个节点，需要修改它前面节点（前驱）的链，使其指向新加入的节点，新加入的节点的链指向原来前驱指向的节点。\n\n### 单向链表删除\n\n从链表中删除一个节点，将待删除节点的前驱节点的链指向待删除节点的后",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-02-04T14:20:36.000Z",
						"articleView": 67,
						"articleStart": 0
					},
					{
						"articleId": 160,
						"articleTitle": "使用 js 实现 队列",
						"articleSubTitle": "队列是一种特殊的列表，队列只能在队尾插入元素，在队首删除元素。队列用于存储按顺序排列的数据，先进先出。\n\n## 参数\n\n接收的参数为数组类型。\n\n## 属性及方法\n\n栈的抽象数据类型定义\n\n| 列表 | 属性或方法 | 描述 |\n|----|----|----|\n| enqueue | 方法 | 向队尾加入一个元素 |\n| dequeue | 方法 | 删除队首的元素 |\n| front | 方法",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-02-02T14:07:52.000Z",
						"articleView": 52,
						"articleStart": 0
					},
					{
						"articleId": 159,
						"articleTitle": "使用 js 实现 栈",
						"articleSubTitle": "栈是一种特殊的列表，栈内的元素只能通过栈顶访问，栈是一种后入先出的数据结构。\n\n## 参数\n\n接收的参数为数组类型。\n\n## 属性及方法\n\n栈的抽象数据类型定义\n\n| 列表 | 属性或方法 | 描述 |\n|----|----|----|\n| top | 属性 | 记录栈顶元素的位置，同时也为了标记哪里可以加入新元素，当向栈内压入元素时，top 增大，从栈内弹出元素时，top 减小 |\n| push",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-02-01T08:52:07.000Z",
						"articleView": 51,
						"articleStart": 0
					},
					{
						"articleId": 158,
						"articleTitle": "使用 js 实现 列表",
						"articleSubTitle": "\n列表是一组有序的数据，列表中的每个数据项称为元素。本篇文章中列表提供两种实现方式，一种是 ES5 构造函数，一种是 ES6 `Class` 。\n\n## 参数\n\n接收的参数为数组类型。\n\n## 属性及方法\n\n列表的抽象数据类型定义\n\n| 列表 | 属性或方法 | 描述 |\n|----|----|----|\n| listSize | 属性 | 列表的元素个数 |\n| pos | 属性 | 列表的当前",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-01-30T15:19:38.000Z",
						"articleView": 61,
						"articleStart": 0
					},
					{
						"articleId": 157,
						"articleTitle": "Vue3 + Vite + Element Plus 初体验",
						"articleSubTitle": "最近看完 Vue3 和 Vite 文档之后，就写了个小 [demo](https://github.com/vueBlog/viteblog) ，整体感觉下来还是很丝滑的。 \n\n- [Vue3](https://v3.cn.vuejs.org/)\n- [Vite中文网](https://vitejs.cn/)\n- [Element Plus](https://element-plus.gitee.",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-01-26T15:43:55.000Z",
						"articleView": 65,
						"articleStart": 0
					},
					{
						"articleId": 156,
						"articleTitle": "cmock 原理解读",
						"articleSubTitle": "## cmock 简介\n\n[cmock](https://github.com/fxss5201/cmock) 用于根据接口自动生成 mock 文件，并根据 mock 文件起 mock 服务。本篇着重讲解 cmock 原理，如果仅关注使用，可以查看 [cmock 使用指导](https://www.fxss.work/blogNuxt/detail/155) 。\n\n## cmock 原理\n\n依然先",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-01-25T08:49:18.000Z",
						"articleView": 121,
						"articleStart": 0
					},
					{
						"articleId": 155,
						"articleTitle": "cmock 使用指导",
						"articleSubTitle": "## cmock 简介\n\n[cmock](https://github.com/fxss5201/cmock) 用于根据接口自动生成 mock 文件，并根据 mock 文件起 mock 服务。之前有写过一片 [前端 mock 实践](https://www.fxss.work/blogNuxt/detail/132) ，两者侧重点不一样，cmock 兼顾生成 mock 文件和起 mock 服务两种",
						"articleNature": 0,
						"articleAuthorId": 23,
						"articleCreateTime": "2022-01-24T14:57:50.000Z",
						"articleView": 70,
						"articleStart": 0
					}
				]
			},
			"msg": ""
		}
	}
}
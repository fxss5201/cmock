module.exports = {
	"name": "列表",
	"url": "/api/list",
	"method": "get",
	"type": "application/json",
	"createTime": "2022-03-03 17:03:55",
	"updateTime": "2022-04-02 21:47:12",
	"isUseMockjs": true,
	"timeout": 3000,
	"bodyKey": {},
	"body": {
		"mockTemplate": {
			"list|10": [
				{
					"id|+1": 0,
					"title": "@ctitle",
					"description": "@cword(100)",
					"time": "@datetime('yyyy-MM-dd HH:mm:ss')",
					"author": "@cname"
				}
			],
			"total": 99
		}
	}
}
var http=require('http')
var fs=require('fs')
var url=require('url')
var template = require('art-template')

var comments = [
    {
        name: '张三2',
        message: '今天天气不错！',
        dateTime: '2015-10-16'
    },
    {
        name: '张三3',
        message: '今天天气不错！',
        dateTime: '2015-10-16'
    }
]

http
    .createServer(function (req,res) {
        //解析url
        var parseObj = url.parse(req.url, true)
        var pathname = parseObj.pathname

        if (pathname === '/') {
            fs.readFile('./views/index.html', function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                var htmlStr = template.render(data.toString(), {
                    comments: comments
                })
                res.end(htmlStr)
            })
        }else if (pathname.indexOf('/public/') === 0){
            fs.readFile('.'+pathname, function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                res.end(data)
            })
        }else if(pathname === '/review'){
            var comment = parseObj.query
            var time=Date()
            comment.dateTime = time
            comments.unshift(comment)
            //如果要跳转其他页面要重定向
            res.statusCode = 302
            res.setHeader('Location', '/')
            res.end()
        }else {
            // 其它的都处理成 404 找不到
            fs.readFile('./views/404.html', function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                res.end(data)
            })
        }

    })
    .listen(3000,function () {
        console.log('running...')
    })
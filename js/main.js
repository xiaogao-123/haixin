console.log("加载成功！");

//配置我们要引入的模块的路径 jquery 遵从AMD规范， parabola.js不支持AMD规范
require.config({//声明parabola.js不支持AMD规范
    paths: {
      jquery: "jquery-1.11.3",
      "jquery-cookie": "jquery.cookie",
      parabola: "parabola",
      page: "page"
    //   index2: "index2"
    },
    //jquery-cookie 依赖于jquery
    shim: {
      //设置依赖关系
      "jquery-cookie": ["jquery"],//先加载jQuery，在加载jquery-cookie
      //某一个模块，不遵从AMD
      parabola: {
        exports: "_",
      }
    }
  })

  //调用page页面代码
  require(["page"], function(page){
    page.body();
  })
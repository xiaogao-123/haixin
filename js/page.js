define(["parabola", "jquery", "jquery-cookie"], function(parabola, $){
  function body(){
    $(function(){
      sc_msg();
      sc_num();

      //加载数据
      $.ajax({
        url: "../json/page.json",
        success: function(result){
          // console.log(arr);  
          // console.log(result);
          for(var i = 0;i<result.length;i++){
             var str = `<li class="list">
             <img src="${result[i].img}" alt="">
                 <a href="">${result[i].title1}</a>
                 <a href="">${result[i].title2}</a>
                 <div>
                     <span>￥</span>
                     <span>${result[i].price}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                     <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${result[i].sale}</span>
                 </div>
                 <div class="goods_btn">加入购物车</div>
             </li> `
               $(".content ul").append(str);
          }
        },
        error: function(msg){
          console.log(msg);
        }
      })
      //给加入购物车按钮添加点击
      //设置cookie <1>只能存储字符串  <2>cookie大小限制
      //json数据，id num  [{id:1,num:1},{id:2,num2}];
      $(".content ul").on("click", ".goods_btn", function(){
        //取出当前点击加入购物车按钮的id
        var id = this.id;
        //1、判断是否是第一次添加
        // var first = $.cookie("goods") == null ? true : false;
        var first = !($.cookie("goods"));
        if(first){
          $.cookie("goods", JSON.stringify([{id:id,num:1}]), {
            expires: 7
          });
        }else{
          //2、不是第一次，判定之前是否添加过
          var cookieArr = JSON.parse($.cookie("goods"));
          var same = false; //假设没有相同的数据
          for(var i = 0; i < cookieArr.length; i++){
            if(cookieArr[i].id == id){
              same = true;
              break;
            }
          }
          same ? cookieArr[i].num++ : cookieArr.push({id:id, num: 1});

          //3、将处理完的数据存储回去
          $.cookie("goods", JSON.stringify(cookieArr), {
            expires: 7
          })
        }
        sc_msg();
        sc_num();
        
      })

      //右侧购物车移入移出效果
      // $(".sc_right").mouseenter(function(){
      //   $(this).stop(true).animate({right: 0}, 500)
      // }).mouseleave(function(){
      //   $(this).stop(true).animate({right: -270}, 500)
      // })

      //给右侧购物车的删除按钮添加点击
      $(".sc_right ul").on("click", ".delete_goodsBtn", function(){
        var id = $(this).closest("li").remove().attr("id");
        //删除页面上的节点  从cookie中删除数据
        var cookieArr = JSON.parse($.cookie("goods"));
        for(var i = 0; i < cookieArr.length; i++){
          if(cookieArr[i].id == id){
            cookieArr.splice(i, 1);
            break;
          }
        }
        if(cookieArr.length){
          $.cookie("goods", JSON.stringify(cookieArr), {
            expires: 7
          })
        }else{
          $.cookie("goods", null);
        }

        //更新数据数量
        sc_num();
      })
      $(".sc_right ul").on("click", ".sc_goodsNum button", function(){
        var id = $(this).closest("li").attr("id");
        var cookieArr = JSON.parse($.cookie("goods"));
        for(var i = 0; i < cookieArr.length; i++){
          if(cookieArr[i].id == id){
            break;
          }
        }
        if(this.innerHTML == "+"){
          cookieArr[i].num++;
        }else{
          cookieArr[i].num == 1 ? alert("数量为1，不能减少") : cookieArr[i].num--;
        }
        $.cookie("goods", JSON.stringify(cookieArr), {
          expires: 7
        })

        //修改页面上的数量
        $(this).siblings("span").html(`商品数量：${cookieArr[i].num}`);
        sc_num();
      })

      //加载右侧的购物车里面的数据
      //1、购物车的数据存储在cookie  2、商品数据在服务器
      function sc_msg(){
        var cookieStr = $.cookie("goods");
        if(!cookieStr){
          return;
        }
        //下载所有的商品数据
        $.ajax({
          url: "../json/list.json",
          success: function(arr){
            var cookieArr = JSON.parse(cookieStr);
            //精益求精  写算法
            var newArr = [];
            for(var i = 0; i < arr.length; i++){
              for(var j = 0; j < cookieArr.length; j++){
                if(cookieArr[j].id == arr[i].id){
                  arr[i].num = cookieArr[j].num;
                  newArr.push(arr[i]);
                  break;
                }
              }
            }
            //通过newArr。处理数据，将数据添加页面上
            var str = ``;
            for(var i = 0; i < newArr.length; i++){
              str += `<li id="${newArr[i].id}">
        <div class="sc_goodsPic">
            <img src="${newArr[i].img}" alt="">
        </div>
        <div class="sc_goodsTitle">
            <p>这是商品曲奇饼干</p>
        </div>
        <div class="sc_goodsBtn">购买</div>
        <div class="delete_goodsBtn">删除</div>
        <div class="sc_goodsNum">
            <div>
                <button>+</button>
                <button>-</button>
                <span>商品数量：${newArr[i].num}</span>
            </div>
        </div>
    </li>`;
            }
            $(".sc_right ul").html(str);
          },
          error: function(msg){
            console.log(msg);
          }
        })
      }

      //处理数量
      function sc_num(){
        var cookieStr = $.cookie("goods");
        var sum = 0;
        if(cookieStr){
          var cookieArr = JSON.parse(cookieStr);
          for(var i = 0; i < cookieArr.length; i++){
            sum += cookieArr[i].num;
          }
        }
        $(".sc_right .sc_num").html(sum);
      }
    })
  }
  return {
    body: body
  }
})
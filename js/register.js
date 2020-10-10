define(["jquery"], function($){
    function registerSend(){
       
        $("#btn1").click(function(){
            
            $.ajax({
                type: "post",
                url: "../PHP/register.php",
                data: {
                    username: $(".item_account1").val(),
                    password: $(".item_account2").val(),
                    repassword: $(".item_account3").val(),
                    createTime: (new Date()).getTime()
                },
                success: function(result){
                    // console.log(result);
                    //解析拿到的数据
                    console.log(result);
                var obj = JSON.parse(result);
                if(obj.code){
                    $(".alert").attr("class", 'alert alert-danger');
                  }else{
                    $(".alert").attr("class", 'alert alert-success');
                  }
                  $(".alert").show().html(obj.msg);
                },
                error: function(msg){
                    console.log(msg);
                }
    
            })
        })
        
    }
    return {
        registerSend: registerSend
    }
})
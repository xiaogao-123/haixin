define(['jquery', "jquery-cookie"], function($){
    function loginSend(){
        $("#login-button").click(function(){
            $.ajax({
                type: "post",
                url: "../PHP/login.php",
                data: {
                    username: $(".item_account1").val(),
                    password: $(".item_account2").val()
                },
                success: function(result){
                    var obj = JSON.parse(result);
                    if(obj.code){
                        $(".alert").attr("class", 'alert alert-danger');
                    }else{
                        $(".alert").attr("class", 'alert alert-success');
                        //将已经登录的用户名存储在cookie中
                        $.cookie("username", obj.username, {
                            expires: 7
                        })
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
        loginSend: loginSend
    }
})
<?php
  header("Content-type:text/html;charset=utf-8");

  //模拟官方的返回，生成对应的内容
  $responseData = array("code" => 0, "msg" => "");

  // var_dump($_POST);
  //将数据取出
  $username = $_POST['username'];
  $password = $_POST['password'];
  $repassword = $_POST['repassword'];
  $createtime = $_POST['createTime'];

  //初步的判断
  if(!$username){
    $responseData['code'] = 1;
    $responseData['msg'] = "用户名不能为空";
    echo json_encode($responseData);
    exit;
  }

  if(!$password){
    $responseData['code'] = 2;
    $responseData['msg'] = "密码不能为空";
    echo json_encode($responseData);
    exit;
  }

  if($repassword !== $password){
    $responseData['code'] = 3;
    $responseData['msg'] = "两次密码不一致";
    echo json_encode($responseData);
    exit;
  }

  //验证数据库是否有同名的用户
  //1、链接数据库
  $link = mysqli_connect("127.0.0.1", "root", "");

  //2、判断数据库是否链接成功
  if(!$link){
    $responseData['code'] = 4;
    $responseData['msg'] = "服务器忙";
    echo json_encode($responseData);
    exit;
  }

  //3、设置访问字符集
  mysqli_set_charset($link, "utf8");

  //4、选择数据库
  mysqli_select_db($link, "haixin");

  //5、准备sql语句
  $sql = "SELECT * FROM users WHERE username='{$username}'";

  // echo $sql; //输出一下，看一下sql拼接的对不对
  //6、发送sql语句
  $res = mysqli_query($link, $sql); //$res查询用户名是否相同的结果

  //var_dump($res);
  // //7、取出一行
  $row = mysqli_fetch_assoc($res);//$row 取出 如果用户名存在就取出，不存在直接跳过第七条
  if($row){
    $responseData['code'] = 5;
    $responseData['msg'] = "用户名已存在";
    echo json_encode($responseData);
    exit;
  }

  $password = md5(md5(md5($password)."qianfeng")."haixin");

  //注册
  $sql2 = "INSERT INTO users(username,password,createtime) VALUES('{$username}','{$password}',{$createtime})";

  $res = mysqli_query($link, $sql2);

  if(!$res){
    $responseData['code'] = 6;
    $responseData['msg'] = "注册失败";
    echo json_encode($responseData);
    exit;
  }

  $responseData['msg'] = "注册成功";
  echo json_encode($responseData);


  //8、关闭数据库
  mysqli_close($link);


?>

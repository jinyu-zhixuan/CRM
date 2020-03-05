// 登录：获取用户名和密码，然后发送请求成功以后，跳转到首页，不成功，弹出用户名密码错误
$(function () {
    // 避免全局变量干扰
    let $userName = $(".userName"),
        $userPass = $(".userPass"),
        $submit = $(".submit");
    // 给登录绑定点击事件
    $submit.click(function(){
        let userName = $userName.val().trim(),
            userPass = $userPass.val().trim();
        // 表单验证
        if(userName==""||userPass==""){
            alert("用户名密码不能为空，请输入");
            return;
        }
        // 密码需要MD5加密,会生成32位的字符串;灾后端也有一个md5,用来解析加密后的密码和后端存储的是否一致;如果一致,说明密码正确
        userPass = md5(userPass);
        // 发送登录请求操作
        axios.post("/user/login",{
            account:userName,
            password:userPass
        }).then(result=>{
            // 请求成功执行函数，把数据给result
            console.log(result);
            let {code,codeText,power} = result;
            if (parseFloat(code) === 0) {
                alert("登陆成功，欢迎回来",{
                    handled:function(){
                        // alert的回调函数，当alert弹出框消失后，执行的回调函数
                        localStorage.setItem("power",encodeURIComponent(power));
                        window.location.href = "index.html";
                    }
                });
            } else {
                alert("当前用户名密码不匹配，请重试");
            }
        })
    })
})
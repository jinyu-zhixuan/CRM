$(function(){
    let $username = $(".username"),
    $sex = $("input[name='sex']"),
    $useremail = $(".useremail"),
    $userphone = $(".userphone"),
    $userqq = $(".userqq"),
    $userweixin = $(".userweixin"),
    $select = $("select"),
    $textarea = $("textarea"),
    $submit = $(".submit");
    let trashy;
    let customerId = window.location.href.queryURLParams()["customerId"] || null
    function render(){
        axios.get("/customer/info",{
            params:{
                customerId
            }
        }).then(result=>{
            let data = result.data
            $username.val(data.name)
            data.sex===0?$sex[0].checked=true:$sex[1].checked=true
            $useremail.val(data.email)
            $userphone.val(data.phone)
            $userqq.val(data.QQ)
            $userweixin.val(data.weixin)
            $select.val(data.type)
            $textarea.val(data.address)
        })
    }
    customerId?render():null

    //绑定input框的触发事件
    $(".username,.useremail,.userphone,.userqq,.userweixin,textarea").on("blur",inputjudge)
    //绑定提交框的触发事件
    $submit.click(submitjudge)
    //处理输入框的有效判断
    function inputjudge(e){
        let target = e.target
        if(target === $username[0] ||target ===$useremail[0] ||target ===$userphone[0] ||target ===$userqq[0] ||target ===$userweixin[0]){
            let name = target.className
            //如果框为空 就显示红字
            if(target.value === ""){
                $("." + name).parent().next().text("本项为必填项")
                return
            }
            //如果用户框不为空，而且不规范，也显示红字
            if(target === $username[0] && !(/^[\u4e00-\u9fa5]{1,6}$/.test(target.value))){
                $("." + name).parent().next().text("用户名为不超过6个汉字")
                return
            }
            //如果邮箱框不为空，而且不规范，也显示红字  827949146@qq.com
            if(target === $useremail[0] && !(/^[a-zA-Z0-9]+(_|_[a-zA-Z0-9]+)?@[a-zA-Z]+\.(com|cn)$/.test(target.value))){
                $("." + name).parent().next().text("邮箱格式有误")
                return 
            }
            //如果电话框不为空，而且不规范，也显示红字  11位数
            if(target === $userphone[0] && !(/^1\d{10}$/.test(target.value))){
                $("." + name).parent().next().text("电话格式有误")
                return 
            }
            //如果QQ框不为空，而且不规范，也显示红字  9-11位数
            if(target === $userqq[0] && !(/^\d{9,11}$/.test(target.value))){
                $("." + name).parent().next().text("QQ格式有误")
                return 
            }
            //如果微信框不为空，而且不规范，也显示红字  9-11位数
            if(target === $userweixin[0] && !(/^\d{9,11}$/.test(target.value))){
                $("." + name).parent().next().text("微信号同QQ号，格式有误")
                return 
            }
            $("." + name).parent().next().text("")
        }
    }
    //处理提交框的判断
    function submitjudge(){
        //点击的时候 先判断有没有为空的，有就让其下方红字提示
        trashy = true
        let ary = [$username,$useremail,$userphone,$userqq,$userweixin]
        let sex = $("input:checked").next().text()
        ary.forEach(item=>{
            let iparent = item.parent().next()
            if(item.val()==="" || iparent.text()!==""){
                console.log(item.val())
                item.val()===""?iparent.text("此项为必填项"):null
                trashy = false
                console.log(trashy)
            }
        })
        if(trashy){
            console.log(trashy)
            if(customerId){
                axios.post("/customer/update",{
                    customerId,
                    name:$username.val(),
                    sex,
                    email:$useremail.val(),
                    phone:$userphone.val(),
                    QQ:$userqq.val(),
                    weixin:$userweixin.val(),
                    type:$select.val(),
                    address:$textarea.val()
                }).then(result=>{
                    console.log(result.code)
                    if(parseFloat(result.code)===0){
                        alert("信息更新成功",{
                            handled:function(){
                                console.log(000000000000000000000000)
                                window.location.href = "customerlist.html"
                            }
                        })
                    }
                })
            }else{
                axios.post("customer/add",{
                    name:$username.val(),
                    sex,
                    email:$useremail.val(),
                    phone:$userphone.val(),
                    QQ:$userqq.val(),
                    weixin:$userweixin.val(),
                    type:$select.val(),
                    address:$textarea.val()
                }).then(result=>{
                    if(parseFloat(result.code)===0){
                        alert("客户添加成功",{
                            handled:()=>{
                                window.location.href = "customerlist.html"
                            }
                        })
                    }
                })
            }
        }
    }
})
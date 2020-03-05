console.dir(window.location.href.queryURLParams());
$(function () {
    let $infoBox = $(".infoBox"),
        $form = $infoBox.find(".form"),
        $inpBox = $form.find(".inpBox"),
        $input = $inpBox.find("input"),
        $textarea = $inpBox.find("textarea"),
        $submit = $infoBox.find(".submit");
    let departmentId = window.location.href.queryURLParams().departmentId;
    if (departmentId) {
        axios.get("/department/info", {
            params: {
                departmentId
            }
        }).then(result => {
            if (result.code === 0) {
                let {
                    name,
                    desc
                } = result.data;
                // console.log(id,name,desc);
                $input.val(name);
                $textarea.val(desc);
            }
        })
    }
    $span1 = $input.parent().next("span");
    function check1(){
        if ($input.val().trim()==="") {
            $span1.html("请填写新建部门名字")
        } else {
            $span1.html("");
            return true
        }
    }
    $input.on("blur",check1)
    $span2 = $textarea.parent().next("span");
    function check2(){
        if ($textarea.val().trim()==="") {
            $span2.html("请填写您对新建部门的描述")
        } else {
            $span2.html("");
            return true
        }
    }
    $textarea.on("blur",check2)
    $submit.click(function () {
        if(!check1()||!check2())return;
        let name = $input.val().trim(),
            desc = $textarea.val().trim(),
            url = departmentId?"/department/update":"/department/add";
        axios.post(url,{
            departmentId:departmentId?departmentId:null,
            name,
            desc
        }).then(result=>{
            if(parseFloat(result.code)===0){
                alert("当前操作成功，即将返回部门列表页",{
                    handled:()=>{
                        window.location.href="departmentlist.html"
                    }
                })
            }
        })
    })
})
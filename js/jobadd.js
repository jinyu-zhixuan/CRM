$(function () {
    let $infoBox = $(".infoBox"),
        $inpBox1 = $(".inpBox").eq(0),
        $inpBox2 = $(".inpBox").eq(1),
        $inpBox3 = $(".inpBox").eq(2),
        $jobName = $(".inpBox:eq(0) input"),
        $jobDesc = $(".inpBox:eq(1) textarea"),
        $jobPower = $(".inpBox:eq(2) input"),
        $span = $("span").eq(1),
        $span1 =$("span").eq(3),
        $submit = $(".submit");

    // 编辑职务
    let jobId = window.location.href.queryURLParams().jobId;
    let name = window.location.href.queryURLParams().name;
    let power = window.location.href.queryURLParams().power;
    console.log($jobPower);
    let queryBaseInfo = function () {
        axios.get("/job/info", {
            params: {
                jobId
            }
        }).then(result => {
            if (parseFloat(result.code) === 0) {
                let { name, desc, power } = result.data;
                $jobName.val(name);
                $jobDesc.val(desc);
                let ary = []
                for (var i = 0; i < $jobPower.length; i++) {
                    ary.push($jobPower[i])
                }
                ary.forEach(item => {
                    if (power.includes(item.getAttribute("id"))) {
                        item.setAttribute("checked", true);
                    }
                })
                return;
            }
        })
    }
    queryBaseInfo()
    let checkName = function () {
        let checkNameVal = $jobName.val().trim();
        if (checkNameVal === "") {
            $span.html("职务名称为必填项");
            return false;
        }
        $span.html("");
        return true;
    }
    $jobName.on("blur",checkName);
    let checkDesc = function () {
        let checkDescVal = $jobDesc.val().trim();
        if (checkDescVal === "") {
            $span1.html("职务描述为必填项");
            return false;
        }
        $span1.html("");
        return true;
    }
    $jobDesc.on("blur",checkDesc);
    $submit.click(function () {   
        if (!checkName()||!checkDesc()){
            return ;
        }
        let str = "";
        let $jobPower1 = $(".inpBox:eq(2) input");
        $jobPower1.each(function(x,y){      
            if($(y).prop("checked")){                
                str+=$(y).attr("id")
                str+="|"
            }
        })
        str = str.substring(0,str.length-1)
        let url = jobId?"/job/update":"/job/add";
        axios.post(url, {
            jobId:jobId?jobId:null,
            name: $jobName.val().trim(),
            desc: $jobDesc.val().trim(),
            power: str
        }).then(result => {
            if (parseFloat(result.code) === 0) {
                alert("当前操作成功，即将返回列表页", {
                    handled: () => {
                        window.location.href = "userlist.html"
                    }
                })
            }
        })
    })
})
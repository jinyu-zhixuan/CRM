$(function () {
    let $tableBox = $(".tableBox"),
        $tbody = $tableBox.children("tbody"),
        $thead = $tableBox.children("thead"),
        $theadTH = $thead.find("th");
    let power = localStorage.getItem("power") || "";
    power = decodeURIComponent(power);
    // 权限校验
    let checkPower = function () {
        if (!power.includes("userhandle")) {
            $theadTH.eq($theadTH.length - 1).remove();
        }
    }
    checkPower();
    let render = function () {
        return axios.get("/job/list", {

        }).then(result => {
            let { code, data } = result;
            if (parseFloat(code) === 0) {
                return data;// return 的返回会传给下一个then中成功的回调函数
            }
        }).then(data => {
            let str = ``;
            data.forEach(item => {
                let { id, name, desc = "--", power = "--" } = item;
                power = power.replace("userhandle", "员工操作权").replace("departhandle", "部门操作权").replace("jobhandle", "职务操作权").replace("departcustomer", "部门全部客户").replace("allcustomer", "公司全部客户").replace("resetpassword", "重置密码")
                str += `<tr data-id="${item.id}" data-name="${item.name}">
                    <td class="w8">${id}</td>
				    <td class="w10">${name}</td>
				    <td class="w20">${desc}</td>
				    <td class="w50">${power}</td>
				    <td class="w12">
					<a href="jobadd.html?jobId=${id}&&name=${name}&&power=${power}">编辑</a>
					<a href="javascript:;">删除</a>
				</td>
                </tr>`
            })
            $tbody.html(str)
        }).then()
    }
    render()
    let handleDeleate = function () {
        $tbody.click(function (e) {
            let target = e.target,
                tarTag = target.tagName,
                tarVal = target.innerText,
                $target = $(target);
            let $grandParent = $target.parent().parent();
            let jobId = $grandParent.attr("data-id");
            let jobName = $grandParent.attr("data-name");
            if (tarTag === "A" && tarVal === "删除") {
                alert(`确定要删除${jobName}吗？`, {
                    title: "警告，当前操作很重要",
                    confirm: true,
                    handled: msg => {
                        if (msg === "CONFIRM") {
                            axios.get("/job/delete", {
                                params: { jobId }
                            }).then(result => {
                                if (parseFloat(result.code) === 0) {
                                    render();
                                    return;
                                }
                            })
                        }
                    }
                })
                return;
            }
        })
    }
    handleDeleate()
})
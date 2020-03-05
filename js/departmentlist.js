$(function () {
    let $tableBox = $(".tableBox"),
        $tbody = $tableBox.find("tbody"),
        power = localStorage.getItem("power") || "";
    power = decodeURIComponent(power);
    // console.log($tbody);
    console.log(power);
    axios.get("/department/list").then(result => {
        // console.log(result.data);
        let str = ``
        $(result.data).each((index, item) => {
            // console.log(item);
            let {
                id,
                name,
                desc
            } = item;
            // console.log(id,name,desc);
            str += `<tr data-name="${name}">
                    <td class="w10">${id}</td>
                    <td class="w20">${name}</td>
                    <td class="w40">${desc}</td>
                    <td class="w20">
                        ${power.includes("departhandle")?`<a href="departmentadd.html?departmentId=${id}">编辑</a><a href="javascript:;" departmentId="${id}">删除</a>`:``}
                    </td>
                  </tr>
            `;
        });
        // console.log(1)
        $tbody.html(str);
    }).then(() => {
        $tbody.off().on("click", fn);
    });
    function fn(e) {
        // console.dir(e.target);
        let target = e.target,
            $target = $(target);
        let $grandParent = $target.parent().parent(),
            name = $grandParent.attr("data-name");
        var departmentId = target.getAttribute("departmentId");
        if (target.innerHTML === "删除" && target.tagName === "A") {
            alert(`确定要删除${name}吗？`, {
                title: "警告，当前操作很重要",
                confirm: true,
                handled: msg => {
                    if (msg === "CONFIRM") {
                        axios.get("/department/delete", {
                            params: {
                                departmentId
                            }
                        }).then(result => {
                            if (parseFloat(result.code) === 0) {
                                window.location.href = "departmentlist.html"
                            }
                        })
                    }
                }
            })
        }
    }
})
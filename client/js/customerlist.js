(function () {
    let $selectBox = $(".selectBox"),
        $searchInp = $(".searchInp"),
        $tableBox = $(".tableBox"),
        $tbody = $tableBox.find("tbody"),
        $pageBox = $(".pageBox"),
        $pageNum = $pageBox.find(".pageNum");

    let lx = window.location.href.queryURLParams().lx || "",
        limit = 10,
        page = 1,
        flag;
    $pageNum.prev().css("display", "none");
    let render = function () {
        $pageBox.css("display", "block");
        return axios.get("/customer/list", {
            params: {
                lx: lx,
                type: $selectBox.val(),
                search: $searchInp.val(),
                limit,
                page
            }
        }).then(result => {
            let {
                code,
                total,
                totalPage,
                data
            } = result;
            flag = totalPage;
            if (parseFloat(code) === 0) {
                let str = ``;
                data.forEach(item => {
                    // item是这一行具体的信息
                    str += `<tr>
                            <td class="w8">${item.name}</td>
                            <td class="w5">${parseFloat(item.sex)==1?"女":"男"}</td>
                            <td class="w10">${item.email}</td>
                            <td class="w10">${item.phone}</td>
                            <td class="w10">${item.weixin}</td>
                            <td class="w10">${item.QQ}</td>
                            <td class="w5">${item.type}</td>
                            <td class="w8">${item.userName}</td>
                            <td class="w20">${item.address}</td>
                            <td class="w14">
                                <a href="customeradd.html?customerId=${item.id}">编辑</a>
                                <a href="javascript:;" customerId=${item.id}>删除</a>
                                <a href="visit.html?customerId=${item.id}">回访记录</a>
                            </td>
                    </tr>`
                });
                $tbody.html(str);
                // console.log(totalPage);
                let str1 = `<li class="active">1</li>`;
                let num = 2;
                for (let i = 0; i < totalPage - 1; i++) {
                    str1 += `<li>${num}</li>`;
                    num++;
                };
                $pageNum.html(str1)
            } else {
                $tbody.html("");
                $pageBox.css("display", "none")
            }
        })
    }
    render().then(function(){
        $tbody.on("click",fn)
    }).then(a);

    function a() {
        // 页码点击事件绑定
        $pageNum.find("li").off().on("click", activeMove)
        $pageNum.prev("a").off().click(function () {
            activeMove(page--)
        })
        $pageNum.next("a").off().click(function () {
            activeMove(page++)
        })
    }

    function activeMove(e) {
        // console.log(1);
        if (e.target) {
            page = parseFloat(e.target.innerText);
            $(this).addClass("active").siblings().removeClass("active");
        } else {
            $pageNum.children().eq(page - 1).addClass("active").siblings().removeClass("active");
        };
        if (page > 1 && page < flag) {
            $pageNum.prev().css("display", "inline-block");
            $pageNum.next().css("display", "inline-block");
        }
        if (page === 1) {
            $pageNum.prev().css("display", "none");
            $pageNum.next().css("display", "inline-block");
        }
        if (page === flag) {
            $pageNum.next().css("display", "none");
            $pageNum.prev().css("display", "inline-block");
        }
        axios.get("/customer/list", {
            params: {
                lx: lx,
                type: $selectBox.val(),
                search: $searchInp.val(),
                limit,
                page
            }
        }).then(result => {
            let {
                code,
                total,
                totalPage,
                data
            } = result;
            if (parseFloat(code) === 0) {
                let str = ``;
                data.forEach(item => {
                    // item是这一行具体的信息
                    str += `<tr>
                            <td class="w8">${item.name}</td>
                            <td class="w5">${parseFloat(item.sex)==1?"女":"男"}</td>
                            <td class="w10">${item.email}</td>
                            <td class="w10">${item.phone}</td>
                            <td class="w10">${item.weixin}</td>
                            <td class="w10">${item.QQ}</td>
                            <td class="w5">${item.type}</td>
                            <td class="w8">${item.userName}</td>
                            <td class="w20">${item.address}</td>
                            <td class="w14">
                                <a href="customeradd.html?customerId=${item.id}">编辑</a>
                                <a href="javascript:;" customerId=${item.id}>删除</a>
                                <a href="visit.html?customerId=${item.id}">回访记录</a>
                            </td>
                    </tr>`
                });
                $tbody.html(str);
            }
        }).then(function(){
            $tbody.on("click",fn)
        })
    }
    function fn(e) {
        console.dir(e.target);
        let target = e.target,
            customerId = target.getAttribute("customerId");
            console.log(customerId);
        if (target.innerHTML === "删除" && target.tagName === "A") {
            alert(`确定要删除这条客户信息吗？`, {
                title: "警告，当前操作很重要",
                confirm: true,
                handled: msg => {
                    if (msg === "CONFIRM") {
                        axios.get("/customer/delete", {
                            params: {
                                customerId
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
    // 下拉框事件
    $selectBox.off().on("change", function () {
        page = 1;
        $pageNum.prev().css("display", "none");
        $pageNum.next().css("display", "inline-block");
        render().then(a)
    })
    $searchInp.off().on("keyup", function (e) {
        if (e.keyCode === 13) {
            page = 1;
            $pageNum.prev().css("display", "none");
            $pageNum.next().css("display", "inline-block");
            render().then(a)
        }
    })
})();
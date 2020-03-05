$(function(){
    let $tbody = $("tbody"),
        $visitTime = $(".visitTime"),
        $visitText = $(".visitText"),
        $submit = $(".submit"),
        $wrap,$delate

    let customerId = window.location.href.queryURLParams()["customerId"]
    console.log(customerId)
    function render(){
        return axios.get("/visit/list",{
            params:{
                customerId
            } 
        }).then(result=>{
            if(result.code === 0){
                mes(result)
            }
            if(result.code === 1){
                $tbody.html("")
            }
        })
    }
    render().then(()=>{
        $wrap = $(".wrap")
        $delate = $("tr > td > a" )
        $delate.click(function(){
                let visitId = $(this).parent().parent().attr("visitId")
                axios.get("/visit/delete",{
                    params:{
                        visitId
                    }
                }).then(result=>{
                    if(result.code === 0){
                        console.log("正确万岁")
                    }
                })
            })
    })
    $submit.click(function(){
        let visitTime = $visitTime.val()
        let visitText = $visitText.val()
        // console.log(visitTime,visitText)
        axios.post("/visit/add",{
            customerId,
            visitText,
            visitTime
        })
    })


    function mes(result){
        let str = ``
        let data = result.data
        data.forEach((item,index)=>{
           str += `
           <tr visitId=${item.id}>
				<td class="w5">${++index}</td>
				<td class="w15">${item.visitTime}</td>
				<td class="w70 wrap">${item.visitText}</td>
			    <td class="w10">
					<a href="javascript:;">删除</a>
				</td>
			</tr> 
            `
        })
        $tbody.html(str)
        //  console.log(result.data)
     }
})
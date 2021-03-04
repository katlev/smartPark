/*js*/
    $('#matchScroll').niceScroll({
        cursorcolor: "#E2E2E2",
        cursoropacitymax: 1,
        touchbehavior: true,
        cursorwidth:'5px',
        cursorborder: "0",
        cursorborderradius: '5px'
    })
    $('#listScroll').niceScroll({
        cursorcolor: "#E2E2E2",
        cursoropacitymax: 1,
        touchbehavior:true,
        cursorwidth: '5px',
        cursorborder:'0',
        cursorborderradius:'5px'
    })


if ("WebSocket" in window){
    // 打开一个 web socket
    var ws = new WebSocket("ws://192.168.3.31:8080/hivisi/websocket");

    ws.onopen = function()
    {
        //Web Socket 已连接上，使用 send() 方法发送数据
        //ws.send("发送数据");发送数据
        //alert("数据发送中...");
    };

    ws.onmessage = function (evt)
    {
        //访客列表
        var received_msg = evt.data;
        var json=JSON.parse(received_msg);
        console.log(json);
        if(json !== ' '){
            var visiList = '<li class="collection-item listLi">' +
                '<img src="'+json.image1+'" alt="" style="width: 14%;height: 14%;display: inline">' +
                '<strong class="title">访客 '+json.extra+'</strong>' +
                '<span>到访时间  '+json.time+'</span>' +
                '</li>'
            $('#listScroll').prepend(visiList)

            //当前人数
            $('#curFlow').text(json.curNumber)

            //人脸匹配列表
            if(json.similarity >= 0.75){
                var faceCompare = '<li class="matchLi">' +
                    '<div style="display:inline;" class="col-md-4 col-sm-4 col-xs-4">' +
                    '<span>抓拍照</span>' +
                    '<img src="'+json.image1+'" alt="" class="matchImg" style="height: 80%;width:80%;display:inline;">' +
                    '<small>'+json.time+' 抓拍</small>' +
                    ' </div>' +
                    '<div class="col-md-4 col-sm-4 col-xs-4 matchNum">' +
                    '<strong class="NumLabel">匹配度</strong>' +
                    '<strong class="NumLabel">'+(json.similarity*100).toFixed(2)+'%</strong>' +
                    '</div>' +
                    '<div style="display: inline" class="col-md-4 col-sm-4 col-xs-4">' +
                    '<span>员工照</span>' +
                    '<img src="'+json.image2+'" alt="" style="height: 80%;width:80%;display: inline">' +
                    '<small></small>' +
                    '</div>' +
                    '</li>'

                $('#matchScroll').prepend(faceCompare)
            }

        }

    };

    ws.onclose = function()
    {
        // 关闭 websocket
       //alert("连接已关闭...");
    };

}else{
    // 浏览器不支持 WebSocket
    alert("您的浏览器不支持 WebSocket!");
}




$(function () {
    //访客列表
    visList()
    function visList(){
        $.ajax({
            type:'GET',
            url:'http://192.168.3.31:8080/hivisi/cur_display',
            dataType:'json',
            contentType:'application/x-www-form-urlencoded',
            success:function (res) {
                if(res.code === 200){
                    console.log(res.message)
                    //var dataArr = res.data.recordList
                    for(var i=0;i<res.data.recordList.length;i++){
                        var str = '<li class="collection-item listLi">' +
                            '<img src="'+res.data.recordList[i].image+'" alt="" style="width: 14%;height: 14%;display: inline">' +
                            '<strong class="title">访客 '+res.data.recordList[i].name+'</strong>' +
                            ' <span>到访时间  '+res.data.recordList[i].time+'</span>' +
                            '</li>'
                        $('#listScroll').append(str)
                    }
                }else{
                    alert(res.message)
                }
            },
            error:function (error) {
                console.log(error.message)
            }
        })
    }



    //当前人流量模块
    curFlow()
    function curFlow() {
        $.ajax({
            type:'GET',
            url:'http://192.168.3.31:8080/hivisi/cur_flow',
            dataType:'json',
            xhrFields:{
                withCredentials:false
            },
            contentType:'application/x-www-form-urlencoded',
            success:function (res) {
                if(res.code === 200){
                    $('#totalFlow').text(res.data.totalFlow)
                    $('#inputFlow').text(res.data.inFlow)
                    $('#outputFlow').text(res.data.outFlow)
                    $('#curFlow').text(res.data.curFlow)
                }else{
                    alert(res.message)
                }
            },
            error:function (error) {
                console.log(error.message)
            }
        })
    }

    //折线图
    $.ajax({
        type:'GET',
        url:'http://192.168.3.31:8080/hivisi/flow_analysis',
        dataType:'json',
        contentType:'application/x-www-form-urlencoded',
        success:function (res) {
            if(res.code === 200){
                var totalArray =[]
                var inputArray = []
                var outputArray = []
                var curArray = []
                res.data.forEach((item)=>{
                    totalArray.push(item.totalFlow)
                    inputArray.push(item.inFlow)
                    outputArray.push(item.outFlow)
                    curArray.push(item.curFlow)
                })

                localStorage.setItem('totalNum',JSON.stringify(totalArray))
                localStorage.setItem('inNum',JSON.stringify(inputArray))
                localStorage.setItem('outNum',JSON.stringify(outputArray))
                localStorage.setItem('cur',JSON.stringify(curArray))

            }else{
                alert(res.message)
            }
        },
        error:function (error) {
            console.log(error.message)
        }
    })

    var totalNum = JSON.parse(localStorage.getItem('totalNum'))
    var inputNum = JSON.parse(localStorage.getItem('inNum'))
    var outputNum = JSON.parse(localStorage.getItem('outNum'))
    var curNum = JSON.parse(localStorage.getItem('cur'))

    var lineChart = echarts.init(document.getElementById('lineChart'))
    var option = {
        title : {
            text:'人流量分析'
        },
        tooltip:{},
        legend:{
            data:["总人数","进入数","出去数","当前数"]

           /* data:["当前数"]*/

        },
        xAxis:{
            data:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
        },
        yAxis:{},
        series:[
            {
                name:'当前数',
                type:'line',
                data:curNum
            },
            {
                name:'总人数',
                type:'line',
                data:totalNum
            },
            {
                name:'进入数',
                type:'line',
                data:inputNum
            },
            {
                name:'出去数',
                type:'line',
                data:outputNum
            },

        ]
    }
    lineChart.setOption(option)


    //饼状图
    $.ajax({
        type:'GET',
        url:'http://192.168.3.31:8080/hivisi/flow_scatter',
        dataType:'json',
        contentType:'application/x-www-form-urlencoded',
        success:function (res) {
            if(res.code === 200){
                console.log(res.data)
                var list = []
                for(var key in res.data){
                    var temp = {}
                    if(res.data[key] > 0){
                        temp.name = key+'时'
                        temp.value = res.data[key]
                        list.push(temp)
                    }
                }
                console.log(list)
                localStorage.setItem('list',JSON.stringify(list))

            }else{
                alert(res.message)
            }
        },
        error:function (error) {
            console.log(error.message)
        }
    })

    var dataArray = JSON.parse(localStorage.getItem('list'))
    //console.log(dataArray)
    var donutChart = echarts.init(document.getElementById('donutChart'))
    var optionDonut = {
        title: {
            text:'当日人流量分析',
            left:'center'
        },
        tooltip:{
            trigger:'item',
            formatter:'{a}<br/>{b}:{c}({d}%)'
        },
            /*legend:{
                orient:'vertical',
                left:'left',
                data:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
            },*/
        series:[
            {
                name:'日时刻人流量',
                type:'pie',
                radius:'55%',
                center:['50%','50%'],
                data:dataArray
                    //[{name:'4时',value:4}, {name:'3时',value: 5}]
            }
        ]
    }
    donutChart.setOption(optionDonut)
})

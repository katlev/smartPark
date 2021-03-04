/*js*/
$(function () {
    /*var objUrl
    var img_html
    $('#myFile').change(function () {
        var img_div = $('.img_div')
        var imgUrl = $('#imgUrl')
        var filepath = $("input[name='myFile']").val()
        for(var i=0;i<this.files.length;i++){
            objUrl = getObjectURL(this.files[i])
            console.log('url:'+ objUrl)
            var extStart = filepath.lastIndexOf('.')
            var ext = filepath.substring(extStart,filepath.length).toUpperCase()
            //上传图片后缀限制
            if(ext!=='.BMP' && ext!=='.PNG' && ext!=='.GIF' && ext!=='.JPG' && ext!=='.JPEG'){
                alert('图片仅限于bmp,png,gif,jpeg,jpg格式')
                $('.img_div').html('')
                return false
            }else{
                //若规则全部通过则再次提交url到后台数据库
                imgUrl.text(objUrl)
                $('#imgAdd').click(function () {
                    img_html =" <li class=\"isImg\" style=\"position: relative\">" +
                        " <img src='" + objUrl + "' alt=\"\" style=\"width: 117px;height:160px\">" +
                        "<input type=\"checkbox\" class=\"isCheck\" style=\"position:absolute;z-index:1;top:5px;left:10px;opacity:1;\">" +
                        "<span class=\"imgName\">katle</span>" +
                        "<span class=\"imgNum\">450323199806061829</span>" +
                        "</li>"
                    img_div.append(img_html)
                    imgUrl.text('')
                })
            }
        }
        //每个图片的大小总和
        var file_size = 0
        var all_size = 0
        for(var j=0;j<this.files.length;j++){
            file_size = this.files[j].size
            all_size = all_size + this.files[j].size
            var size = all_size/1024
            if(size > 500){
                alert('上传的图片大小不能超过100k!')
                $('.img_div').html('')
                return false
            }
        }
        return true
    })
    //鉴定每个浏览器上传图片url
    function getObjectURL(file) {
        var url = null
        if(window.createObjectURL !== undefined){//basic
            url = window.createObjectURL(file)
        }else if(window.URL !== undefined){ //firefox
            url = window.URL.createObjectURL(file)
        }else if(window.webkitURL !== undefined){ //chrome
            url = window.webkitURL.createObjectURL(file)
        }
        console.log(url)
        return url
    }*/
    //分组列表
    groupList()
    function groupList(){
        $.ajax({
            type:'GET',
            url:'http://192.168.3.31:8080/hivisi/group/group_list',
            dataType:'JSON',
            contentType:'application/x-www-form-urlencoded',
            success:function (res) {
                //console.log(res.message)
                if(res.code === 200){
                    var idArr = []
                    var groupName = []
                    for(let i=0;i<res.data.length;i++){
                        var list = '<div class="panel panel-default" >' +
                            '<div class="panel-heading " role="tab" id="heading'+res.data[i].featId+'">' +
                            '<span class="colSetLeft">'+ res.data[i].featId +'</span>' +
                            '<span class="colSetLeft">'+ res.data[i].featName +'</span>' +
                            '<span class="panel-title pull-right colSetRight" data-toggle="collapse" data-parent="#accordion" href="#collapse'+res.data[i].featId+'" aria-expanded="false" aria-controls="collapse'+res.data[i].featId+'">' +
                            '<i class="fa fa-chevron-down" id="'+res.data[i].featId+'"></i>' +
                            '</span>' +
                            '<span class="pull-right colSetMid">' +
                            '<i class="fa fa-trash" data-toggle="modal" data-target="#delGroup" id="'+res.data[i].featId+'"></i>' +
                            '</span>' +
                            '<span class="pull-right colSetMid">'+
                            '<i class="fa fa-edit" data-toggle="modal" data-target="#edGroup" id="'+res.data[i].featId+'"></i>' +
                            '</span>' +
                            '</div>' +
                            '<div id="collapse'+res.data[i].featId+'" class="panel-collapse collapse " role="tabpanel" aria-labelledby="heading'+res.data[i].featId+'">' +
                            '<div class="panel-body">' +
                            '<div class="btnList">' +
                            '<a class="a-upload" id="checkAll'+res.data[i].featId+'">全选</a>' +
                            '<a class="a-upload" id="notCheckAll'+res.data[i].featId+'">取消全选</a>' +
                            '<a class="a-upload" id="del'+res.data[i].featId+'">删除</a>' +
                            '<a type="button" data-toggle="modal" data-target="#addFace'+res.data[i].featId+'" class="a-upload" methods="post" enctype="multipart/form-data">添加人脸</a>' +
                            '</div>' +
                            //addface Modal
                            '<div class="modal fade" id="addFace'+res.data[i].featId+'" tabindex="-1" role="dialog" aria-labelledby="addFaceLabel'+res.data[i].featId+'">' +
                            '<div class="modal-dialog" role="document">' +
                            '<div class="modal-content">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-labelledby="Close">' +
                            '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                            '<h4 class="modal-title" id="addFaceLabel'+res.data[i].featId+'">添加人脸</h4>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '<form>' +
                            '<div class="form-group">' +
                            '<label class="control-label">名称：</label>' +
                            '<input type="text" class="form-control" id="imgName'+res.data[i].featId+'" placeholder="请输入要添加图片的名称">' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label class="control-label">编号</label>' +
                            '<input type="text" class="form-control" id="imgNum'+res.data[i].featId+'" placeholder="请输入添加的人脸编号">' +
                            '</div>' +
                            '<div class="form-group">' +
                            /*'<span id="imgUrl" class="imgBase"></span>' +*/
                            /*'<a href="javascript:;" class="a-upload">' +*/
                            '<input type="file" name="myFile" id="myFile'+res.data[i].featId+'" multiple="multiple">' +
                            /*'</a>' +*/
                            '</div>' +
                            '</form>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button type="button" id="imgAdd'+res.data[i].featId+'" class="btn btn-primary imageAdd" style="margin-left: 10px" data-dismiss="modal">确认</button>' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            //addFace Modal
                            '<ul class="img_div" id="checkNum'+res.data[i].featId+'">' +
                            '</ul>' +
                            '</div>' +
                            '</div>' +
                            '</div>'




                        $('#accordion').append(list)
                        let id = res.data[i].featId
                        idArr.push(id)
                        groupName.push(res.data[i].featName)

                        //每个分组的内容
                        $.ajax({
                            type:'GET',
                            url:'http://192.168.3.31:8080/hivisi/group/group_faces/' + id,
                            dataType:'json',
                            contentType:'application/json;charset=UTF-8',
                            success:function (res) {
                                if(res.code === 200){
                                    //console.log(res.message)
                                    for(var i=0;i<res.data.length;i++){
                                        var liList = '<li class="isImg" style="position: relative" id="imgList'+id+'">' +
                                            '<img src="'+res.data[i].imageUrl+'" alt="" style="width: 117px;height:160px">' +
                                            '<input type="checkbox" class="isCheck" name="'+res.data[i].faceId+'" style="position:absolute;z-index:1;top:5px;left:10px;opacity:1;">' +
                                            '<span class="imgName">'+res.data[i].name+'</span>' +
                                            '<span class="imgNum">'+res.data[i].extra+'</span>' +
                                            '</li>'
                                        $('#checkNum'+id ).append(liList)

                                    }

                                }else{
                                    alert(res.message)
                                }
                            },
                            error:function (error) {
                                console.log(error.message)
                            }
                        })
                        //每个分组内容请求结束

                        //删除人脸
                        let checkbox = document.getElementById("checkNum" + id).getElementsByTagName("input")
                        //console.log(checkbox)
                        /*全选*/
                        $('#checkAll' + id).click(function () {
                            for(var i=0;i<checkbox.length;i++){
                                checkbox[i].checked = true
                            }
                            //console.log('checkAll')
                        })
                        /*取消全选*/
                        $('#notCheckAll' + id).click(function () {
                            for(var i=0;i<checkbox.length;i++){
                                checkbox[i].checked = false
                            }
                        })

                        $('#del' + id).click(function () {
                            var faceArr = []
                            for(var i=0;i<checkbox.length;i++){
                                if(checkbox[i].checked === true){
                                    faceArr.push(parseInt(checkbox[i].name))
                                }
                            }
                            //console.log(faceArr)
                            if(faceArr.length === 0){
                                alert('请选择要删除的人脸')
                                return
                            }else{

                                $.ajax({
                                    type:'DELETE',
                                    url:'http://192.168.3.31:8080/hivisi/face/del_face',
                                    dataType:'json',
                                    contentType:'application/json;charset=UTF-8',
                                    data:JSON.stringify(faceArr),
                                    success:function (res) {
                                        if(res.code === 200){
                                            alert('删除成功！')
                                            location.reload()

                                        }else{
                                            alert(res.message)
                                        }
                                    },
                                    error:function (error) {
                                        console.log(error.message)
                                    }
                                })
                            }

                        })
                       //删除人脸操作结束

                        //添加人脸
                        $('#imgAdd' + id).click(function () {
                            var faceName = $('#imgName' + id).val()
                            var faceNum = $('#imgNum' + id).val()

                            var img = document.getElementById('myFile'+id)
                            var imgFile = new FileReader()
                            imgFile.readAsDataURL(img.files[0])
                            imgFile.onload = function () {
                                var imgData = this.result
                                var imgBase = imgData.replace(/^data:image\/\w+;base64,/, ""); //去掉base64的头部

                                console.log(faceName)
                                console.log(faceNum)
                                console.log(id)

                                if(faceName.trim() === '' || faceNum.trim() === '' || imgBase === undefined){
                                    alert('输入不能为空')
                                    return
                                }

                                $.ajax({
                                    type:'POST',
                                    url:'http://192.168.3.31:8080/hivisi/face/save_face',
                                    dataType:'json',
                                    contentType:'application/x-www-form-urlencoded',
                                    data:{
                                        extra:faceNum,
                                        featId:parseInt(id),
                                        image:imgBase,
                                        name:faceName
                                    },
                                    success:function (res) {
                                        console.log(imgBase)
                                        console.log(res)
                                        if(res.code === 200){
                                            console.log(res.message)
                                            //console.log('添加成功')
                                            $('#imgName').text(faceName)
                                            $('#imgNum').text(faceNum)
                                           var str = " <li class=\"isImg\" style=\"position: relative\">" +
                                               "<img src='" + imgData + "' alt=\"\" style=\"width: 117px;height:160px\">" +
                                               "<input type=\"checkbox\" class=\"isCheck\" style=\"position:absolute;z-index:1;top:5px;left:10px;opacity:1;\">" +
                                               "<span class=\"imgName\" id='imgName'></span>" +
                                               "<span class=\"imgNum\" id='imgNum'></span>" +
                                               "</li>"
                                            $('#checkNum' + id).append(str)
                                            //location.reload()
                                            alert('人脸添加成功！')
                                        }else{
                                            alert(res.message)
                                            //console.log('添加失败')
                                        }
                                    },
                                    error:function (error) {
                                        console.log(error.message)
                                        console.log('请求失败')
                                    }
                                })
                            }

                        })
                    }
                    localStorage.setItem('delArray',JSON.stringify(idArr))
                    localStorage.setItem('groName',JSON.stringify(groupName))
                }else{
                    alert(res.message)
                }
            },
            error:function (error) {
                console.log(error.message)
            }
        })
    }

    //创建分组
    $('#buildGroup').click(function () {
        var groupName = $('#message-text').val()
        if(groupName.trim() === ''){
            alert('群组名不能为空')
            return
        }
        var nameArr = JSON.parse(localStorage.getItem('groName'))
        nameArr.forEach(function (item) {
            if(item === groupName){
                alert('该群组名已存在，请重新命名！')
                return
            }
        })
        $.ajax({
            type:'POST',
            url:'http://192.168.3.31:8080/hivisi/group/create_group',
            dataType:'json',
            contentType:'application/x-www-form-urlencoded',
            data:{
                name:groupName
            },
            success:function (res) {
                if(res.code === 200){
                    alert('群组创建成功！')
                    location.reload()

                }else{
                    alert(res.message)
                }
            },
            error:function (error) {
                console.log(error.message)
            }
        })

    })

    $('#accordion').click(function (e) {
        var trashArr = JSON.parse(localStorage.getItem('delArray'))
        let clickDelId = $(e.target).attr('id')
        trashArr.forEach(function (item) {
            if(parseInt(item) === parseInt(clickDelId)){
                console.log('Id:' + item)
                console.log('clickId:' + clickDelId)
                //删除分组
                $('#checkDel').click(function () {
                    $.ajax({
                        type:'DELETE',
                        url:'http://192.168.3.31:8080/hivisi/group/del_group?featId=' + parseInt(clickDelId),
                        dataType:'json',
                        contentType:'application/json;charset=UTF-8',
                        data:{
                            featId:parseInt(clickDelId)
                        },
                        success:function (res) {
                            //console.log(res.message)
                            if(res.code === 200){
                                console.log('删除成功')
                                location.reload()
                            }else{
                                alert(res.message)
                            }
                        },
                        error:function (error) {
                            console.log(error.message)
                        }
                    })
                })
                //修改分组
                $('#checkEdit').click(function () {
                    var editName = $('#editName').val()
                    if (editName.trim() === ''){
                        alert('群组名不能为空！')
                        return
                    }
                    console.log('name:' + editName)
                    $.ajax({
                        type:'PUT',
                        url:'http://192.168.3.31:8080/hivisi/group/update_group?featId='+ parseInt(clickDelId)+'&name='+editName,
                        dataType:'json',
                        contentType:'application/json;charset=UTF-8',
                        data:{
                            featId:parseInt(clickDelId),
                            name:editName
                        },
                        success:function (res) {
                            console.log(res.message)
                            if(res.code === 200){
                                alert('群组名修改成功！')
                                location.reload()
                            }else{
                                alert(res.message)
                            }
                        },
                        error:function (error) {
                            console.log(error.message)
                        }
                    })
                })
            }
        })
    })
})




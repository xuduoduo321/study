
var Username;
var userId;

// 检测用户登录状态 start
$(function () {
    var article_id = getQueryParam("id");
    $.ajax({
        type: "POST",
        url: "/Login.aspx/LoginStatus",
        contentType: "application/json;charset = utf-8",
        dataType: "json",
        data: {},
        success: function (data) {
            var jsonData = JSON.parse(data.d);
            Username = jsonData.Username;
            userId = jsonData.Id;
            var link = document.getElementById('My_art');
            var page = "MyArt";
            link.href = 'index2.html?keyword=' + encodeURIComponent(userId) + '&page=' + encodeURIComponent(page);
            if (data.d != "false") {
                $('#loginLink').text("欢迎您，" + Username);
                $('#LoginOut').css('display', 'block');
                $('#loginLink').click(function (event) {
                    event.preventDefault();
                });
                // 修改文章 start
                if (article_id) {
                    $('#Edit').text('修改文章');
                    $('#submit').val('修改文章');
                    var jsonDataObj = {
                        keyword:article_id
                    }
                    var jsonDataStr = JSON.stringify(jsonDataObj);

                    $.ajax({
                        type: "POST",
                        url: "/Search_Article.aspx/Search_Articles_By_ArticleID",
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        data: jsonDataStr,
                        success: function (data) {
                            var result = JSON.parse(data.d);
                            $("#title").val(result[0].Title);
                            $("#markdown_con").val(result[0].ContentMarkdownText)
                        }
                    })
                    var form = document.getElementById('uploadForm');
                    var fileInput = document.getElementById('attachmentFile');
                    var fileUrls = []; // 用于存储上传成功后的多个附件地址
                    // 监听文件选择变化
                    fileInput.addEventListener('change', handleFileUpload);
                    function handleFileUpload(event) {
                        //var formData = new FormData($('#uploadForm')[0]); // 创建 FormData 对象
                        var formData = new FormData(); // 创建 FormData 对象

                        // 遍历所有选择的文件，添加到 FormData 中
                        for (var i = 0; i < fileInput.files.length; i++) {
                            formData.append("attachment-file", fileInput.files[i]);
                        }
                        $.ajax({
                            url: '/UploadAttachment.ashx', // 替换为你的处理程序路径
                            type: 'POST',
                            data: formData,
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (response) {

                                try {
                                    if (response.success === 1) {
                                        // 假设 response.url 是一个数组，包含多个文件地址
                                        response.urls.forEach(url => {
                                            fileUrls.push(url); // 将每个文件地址单独添加到 fileUrls 数组中
                                        });

                                        // 这里可以根据需要进行后续操作，比如展示给用户或者存储到数据库等

                                        // 如果所有文件都上传完成，可以进行最终的处理
                                        if (fileUrls.length === fileInput.files.length) {
                                            console.log('所有文件上传完成，附件地址列表：', fileUrls);

                                            // 这里可以继续其他操作，例如提交表单或者保存到数据库
                                        }
                                    } else {
                                        console.error('上传失败：', response.message);
                                    }
                                } catch (e) {
                                    console.log('解析响应时出错：', e);
                                }

                            },
                            error: function (xhr, status, error) {
                                console.error('请求出错：', status, error);
                            }
                        });
                    }
                    $('#submit').on('click', function (event) {
                        event.preventDefault(); // 阻止默认行为
                        time = formatDateTime();
                        var title = $('#title').val();
                        var selectedCategory = $('input[name="category"]:checked').val();
                        if (!title) {
                            alert('请填写文章标题'); // 显示提示信息
                            return;
                        } else if (!selectedCategory) {
                            alert('请选择一个类别'); // 显示提示信息
                            return;
                        } else {
                            var contentMarkdownText = $("#markdown_con").val();
                            // 提取文章封面
                            var ArticlePic = extractImageUrlFromMessage(contentMarkdownText)
                            // 使用marked将Markdown转换为HTML  
                            var html = marked(contentMarkdownText);
                            document.getElementById('output').innerHTML = html;
                            var contentText = document.getElementById('output').textContent
                            if (fileUrls.length == 0) {
                                fileUrls.push('#');
                            }
                            var jsonDataObj = {
                                ArticleId: article_id,
                                Title: title,
                                ContentMarkdownText: contentMarkdownText,
                                ContentText: contentText,
                                PublishTime: time,
                                Category: selectedCategory,
                                Files: fileUrls,
                                OverImg:ArticlePic
                            };
                            var jsonDataStr = JSON.stringify(jsonDataObj);
                            $.ajax({
                                type: "POST",
                                url: "/Edit_Article.aspx/Reverse_articles",
                                contentType: "application/json;charset=utf-8",
                                dataType: "json",
                                data: jsonDataStr,
                                success: function (data) {
                                    if (data.d == "true") {
                                        alert("修改成功!");
                                        window.location.href = "index2.html";
                                    } else {
                                        console.log(data.d);
                                    }

                                }, error: function () {
                                    alert("服务器错误!");
                                }


                            })

                        }
                    });
                    // 修改文章 end


                }
                else {
                    // 发布文章 start
                    var form = document.getElementById('uploadForm');
                    var fileInput = document.getElementById('attachmentFile');
                    var fileUrls = []; // 用于存储上传成功后的多个附件地址

                    // 监听文件选择变化
                    fileInput.addEventListener('change', handleFileUpload);
                    function handleFileUpload(event) {
                        //var formData = new FormData($('#uploadForm')[0]); // 创建 FormData 对象
                        var formData = new FormData(); // 创建 FormData 对象

                        // 遍历所有选择的文件，添加到 FormData 中
                        for (var i = 0; i < fileInput.files.length; i++) {
                            formData.append("attachment-file", fileInput.files[i]);
                        }
                        $.ajax({
                            url: '/UploadAttachment.ashx', // 替换为你的处理程序路径
                            type: 'POST',
                            data: formData,
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (response) {

                                try {
                                    if (response.success == 1) {

                                        response.urls.forEach(url => {
                                            fileUrls.push(url); 
                                        });

                                        // 如果所有文件都上传完成，可以进行最终的处理
                                        if (fileUrls.length == fileInput.files.length) {
                                            console.log('所有文件上传完成，附件地址列表：', fileUrls);

                                            // 这里可以继续其他操作，例如提交表单或者保存到数据库
                                        }
                                    } else {
                                        console.error('上传失败：', response.message);
                                    }
                                } catch (e) {
                                    console.log('解析响应时出错：', e);
                                }

                            },
                            error: function (xhr, status, error) {
                                console.error('请求出错：', status, error);
                            }
                        });
                    }


                    $('#submit').on('click', function (event) {
                        event.preventDefault(); // 阻止默认行为
                        time = formatDateTime();
                        var title = $('#title').val();
                        var selectedCategory = $('input[name="category"]:checked').val();
                        if (!title) {
                            alert('请填写文章标题'); // 显示提示信息
                            return;
                        } else if (!selectedCategory) {
                            alert('请选择一个类别'); // 显示提示信息
                            return;
                        } else {
                            var contentMarkdownText = $("#markdown_con").val();
                            var img = extractImageUrlFromMessage(contentMarkdownText);
                            // 使用marked将Markdown转换为HTML  
                            var html = marked(contentMarkdownText);
                            document.getElementById('output').innerHTML = html;
                            var contentText = document.getElementById('output').textContent
                            if (fileUrls.length == 0) {
                                fileUrls.push('#');
                            }
                            var jsonDataObj = {
                                Userid: userId,
                                Author: Username,
                                Title: title,
                                ContentMarkdownText: contentMarkdownText,
                                ContentText: contentText,
                                PublishTime: time,
                                Category: selectedCategory,
                                Files: fileUrls,
                                OverImg:img
                            };
                            var jsonDataStr = JSON.stringify(jsonDataObj);
                            $.ajax({
                                type: "POST",
                                url: "/Edit_Article.aspx/Publish_articles",
                                contentType: "application/json;charset=utf-8",
                                dataType: "json",
                                data: jsonDataStr,
                                success: function (data) {
                                    if (data.d == "true") {
                                        alert("发布成功!");
                                        window.location.href = "index2.html";
                                    } else {
                                        console.log(data.d);
                                    }

                                }, error: function () {
                                    alert("服务器错误!");
                                }


                            })
                        }
                    });
                    // 发布文章 end


                }




            } else {
                alert("请先登录!");

            }
        }, error: function () {

            alert("查询用户状态错误！");
        }



    })
})
// 检测用户登录状态 end

// 退出登录 start
$("#loginout").click(function () {
    var userConfirmed = confirm('你确定要退出吗？');
    if (userConfirmed) {
        $.ajax({
            type: "POST",
            url: "/Login.aspx/Logout",
            contentType: "application/json;charset = utf-8",
            dataType: "json",
            data: {},
            success: function () {
                alert("退出成功!");
                window.location.href = "index.html";

            }


        })
    }


})

// 退出登录 end


// 剪贴板粘贴图片 start
function initPasteDragImg(Editor) {
    var doc = document.getElementById(Editor.id)
    doc.addEventListener('paste', function (event) {
        var items = (event.clipboardData || window.clipboardData).items;
        var file = null;
        if (items && items.length) {
            // 搜索剪切板items
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    file = items[i].getAsFile();
                    break;
                }
            }
        } else {
            console.log("当前浏览器不支持");
            return;
        }
        if (!file) {
            console.log("粘贴内容非图片");
            return;
        }
        uploadImg(file, Editor);
    });
    var dashboard = document.getElementById(Editor.id)
    dashboard.addEventListener("dragover", function (e) {
        e.preventDefault()
        e.stopPropagation()
    })
    dashboard.addEventListener("dragenter", function (e) {
        e.preventDefault()
        e.stopPropagation()
    })
    dashboard.addEventListener("drop", function (e) {
        e.preventDefault()
        e.stopPropagation()
        var files = this.files || e.dataTransfer.files;
        uploadImg(files[0], Editor);
    })
}
function uploadImg(file, Editor) {
    var formData = new FormData();
    var fileName = new Date().getTime() + "." + file.name.split(".").pop();
    formData.append('editormd-image-file', file, fileName);
    $.ajax({
        url: Editor.settings.imageUploadURL,
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (msg) {
            var success = msg['success'];
            if (success == 1) {
                var url = msg["url"];
                if (/\.(png|jpg|jpeg|gif|bmp|ico)$/.test(url)) {
                    Editor.insertValue("![图片alt](" + msg["url"] + ")");
                } else {
                    Editor.insertValue("[下载附件](" + msg["url"] + ")");
                }
            } else {
                console.log(msg);
                alert("上传失败");
            }
        }
    });
}

// 剪贴板粘贴图片 end




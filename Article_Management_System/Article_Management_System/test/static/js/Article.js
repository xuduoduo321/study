var UserId; 
var arcuserid;
$(function () {
    $.ajax({
        type: "POST",
        url: "/Login.aspx/LoginStatus",
        contentType: "application/json;charset = utf-8",
        dataType: "json",
        data: {},
        success: function (data) {
            var jsonData = JSON.parse(data.d);
            var Username = jsonData.Username;
            var userId = jsonData.Id;
            UserId = jsonData.Id;
            var link = document.getElementById('My_art');
            var page = "MyArt";
            link.href = 'index2.html?keyword=' + encodeURIComponent(userId) + '&page=' + encodeURIComponent(page);
            if (data.d != "false") {


                $('#loginLink').text("欢迎您，" + Username);
                $('#LoginOut').css('display', 'block');
                $('#loginLink').click(function (event) {
                    event.preventDefault();

                });
            }
        }, error: function () {

            alert("查询用户状态错误！");
        }

    })



    var ArticleId = getQueryParam('id');
    var jsonDataObj = {

        keyword: ArticleId
    }
    var jsonDataStr = JSON.stringify(jsonDataObj);
    $.ajax({
        type: "POST",
        url: "/Search_Article.aspx/Search_Articles_By_ArticleID",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: jsonDataStr,
        success: function (data) {
            var articles = JSON.parse(data.d);
            arcuserid = articles[0].UserId; 
            $.each(articles, function (index, article) {
                var articleHtml = '<div class="gj-title">';
                articleHtml += '<h3>' + article.Title + '</h3>';
                articleHtml += '<span >发布时间：' + formatDate(article.PublishTime) +'</span>';
                articleHtml += '<span class="hidden-xs">作者：' + article.Author + '</span>';
                articleHtml += `<span>阅读:${article.ReadCount}次</span>`
                articleHtml += '</div>';

                articleHtml += '<div class="gj-cont">';
                articleHtml += '<ol class=" list-paddingleft-2" style="list-style-type: decimal; padding-left: 0px;">';
                articleHtml += '<li>';
                articleHtml += marked(article.ContentMarkdownText);
                articleHtml += '</li>';
                // 文章附件
                if (article.FilePaths != "#" &&  article.FilePaths) {
                    var filePaths = article.FilePaths.split(',');
                    filePaths.forEach(function (filePath) {
                        if (filePath.trim()) { // 去除空格后再检查是否为空
                            articleHtml += '<li>';
                            articleHtml += '<span style="display:inline-block; margin-right:3px;">附件下载:</span>';
                            articleHtml += `<a style="color:blue;" href="${filePath}" download>${getFileName(filePath.trim())}</a>`;
                            articleHtml += '</li>';
                        }
                    });

                }

                articleHtml += '</ol>';
                articleHtml += '</div>';

                // 将构建好的HTML添加到容器中  
                $('#art_cont').append(articleHtml);

            });
            function sanitizePath(path) {
                return '"' + path + '"';
            }

            // 评论功能


            var jsonDataObj2 = {
                articleId: ArticleId
            }
            var jsonDataStr2 = JSON.stringify(jsonDataObj2);
            $.ajax({
                type: "POST",
                url: "/Comments_Article.aspx/Readcomment",
                contentType: "application/json;charset = utf-8",
                dataType: "json",
                data: jsonDataStr2,
                success: function (data) {
                    var articles = JSON.parse(data.d);
                    let art = Object.keys(articles);
                    document.getElementById('Comment_sum').innerText = art.length;
                    $.each(articles, function (index, article) {
                        var articleHtml = '<li style="padding:0; margin:10px; border:1px solid #ddd">';
                        articleHtml += '<input id = "commId" value = ' + article.CommentId +' style = "display: none;" />'
                        articleHtml += '<div class="gpl-user">';
                        articleHtml += '<a href="#" target="_blank">';
                        articleHtml += ' <h4 style= "margin:1px 2px;">' + article.UserName + ':</h4>';
                        articleHtml += '</a>';
                        articleHtml += '</div>';
                        articleHtml += '<p class="gpl-cont">';
                        articleHtml += '<span class="original_comment">';
                        articleHtml += '<a href="javascript:void(0);" class="user_name" rel="nofollow"></a>&nbsp;&nbsp;' + article.CommentText + '';
                        articleHtml += '</span>';
                        articleHtml += '</p>';
                        articleHtml += '<div class="gpl-list">';
                        articleHtml += '<p><span>' + formatDate(article.CommentTime) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p >';
                        articleHtml += '</div>';
                        articleHtml += '</li>';
                        // 如果登录用户id 等于当前文章id则显示删除按钮
                        if (UserId == arcuserid) {
                            articleHtml += '<p style="height:25px; line-height: 20px; margin-bottom:5px;"><input id = "comment_del"  class="sub_btn" type="submit" style="border:1px solid #ddd; color:#999; padding:2px 10px; float:right" value="删除" /></p>'

                        }
                        // 将构建好的HTML添加到容器中  
                        $('#Read_comment').append(articleHtml);
                    });
                },

                error: function () {

                }
            })


            //  评论开始 start
            $("#con_sub_btn").click(function (event) {
                event.preventDefault();
                var time = formatDateTime();
                $.ajax({
                    type: "POST",
                    url: "/Login.aspx/LoginStatus",
                    contentType: "application/json;charset = utf-8",
                    dataType: "json",
                    data: {},
                    success: function (data) {
                        var jsonData = JSON.parse(data.d);
                        Username = jsonData.Username;
                        UserId = jsonData.Id;
                        if (Username != undefined) {
                            var Commments = $("#content_val").val()
                            var jsonDataObj = {
                                username: Username,
                                commmentcontent:Commments,
                                userId: UserId,
                                commentTime: time,
                                articleId: ArticleId
                            }
                            var jsonDataStr = JSON.stringify(jsonDataObj);
                            $.ajax({
                                type: "POST",
                                url: "/Comments_Article.aspx/Addcomment",
                                contentType: "application/json;charset = utf-8",
                                dataType: "json",
                                data: jsonDataStr,
                                success: function (data) {
                                    if (data.d == "true") {
                                        alert("评论成功!");
                                        var jsonDataObj2 = {
                                            articleId: ArticleId
                                        }
                                        var jsonDataStr2 = JSON.stringify(jsonDataObj2);
                                        $.ajax({
                                            type: "POST",
                                            url: "/Comments_Article.aspx/Readcomment",
                                            contentType: "application/json;charset = utf-8",
                                            dataType: "json",
                                            data: jsonDataStr2,
                                            success: function (data) {
                                                var articles = JSON.parse(data.d);
                                                let art = Object.keys(articles);
                                                document.getElementById('Comment_sum').innerText = art.length;
                                                $.each(articles, function (index, article) {
                                                    var articleHtml = '<li style="padding:0; margin:10px; border:1px solid #ddd">';
                                                    articleHtml += '<input id = "commId" value = ' + article.CommentId + ' style = "display: none;" />'
                                                    articleHtml += '<div class="gpl-user">';
                                                    articleHtml += '<a href="#" target="_blank">';
                                                    articleHtml += ' <h4 style= "margin:1px 2px;">' + article.UserName + ':</h4>';
                                                    articleHtml += '</a>';
                                                    articleHtml += '</div>';
                                                    articleHtml += '<p class="gpl-cont">';
                                                    articleHtml += '<span class="original_comment">';
                                                    articleHtml += '<a href="javascript:void(0);" class="user_name" rel="nofollow"></a>&nbsp;&nbsp;' + article.CommentText + '';
                                                    articleHtml += '</span>';
                                                    articleHtml += '</p>';
                                                    articleHtml += '<div class="gpl-list">';
                                                    articleHtml += '<p><span>' + formatDate(article.CommentTime) + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p >';
                                                    articleHtml += '</div>';
                                                    articleHtml += '</li>';
                                                    // 如果登录用户id 等于当前文章id则显示删除按钮
                                                    if (UserId == arcuserid) {
                                                        articleHtml += '<p style="height:25px; line-height: 20px; margin-bottom:5px;"><input id = "comment_del"  class="sub_btn" type="submit" style="border:1px solid #ddd; color:#999; padding:2px 10px; float:right" value="删除" /></p>'

                                                    }
                                                    // 将构建好的HTML添加到容器中  
                                                    $('#Read_comment').append(articleHtml);
                                                });
                                            },

                                            error: function () {

                                            }
                                        })
                                            


                                    } else {
                                        alert("评论失败!")
                                    }
                                },
                                error: function () {
                                    alert("评论添加失败!");

                                }

                            })


                        
                        } else {
                            alert("请先登录！");
                        }
                    }, error: function () {

                        alert("获取用户登录状态错误!");
                    }
                },
                )

            })
             // 评论功能 end
            
        }

    })

    // 文章浏览量增加 start
    $.ajax({
        type: "POST",
        url: "/Login.aspx/LoginStatus",
        contentType: "application/json;charset = utf-8",
        dataType: "json",
        data: {},
        success: function (data) {
            var jsonData = JSON.parse(data.d);
            if (data.d == "false") {
                var User_id = -1;

            } else {
                var User_id = jsonData.Id;
            }
            $.ajax({
                type: "POST",
                url: "/Search_Article.aspx/AddReadCount",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify({ Userid: User_id, Artcid: ArticleId }), // 合并为一个对象
                error: function () {
                    alert("错误!");
                }
            })

        }


    })



    // 文章浏览量增加 end



})


// 评论删除 start
$(document).on('click', '#comment_del', function () {
    if (confirm("您确定要删除这条评论吗？")) {
        var commid = $("#commId").val();
        var jsonDataObj = {
            CommId: commid
        }
        var jsonDataStr = JSON.stringify(jsonDataObj);
        $.ajax({
            type: "POST",
            url: "/Comments_Article.aspx/Del_Comment",
            contentType: "application/json;charset = utf-8",
            dataType: "json",
            data: jsonDataStr,
            success: function (data) {
                if (data.d == "ture") {
                    alert("评论删除成功!")
                    location.reload();
                }

            },
            error: function () {
                alert("评论删除出错!");
            }



        })
    }
    else {
        alert("已取消删除操作。");  
    }


});



// 评论删除 end

$("#My_art").click(function () {
    location.reload(); // 从浏览器缓存或服务器加载页面  
    location.reload(true);

})

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



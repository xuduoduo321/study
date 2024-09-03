$(function () {

    // 检查用户状态 start
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
            }
        }, error: function () {

            alert("查询用户状态错误！");
        }



    })

    // 检查用户状态 end



    $(function () {
        var pageNumber = 1; // 当前页码
        var pageSize = 3; // 每页显示的记录数
        var totalRecords = 0; // 总记录数
        var jsonDataObj = {
            pageNumber: pageNumber,
            pageSize: pageSize
        };
        var jsonDataStr = JSON.stringify(jsonDataObj);

        function loadArticles(pageNumber) {
            jsonDataObj.pageNumber = pageNumber;
            jsonDataStr = JSON.stringify(jsonDataObj);

            $.ajax({
                type: "POST",
                url: "/Search_Article.aspx/Search_All_Articles",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: jsonDataStr,
                success: function (response) {
                    var result = JSON.parse(response.d);
                    var articles = result.Articles;
                    totalRecords = result.TotalRecords;
                    $('#article-container').empty();
                    $.each(articles, function (index, article) {
                        var articleHtml = '<div class="gtw-ul gclear">';
                        var ImageUrl = article.CoverPhotoUrl;
                        articleHtml += '<div class="gtw-img">';
                        articleHtml += `<a href="Article.html?id=${article.ArticleId}"><img src="${ImageUrl}" alt="${article.Title}"></a>`;
                        articleHtml += '</div>';
                        articleHtml += '<div class="gtw-body">';
                        articleHtml += `<a href="Article.html?id=${article.ArticleId}">`;
                        articleHtml += '<h4>' + article.Title + '</h4>';
                        articleHtml += '</a>';
                        articleHtml += '<p id="limited-text">' + extractFirst73Chars(article.ContentText) + '</p>';
                        articleHtml += '<div class="gtw-sx">';
                        articleHtml += '<i class="fa fa-user">' + article.Author + '</i>';
                        articleHtml += '<i class="fa fa-clock-o">' + formatDate(article.PublishTime) + '</i>';
                        articleHtml += '<i class="fa fa-eye"> 阅读量' + article.ReadCount + '</i>';
                        articleHtml += '<a href="index1.html"><i class="fa fa-folder-open">' + article.Category + '</i></a>';
                        articleHtml += '</div>';
                        articleHtml += '</div>';
                        articleHtml += '</div>';

                        $('#article-container').append(articleHtml);
                    });


                    generatePaginationByAdmin(totalRecords, pageNumber, pageSize);
                },
                error: function () {
                    alert("系统错误!");
                }

            });
            function formatDate(dateString) {
                var date = new Date(dateString);
                var formattedDate = date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2);
                return formattedDate;
            }
        }
        function generatePaginationByAdmin(totalRecords, currentPage, pageSize) {
            var totalPages = Math.ceil(totalRecords / pageSize);
            var pagination = $('#pagination');
            pagination.empty(); // 清空现有分页导航

            // 添加“首页”和“上一页”链接
            if (currentPage > 1) {
                pagination.append($('<a href="#" class="page-link">首页</a>').click(function (event) {
                    event.preventDefault();
                    loadArticles(1, pageSize);
                }));
                pagination.append($('<a href="#" class="page-link">上一页</a>').click(function (event) {
                    event.preventDefault();
                    loadArticles(currentPage - 1, pageSize);
                }));
            }

            // 动态显示页面编号
            var startPage = Math.max(1, currentPage - 2);
            var endPage = Math.min(totalPages, startPage + 3);

            if (endPage - startPage < 3) {
                startPage = Math.max(1, endPage - 3);
            }

            for (var i = startPage; i <= endPage; i++) {
                var pageItem = $('<a href="#" class="page-link"></a>').text(i);
                if (i === currentPage) {
                    pageItem.addClass('active'); // 当前页高亮显示
                }
                pageItem.click(function (event) {
                    event.preventDefault();
                    var pageNumber = parseInt($(this).text());
                    loadArticles(pageNumber, pageSize);
                });
                pagination.append(pageItem);
            }

            // 添加“下一页”和“末页”链接
            if (currentPage < totalPages) {
                pagination.append($('<a href="#" class="page-link">下一页</a>').click(function (event) {
                    event.preventDefault();
                    loadArticles(currentPage + 1, pageSize);
                }));
                pagination.append($('<a href="#" class="page-link">末页</a>').click(function (event) {
                    event.preventDefault();
                    loadArticles(totalPages, pageSize);
                }));
            }

            // 添加输入框和跳转按钮
            var jumpToInput = $('<input type="number" style = "width:48px; height:30px; text-align:center; margin:0 3px; border:1px solid #ddd"  min="1" max="' + totalPages + '" value="' + currentPage + '" class=""  >');
            var jumpToButton = $('<button class="page-link"  style = "height:30px; border:1px solid #ddd; font-size: 14px;padding: 4px 10px" >跳转</button>');

            jumpToButton.click(function (event) {
                event.preventDefault();
                var pageNumber = parseInt(jumpToInput.val());
                if (pageNumber >= 1 && pageNumber <= totalPages) {
                    loadArticles(pageNumber, pageSize);
                } else {
                    alert("请输入有效的页码");
                }
            });

            // 添加总页数显示
            var totalPageDisplay = $('<a class="total-pages">共 ' + totalPages + ' 页</a>');

            pagination.append(jumpToInput).append(jumpToButton).append(totalPageDisplay);
        }
        
        // 初始化文章列表
        loadArticles(pageNumber);
    });


})


// 退出登录功能 start
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
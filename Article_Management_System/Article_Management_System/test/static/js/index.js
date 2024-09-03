$(function () {

    // 用户登录状态检测 start

    $.ajax({
        type: "POST",
        url: "/Login.aspx/LoginStatus",
        contentType: "application/json;charset = utf-8",
        dataType: "json",
        data: {},
        success: function (data) {
            var jsonData = JSON.parse(data.d);
            var Username = jsonData.Username;
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



    // 用户登录状态检测 end


    // 动态生成文章分类列表 start

    $.ajax({
        type: "POST",
        url: "/Search_Article.aspx/Article_Classification_Query",
        contentType: "application/json;charset=utf-8", // 注意移除空格  
        dataType: "json",
        data: {},
        success: function (data) {
            var Data = data.d;
            const categoryListWithDuplicates = Data;

            // 使用Set来剔除重复项    

            // 获取要插入<li>的<ul>元素    
            const ulElement = document.getElementById('article-list');

            // 确保ulElement存在    
            if (ulElement) {

                categoryListWithDuplicates.forEach(category => {
                    // 创建一个新的<li>元素    
                    const liElement = document.createElement('li');

                    // 创建一个<a>元素并设置href和文本内容（如果需要链接，可以添加具体的URL）    
                    const aElement = document.createElement('a'); 
                    const page = "category";
                    aElement.href = 'Article_list.html?keyword=' + encodeURIComponent(category) + "&page=" + encodeURIComponent(page); // 编码分类名以确保特殊字符被正确处理  


                    aElement.textContent = category;  

                    // 创建一个<img>元素（如果需要的话）  
                    const imgElement = document.createElement('img');   
                    imgElement.src = 'static/image/arrow.gif'; // 图片源地址    
    

                    // 将<img>添加到<a>中  
                    aElement.appendChild(imgElement);  

                    // 将<a>添加到<li>中    
                    liElement.appendChild(aElement);

                    // 将<li>添加到<ul>中    
                    ulElement.appendChild(liElement);
                });
            } else {
                console.error('无法找到ID为article-list的<ul>元素');
            }
        },
        error: function () {
            alert("服务器错误!");
        }
    });

    // 动态生成文章分类列表 end




    // 动态生成文章时间分类列表 start

    $.ajax({
        type: "POST",
        url: "/Search_Article.aspx/Article_Classification_By_time",
        contentType: "application/json;charset=utf-8", 
        dataType: "json",
        data: {},
        success: function (data) {
            var dateCounts = data.d;
            var ulElement = document.getElementById("Time_list");
            var count = 0;
            // 遍历数据对象  
            for (var dateString in dateCounts) {
                if (dateCounts.hasOwnProperty(dateString)) {
                    if (count >= 9) {
                        break;

                    }
                    // 创建一个<li>元素  
                    const liElement = document.createElement('li');

                    // 创建一个<a>元素并设置href和文本内容  
                    const aElement = document.createElement('a');
                    const category = dateString; // 
                    const page = "date"; // 
                    aElement.href = 'Article_list.html?keyword=' + encodeURIComponent(category) + "&page=" + encodeURIComponent(page); 

                    aElement.textContent = category + "(" + dateCounts[dateString] + ")"; 


                    // 将<a>添加到<li>中  
                    liElement.appendChild(aElement);

                    // 将<li>添加到<ul>中  
                    ulElement.appendChild(liElement);
                    count++;
                }
            }

        }
  
    });

    // 动态生成文章时间分类列表 end

    // 首页最新文章展示 start
    $.ajax({
        type: "POST",
        url: "/Search_Article.aspx/Search_Latest_Articles",
        contentType: "application/json;charset=utf-8", // 注意移除空格  
        dataType: "json",
        data: {},
        success: function (data) {
            var articles = JSON.parse(data.d);
            $.each(articles, function (index, article) {
                var articleHtml = '<div class="gtw-ul gclear">';
                // 图片预留
                var ImageUrl = article.CoverPhotoUrl;
                articleHtml += '<div class="gtw-img">';
                articleHtml += `<a href="Article.html?id=${article.ArticleId}"><img src="${ImageUrl}" alt="${article.Title}"></a>`;
                articleHtml += '</div>';
                articleHtml += '<div class="gtw-body">';
                articleHtml += `<a href="Article.html?id=${article.ArticleId}">`;
                articleHtml += '<h4>' + article.Title + '</h4>';
                articleHtml += '</a>';
                articleHtml += '<p id = "limited-text">' + extractFirst73Chars(article.ContentText) + '</p>';
                articleHtml += '<div class="gtw-sx">';
                articleHtml += '<i class="fa fa-user">' + article.Author + '</i>';
                articleHtml += '<i class="fa fa-clock-o">' + formatDate(article.PublishTime) + '</i>'; // 格式化日期  
                articleHtml += '<i class="fa fa-eye"> 阅读量' + article.ReadCount +'</i>'; // 假设阅读量是一个占位符，需要后端提供或前端计算  
                var url = 'Article_list.html?keyword=' + encodeURIComponent(article.Category) + "&page=category" // 对关键字进行编码  
                articleHtml += '<a href='+url+'><i class="fa fa-folder-open">' + article.Category + '</i></a>'; // 分类也是一个占位符，需要替换为实际分类  
                articleHtml += '</div>';
                articleHtml += '</div>';
                articleHtml += '</div>';

                // 将构建好的HTML添加到容器中  
                $('#article-container1').append(articleHtml);
            });

            // 辅助函数：格式化日期  
            function formatDate(dateString) {
                var date = new Date(dateString);
                var formattedDate = date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2);
                return formattedDate;
            }


        }

    })
    // 首页最新文章展示 end

    // 右侧浏览数最高展示 start

    $.ajax({
        type: "POST",
        url: "/Search_Article.aspx/Search_Maximum_views",
        contentType: "application/json;charset=utf-8", // 注意移除空格  
        dataType: "json",
        data: {},
        success: function (data) {
            var articles = JSON.parse(data.d);
            $.each(articles, function (index, article) {
                var articleHtml = '<div class="gj-body gli-tuw1">';
                articleHtml += '<div class="gtw-li gclear">';
                articleHtml += '<div class="gtw-img gj-left">';
                articleHtml += `<a href="Article.html?id=${article.ArticleId}"><img src="${article.CoverPhotoUrl}" alt=""></a>`;
                articleHtml += '</div>';
                articleHtml += '<div class="gtw-body">';
                //articleHtml += `<a  href="Article.html?id=${article.ArticleId}">`;
                articleHtml += `<a  href="Article.html?id=${article.ArticleId}" style="display: block;">`;

                articleHtml += '<h4>' + article.Title + '</h4>';
                articleHtml += '</a>';
                articleHtml += '<span><i class="fa fa-clock-o">' + formatDate(article.PublishTime) + '</i></span>';
                articleHtml += '<span><i class="fa fa-eye">浏览量' + article.ReadCount + '</i></span>';
                articleHtml += '</div>';
                articleHtml += '</div>';
                articleHtml += '</div>';

                // 将构建好的HTML添加到容器中  
                $('#right_con').append(articleHtml);
            });
            function formatDate(dateString) {
                var date = new Date(dateString);
                var formattedDate = date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2);
                return formattedDate;
            }

        }


    })

    // 右侧浏览数最高展示 end



});



// 搜索功能实现 start
document.getElementById('searchbtn').addEventListener('click', function (event) {
    event.preventDefault(); 

    var minLength = 2;
    var currentLength = document.getElementById('searchInput').value.length;

    if (currentLength < minLength) {
        event.preventDefault(); 
        $("#searchInput").val("最少输入2字符！");
        $("#searchInput").css("color", "red");
        $("#searchInput").on("focus", function () {
            $(this).val("").css("color", "black");
        });

    } else {
        var keyword = document.getElementById('searchInput').value;
        var page = "search";
        var url = 'Article_list.html?keyword=' + encodeURIComponent(keyword) + "&page=" + encodeURIComponent(page); // 对关键字进行编码  
        window.location.href = url; // 导航到搜索结果页面  
    }
});


    // 搜索功能实现 end



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



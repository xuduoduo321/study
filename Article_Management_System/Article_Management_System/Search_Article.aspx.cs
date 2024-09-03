using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using static Article_Management_System.Login;
using Newtonsoft.Json;
using System.Web.Script.Serialization;
using System.Drawing.Printing;
using System.Data.Entity;
using Article_Management_System.Dataclass;
using static Article_Management_System.Search_Article;


namespace Article_Management_System
{
    public partial class Search_Article : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        // 文章分类列表查询 start

        public class Article
        {
            
            
            public int ArticleId { get; set; }
            public int UserId { get; set; }
            public string Category { get; set; }
            public string Author { get; set; }
            public string Title { get; set; }
            public string ContentText { get; set; }
            public string ContentMarkdownText { get; set; }
            public DateTime PublishTime { get; set; }

            public int ReadCount { get; set; }

            public string FilePaths { get; set; }
            public string CoverPhotoUrl { get; set; }







        }


        // 文章分类列表查询 start

        [WebMethod]
        public static List<string> Article_Classification_Query() {
            using (var context = new Article_Management_SystemEntities()) {
                var distinctCategories = context.Articles.Select(a => a.Category).Distinct().ToList();
                return distinctCategories;
            }



        }

        // 文章分类列表查询 end

        // 文章列表按时间查询 start

        [WebMethod]
        public static Dictionary<string, int> Article_Classification_By_time()
        {
            using (var context = new Article_Management_SystemEntities())
            {
                // 按日期分组并计数  
                var articlesWithDates = context.Articles
                            .Select(a => new { a.PublishTime })
                            .OrderByDescending(a => a.PublishTime)
                            .ToList(); // 这一步会将数据加载到内存中  

                // 在内存中按日期分组并计数  
                var groupedByDate = articlesWithDates
                    .GroupBy(a => a.PublishTime.Date.ToString("yyyy年MM月dd日")) // 在内存中格式化日期  
                    .ToDictionary(entry => entry.Key, entry => entry.Count());

                return groupedByDate;   // 转换为字典  

            }
        }

        // 文章列表按时间查询 end


        // 增加阅读量start
        [WebMethod]
        public static void AddReadCount(int? Userid, int Artcid) {
            using (var context = new Article_Management_SystemEntities()) {
                var article = context.Articles.Find(Artcid);
                if (Userid != -1 && article.UserId != Userid)
                {
                    article.ReadCount++;
                    context.SaveChanges();
                }


            }


        }


        // 增加阅读量end



        // 按用户id查找所有文章信息 start
        [WebMethod]

        public static string Search_Articles_By_UserId(string keyword, int  pageNumber, int pageSize)
        {
            int keyword_int = int.Parse(keyword);
            using (var context = new Article_Management_SystemEntities())
            {

                    var articlesQuery = context.Articles
                                               .Where(a => a.UserId.Equals(keyword_int))
                                               .OrderByDescending(a => a.PublishTime);

                    var totalRecords = articlesQuery.Count();

                    // 计算需要跳过的记录数来实现分页

                    var articles = articlesQuery
                                   .Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .Select(a => new Article
                                   {
                                       ArticleId = a.ArticleId,
                                       Author = a.Author,
                                       UserId = a.UserId,
                                       Title = a.Title,
                                       ContentText = a.ContentText,
                                       ContentMarkdownText = a.ContentMarkdownText,
                                       PublishTime = a.PublishTime,
                                       Category = a.Category,
                                       ReadCount = a.ReadCount,
                                       CoverPhotoUrl = a.CoverPhotoUrl
                                   })
                                   .ToList();

                        if (articles.Any())
                        {
                            var result = new
                            {
                                TotalRecords = totalRecords,
                                Articles = articles
                            };

                            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
                        }
                        else
                        {
                            return "false";
                        }


            }

            
        }
        
        // 按用户id查找所有文章信息 end

        // 按文章id查看文章详情 start
        [WebMethod]
        public static string Search_Articles_By_ArticleID(string keyword)
        {
            int keyword_int = int.Parse(keyword);
            using (var context = new Article_Management_SystemEntities())
            {
                var articles = context.Articles
                                      .Where(a => a.ArticleId.Equals(keyword_int))
                                      .Select(a => new Article
                                      {
                                          ArticleId = a.ArticleId,
                                          Author = a.Author,
                                          UserId = a.UserId,
                                          Title = a.Title,
                                          ContentText = a.ContentText,
                                          PublishTime = a.PublishTime,
                                          Category = a.Category,
                                          ContentMarkdownText = a.ContentMarkdownText,
                                          ReadCount = a.ReadCount,
                                          FilePaths = a.FilePaths,
                                          CoverPhotoUrl =a.CoverPhotoUrl
                                      }).ToList();
                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(articles);
                return jsonString;
            }

        }

        // 按文章id查看文章详情 end


        // 查询最新文章 start
        [WebMethod]
        public static string Search_Latest_Articles() {
            using (var context = new Article_Management_SystemEntities()) 
            {
                var articles = context.Articles
                                      .OrderByDescending(a => a.PublishTime)
                                      .Take(3)
                                      .Select(a => new Article
                                      {
                                          ArticleId = a.ArticleId,
                                          Author = a.Author,
                                          Title = a.Title,
                                          ContentText = a.ContentText,
                                          PublishTime = a.PublishTime,
                                          Category = a.Category,
                                          ContentMarkdownText = a.ContentMarkdownText,
                                          ReadCount = a.ReadCount,
                                          CoverPhotoUrl = a.CoverPhotoUrl
                                      })
                                      .ToList();
                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(articles);
                return jsonString;
            }
        }
        // 查询最新文章 end


        // 查询高浏览量文章 start
        [WebMethod]
        public static string Search_Maximum_views() {
            using (var context = new Article_Management_SystemEntities())
            {
                var articles = context.Articles
                                      .OrderByDescending(a => a.ReadCount)
                                      .Take(7)
                                      .Select(a => new Article
                                      {
                                          ArticleId = a.ArticleId,
                                          Author = a.Author,
                                          Title = a.Title,
                                          ContentText = a.ContentText,
                                          PublishTime = a.PublishTime,
                                          Category = a.Category,
                                          ContentMarkdownText = a.ContentMarkdownText,
                                          ReadCount = a.ReadCount,
                                          CoverPhotoUrl =a.CoverPhotoUrl
                                      })
                                      .ToList();
                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(articles);
                return jsonString;
            }

        }
        // 查询高浏览量文章 end


        // 查询所有文章 start
        [WebMethod]
        public static string Search_All_Articles(int pageNumber, int pageSize)
        {
            using (var context = new Article_Management_SystemEntities())
            {
                  var articlesQuery = context.Articles
                                          .OrderByDescending(a => a.PublishTime);

                var totalRecords = articlesQuery.Count();

                var articles = articlesQuery
                               .Skip((pageNumber - 1) * pageSize)
                               .Take(pageSize)
                               .Select(a => new Article
                               {
                                   ArticleId = a.ArticleId,
                                   Author = a.Author,
                                   Title = a.Title,
                                   ContentText = a.ContentText,
                                   ContentMarkdownText = a.ContentMarkdownText,
                                   PublishTime = a.PublishTime,
                                   Category = a.Category,
                                   ReadCount = a.ReadCount,
                                   CoverPhotoUrl = a.CoverPhotoUrl
                               })
                               .ToList();

                if (articles.Any())
                {
                    var result = new
                    {
                        TotalRecords = totalRecords,
                        Articles = articles
                    };

                    return Newtonsoft.Json.JsonConvert.SerializeObject(result);
                }
                else
                {
                    return "false";
                }
            }
        }


        // 查询所有文章 end


        // 初始化文章列表 start
        [WebMethod] public static string Initialize_ArticleList(string Page, string keyword, int pageNumber, int pageSize) {
            using (var context = new Article_Management_SystemEntities()) {

                // 按搜索结果初始化文章列表
                if (Page == "search")
                {


                    var articlesQuery = context.Articles
                                          .Where(a => a.Author.Contains(keyword) ||
                                                      a.Title.Contains(keyword) ||
                                                      a.ContentText.Contains(keyword))
                                          .OrderByDescending(a => a.PublishTime);

                    var totalRecords = articlesQuery.Count();

                    var articles = articlesQuery
                                   .Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .Select(a => new Article
                                   {
                                       ArticleId = a.ArticleId,
                                       Author = a.Author,
                                       Title = a.Title,
                                       ContentText = a.ContentText,
                                       ContentMarkdownText = a.ContentMarkdownText,
                                       PublishTime = a.PublishTime,
                                       Category = a.Category,
                                       ReadCount = a.ReadCount,
                                       CoverPhotoUrl = a.CoverPhotoUrl
                                   })
                                   .ToList();
    
                    if (articles.Any())
                    {
                        var result = new
                        {
                            TotalRecords = totalRecords,
                            Articles = articles
                        };

                        return Newtonsoft.Json.JsonConvert.SerializeObject(result);
                    }
                    else
                    {
                        return "false";
                    }

                }
                // 按类别初始化文章列表
                else if (Page == "category")
                {

                    var articlesQuery = context.Articles
                               .Where(a => a.Category == keyword);

                    var totalRecords = articlesQuery.Count();

                    var articles = articlesQuery
                                   .OrderByDescending(a => a.PublishTime)
                                   .Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .Select(a => new
                                   {
                                       a.ArticleId,
                                       a.Author,
                                       a.Title,
                                       a.Category,
                                       a.ContentMarkdownText,
                                       a.ContentText,
                                       a.PublishTime,
                                       a.ReadCount,
                                       a.CoverPhotoUrl
                                   })
                                   .ToList();

                    var result = new
                    {
                        TotalRecords = totalRecords,
                        Articles = articles
                    };

                    return Newtonsoft.Json.JsonConvert.SerializeObject(result);


                }
                // 按日期初始化文章列表
                else if (Page == "date") {

                    DateTime searchDate;
                    if (DateTime.TryParseExact(keyword, "yyyy年MM月dd日", System.Globalization.CultureInfo.CurrentCulture, System.Globalization.DateTimeStyles.None, out searchDate))
                    {

                        
                            // 使用 DbFunctions.TruncateTime 来只比较日期部分（Entity Framework 6及以上）
                            var articlesQuery = context.Articles
                                                      .Where(a => DbFunctions.TruncateTime(a.PublishTime) == DbFunctions.TruncateTime(searchDate));

                            var totalRecords = articlesQuery.Count();

                            var articles = articlesQuery
                                           .OrderByDescending(a => a.PublishTime)
                                           .Skip((pageNumber - 1) * pageSize)
                                           .Take(pageSize)
                                           .Select(a => new Article
                                           {
                                               ArticleId = a.ArticleId,
                                               Author = a.Author,
                                               Title = a.Title,
                                               Category = a.Category,
                                               ContentMarkdownText = a.ContentMarkdownText,
                                               ContentText = a.ContentText,
                                               PublishTime = a.PublishTime,
                                               ReadCount = a.ReadCount,
                                               CoverPhotoUrl = a.CoverPhotoUrl
                                           })
                                           .ToList();

                            var result = new
                            {
                                TotalRecords = totalRecords,
                                Articles = articles
                            };

                            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
                        }
                    }
                    else
                    {
                        // 如果日期解析失败，可以返回错误消息或空结果
                        return "Invalid date format.";
                    }

                
                
               
            
            }

            return "服务器错误!";


        
        }

        // 初始化文章列表 end


    }

}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using Article_Management_System.Dataclass;
using System.Data.SqlClient;


namespace Article_Management_System
{
    public partial class Edit_Article : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        // 发布文章 start
        [WebMethod]
        public static string Publish_articles(int Userid, string Author, string Title, string ContentMarkdownText, string ContentText, string PublishTime, string Category, List<string> Files, string OverImg)
        {

            using (var context = new Article_Management_SystemEntities())
            {
                string filePaths = string.Join(",", Files); // 将 List<string> 转换为逗号分隔的字符串
                string sql = "INSERT INTO dbo.Articles(UserId, Author, Title, ContentMarkdownText, ContentText, PublishTime, Category, FilePaths, CoverPhotoUrl) VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8)";

                var parameterUserId = new SqlParameter("@p0", Userid);
                var parameterAuthor = new SqlParameter("@p1", Author);
                var parameterTitle = new SqlParameter("@p2", Title);
                var parameterContentMarkdownText = new SqlParameter("@p3", ContentMarkdownText);
                var parameterContentText = new SqlParameter("@p4", ContentText); // 如果ContentText可以为null，使用(object)DBNull.Value  
                var parameterPublishTime = new SqlParameter("@p5", PublishTime);
                var parameterCategory = new SqlParameter("@p6", Category);
                var parameterFiles = new SqlParameter("@p7", filePaths);
                var parameterCoverPhotoUrl = new SqlParameter("@p8", OverImg);

                try
                {
                    int result = context.Database.ExecuteSqlCommand(sql, parameterUserId, parameterAuthor, parameterTitle, parameterContentMarkdownText, parameterContentText, parameterPublishTime, parameterCategory, parameterFiles, parameterCoverPhotoUrl);

                    if (result == 1)
                    {
                        // 插入成功，返回成功信息  
                        // 注意：您可能想返回一个更具体的成功消息或对象的ID，如果需要的话  
                        return "true";
                    }
                    else
                    {
                        // 插入失败，返回错误信息  
                        throw new Exception("Failed to insert article.");
                    }
                }
                catch (Exception ex)
                {
                    // 捕获异常并返回错误信息  
                    throw new Exception("Error inserting article: " + ex.Message, ex);
                }
            }


        }

        // 发布文章 eng

        // 修改文章 start
        [WebMethod]
        public static string Reverse_articles(int ArticleId, string Title, string ContentMarkdownText, string ContentText, string  PublishTime, string Category, List<string> Files, string OverImg)
        {
            using (var context = new Article_Management_SystemEntities())
            {
                string filePaths = string.Join(",", Files); // 将 List<string> 转换为逗号分隔的字符串
                string sql = "UPDATE dbo.Articles SET Title = @p0, ContentMarkdownText = @p1, ContentText = @p2, PublishTime = @p3, Category = @p4,FilePaths = @p5, CoverPhotoUrl = @p6 WHERE ArticleId = @p7";

                var parameterTitle = new SqlParameter("@p0", Title);
                var parameterContentMarkdownText = new SqlParameter("@p1", ContentMarkdownText);
                var parameterContentText = new SqlParameter("@p2", ContentText);
                var parameterPublishTime = new SqlParameter("@p3", PublishTime);
                var parameterCategory = new SqlParameter("@p4", Category);
                var parameterFiles = new SqlParameter("@p5", filePaths);
                var parameterCoverPhotoUrl = new SqlParameter("@p6", OverImg);
                var parameterArticleId = new SqlParameter("@p7", ArticleId);





                try
                {
                    int result = context.Database.ExecuteSqlCommand(sql, parameterTitle, parameterContentMarkdownText, parameterContentText, parameterPublishTime, parameterCategory, parameterFiles, parameterCoverPhotoUrl, parameterArticleId);

                    if (result == 1)
                    {
                        // 更新成功，返回成功信息  
                        return "true";
                    }
                    else
                    {
                        // 更新失败，返回错误信息  
                        throw new Exception("Failed to update article.");
                    }
                }
                catch (Exception ex)
                {
                    // 捕获异常并返回错误信息  
                    throw new Exception("Error updating article: " + ex.Message, ex);
                }
            }
        }

        // 修改文章 end


        // 删除文章 start
        [WebMethod]
        public static string Delete_Article(int ArticleId) {
            using (var context = new Article_Management_SystemEntities()) {
                try
                {
                    var article = context.Articles.SingleOrDefault(a => a.ArticleId == ArticleId);
                    if (article != null)
                    {
                        // 如果找到文章，则删除
                        context.Articles.Remove(article);
                        context.SaveChanges();
                        return "ture";
                    }
                    else
                    {
                        return "未找到指定的文章。";
                    }
                }
                catch (Exception ex)
                {

                    return "删除失败，请重试！错误信息: " + ex.Message;
                }

            }


        }
        // 删除文章 end




    }
}

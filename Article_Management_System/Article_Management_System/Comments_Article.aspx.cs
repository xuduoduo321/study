using Article_Management_System.Dataclass;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using static Article_Management_System.Search_Article;
using System.ComponentModel.Design;
using static Article_Management_System.Comments_Article;

namespace Article_Management_System
{
    public partial class Comments_Article : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        // 构建UserComment
        public class UserComments {
        public int CommentId { get; set; }
        public int? ParentId { get; set; }
        public int ArticleId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string CommentText { get; set; }
        public DateTime CommentTime { get; set; }



        }

        // 构建newReply

        public class NewReply { 
        public int ArticleId { get; set; }
        public int? ParentId { get; set; }
        public string CommentText { get; set; }
        public DateTime CommentTime { get; set; }


        }


        // 添加评论 start
        [WebMethod]
        public static string Addcomment(int articleId,int userId, string commmentcontent, string username, string commentTime) {
            using (var context = new Article_Management_SystemEntities())
            {
                string sql = "INSERT INTO dbo.Comments(ArticleId, UserId, UserName, CommentText, CommentTime) VALUES (@p0, @p1, @p2, @p3, @p4)";
                var parameterArticleId = new SqlParameter("@p0", articleId);
                var parameteruserId = new SqlParameter("@p1", userId);
                var parameterCommmentcontent = new SqlParameter("@p2", username);
                var parameterUsername = new SqlParameter("@p3", commmentcontent); 
                var parameterCommentTime = new SqlParameter("@p4", commentTime);
                try
                {
                    int result = context.Database.ExecuteSqlCommand(sql, parameterArticleId, parameteruserId, parameterCommmentcontent, parameterUsername, parameterCommentTime);

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
        // 添加评论 end


        // 读取评论 start
        [WebMethod]
        public static string Readcomment(int articleId)
        {
            using (var context = new Article_Management_SystemEntities())
            {
                // 查询评论列表，并按照时间倒序排列
                var comments = context.Comments
                                      .Where(a => a.ArticleId == articleId)
                                      .OrderByDescending(a => a.CommentTime)
                                      .Select(a => new UserComments
                                      {
                                          CommentId = a.CommentId,
                                          UserName = a.UserName, // 评论用户名
                                          ArticleId = a.ArticleId, // 文章ID
                                          CommentTime = a.CommentTime, // 评论时间
                                          CommentText = a.CommentText, // 评论内容
                                      })
                                      .ToList();

                var jsonString = Newtonsoft.Json.JsonConvert.SerializeObject(comments); // 序列化评论列表为 JSON 字符串
                return jsonString; // 返回 JSON 字符串给前端
            }
        }





        // 读取评论 end


        // 删除评论 start
        [WebMethod]
        public static string Del_Comment(int CommId ) {
            using (var context = new Article_Management_SystemEntities()) {
                try {
                    var comment = context.Comments.SingleOrDefault(a => a.CommentId == CommId);
                    if (comment != null)
                    {
                        context.Comments.Remove(comment);
                        context.SaveChanges();
                        return "ture";

                    }
                    else {
                        return "未找到指定评论";
                    }


                }
                catch (Exception ex)
                {

                    return "删除失败，请重试！错误信息: " + ex.Message;


                }

            }
               
        }
        // 删除评论 end

    }
}
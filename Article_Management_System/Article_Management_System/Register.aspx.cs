using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using System.Drawing.Printing;
using Article_Management_System.Helpers;
using Article_Management_System.Dataclass;
using System.Data.SqlClient;




namespace Article_Management_System
{
    public partial class Register : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }



        // 用户注册 start
        [WebMethod]
        public static string UserAdd(string Usertel, string Username, string Password) {

            using (var context = new Article_Management_SystemEntities())
            {
                // 构建LINQ查询（或ESQL，但LINQ更常见且易于使用）  

                    string passwordHash = EncryptionHelper.HashPasswordWithSha256(Password);
                    string sql = "INSERT INTO dbo.Users(PhoneNumber, Username, PasswordHash) VALUES (@p0, @p1, @p2)";
                    var parameterTel = new SqlParameter("@p0", Usertel);
                    var parameterName = new SqlParameter("@p1", Username);
                    var parameterPass = new SqlParameter("@p2", passwordHash);
                    try
                    {
                        int result = context.Database.ExecuteSqlCommand(sql, parameterTel, parameterName, parameterPass);
                        if (result == 1)
                        {
                        return "ture";
                        }
                        else
                        {
                            return "没有用户被注册。请检查您的输入！";
                        }

                    }
                    catch (Exception ex)
                    {

                        return "An unexpected error occurred: " + ex.Message;

                    }



            }


        }


        // 用户注册 end





    }







}
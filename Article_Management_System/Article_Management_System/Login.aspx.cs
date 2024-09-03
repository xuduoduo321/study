using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Drawing.Printing;
using Article_Management_System.Helpers;
using Article_Management_System.Dataclass;
using static Article_Management_System.Login;



namespace Article_Management_System
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {



        }

        // 登录成功后返回信息
        public class LoginResult
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            // 可以在这里添加其他需要的属性，比如UserId或Token等  
        }


        //检查用户登录返回信息
        public class UserDto
        {
            public int Id { get; set; }
            public string Username { get; set; }
            // ... 其他属性 ...  
        }
        [WebMethod]

        public static LoginResult UserLogin(string Usertel, string Password)
        {
            using (var context = new Article_Management_SystemEntities())
            {
                string passwordHash = EncryptionHelper.HashPasswordWithSha256(Password);
                var user = context.Users.SingleOrDefault(u => u.PhoneNumber == Usertel && u.PasswordHash == passwordHash);
                if (user != null)
                {
                    // 用户存在，登录成功    
                    HttpContext.Current.Session["User"] = HttpContext.Current.Session["User"] = new UserDto { Id = user.Id, Username = user.Username /* ... 其他属性 */ };
                    return new LoginResult { Success = true, Message = "登录成功!" };
                }
                else
                {
                    return new LoginResult { Success = false, Message = "用户名或密码错误!" };
                }
            }


        }


        // 退出登录
        [WebMethod]
        public static void Logout()
        {
            HttpContext.Current.Session["User"] = null;
        }



        // 检查用户登录状态 start
        [WebMethod]
        public static string LoginStatus()
        {
            if (HttpContext.Current.Session["User"] != null)
            {
                var userDTO = HttpContext.Current.Session["User"] as UserDto;

                if (userDTO != null) {
                
                    return Newtonsoft.Json.JsonConvert.SerializeObject(userDTO);

                }


            }
            return "false";
           
        }

        // 检查用户登录状态 end

    }
}

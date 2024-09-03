using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
namespace Article_Management_System.Dataclass
{
    public class User
    {
        // Users表有一个主键列Id  


        public int Id { get; set; }

        // 电话号码  
        public string PhoneNumber { get; set; }

        // 用户名  
        public string Username { get; set; }

        // 密码哈希  
        public string PasswordHash { get; set; }

        // 角色  
        public string Role { get; set; }
    }
}
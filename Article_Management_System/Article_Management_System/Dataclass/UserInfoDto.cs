using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Article_Management_System.Dataclass
{
    public class UserInfoDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string UserRole { get; set; }

    }
}
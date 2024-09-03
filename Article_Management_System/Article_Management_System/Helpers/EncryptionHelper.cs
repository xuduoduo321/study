using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;


namespace Article_Management_System.Helpers
{
    public static class EncryptionHelper
    {
        public static string HashPasswordWithSha256(string password)
        {

            using (SHA256 sha256Hash = SHA256.Create())
            {
                // 计算给定字符串的哈希值  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));

                // 将字节转换为字符串并返回  
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
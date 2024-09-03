using System;
using System.IO;
using System.Web;

namespace Article_Management_System
{
    public class UploadImage : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            // 设置响应的内容类型为 JSON
            context.Response.ContentType = "application/json";

            try
            {
                // 获取上传的文件
                HttpPostedFile file = context.Request.Files["editormd-image-file"];

                // 检查文件是否为空
                if (file != null && file.ContentLength > 0)
                {
                    // 获取项目的根目录
                    string rootPath = context.Server.MapPath("~");

                    // 设置保存图片的目标路径
                    string uploadFolderPath = Path.Combine(rootPath, "uploads");

                    // 如果目标路径不存在，则创建它
                    if (!Directory.Exists(uploadFolderPath))
                    {
                        Directory.CreateDirectory(uploadFolderPath);
                    }

                    // 生成一个唯一的文件名
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

                    // 拼接完整的文件路径
                    string filePath = Path.Combine(uploadFolderPath, fileName);

                    // 保存文件到指定路径
                    file.SaveAs(filePath);

                    // 返回图片的 URL 地址
                    string imageUrl = "/uploads/" + fileName;
                    context.Response.Write("{\"success\":1, \"message\":\"上传成功\", \"url\":\"" + imageUrl + "\"}");
                }
                else
                {
                    context.Response.Write("{\"success\":0, \"message\":\"上传失败：未找到文件\"}");
                }
            }
            catch (Exception ex)
            {
                // 转义异常消息
                string errorMessage = HttpUtility.JavaScriptStringEncode(ex.Message);

                context.Response.Write("{\"success\":0, \"message\":\"上传失败：" + errorMessage + "\"}");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}

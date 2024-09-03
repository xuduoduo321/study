using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;

namespace Article_Management_System
{
    public class UploadAttachment : IHttpHandler
    {
        // 修改服务器端 C# 部分
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "application/json";

            try
            {
                // 获取上传的文件集合
                HttpFileCollection files = context.Request.Files;

                // 检查是否有文件上传
                if (files.Count > 0)
                {
                    // 获取项目的根目录
                    string rootPath = context.Server.MapPath("~");

                    // 设置保存附件的目标路径
                    string uploadFolderPath = Path.Combine(rootPath, "attachments");

                    // 如果目标路径不存在，则创建它
                    if (!Directory.Exists(uploadFolderPath))
                    {
                        Directory.CreateDirectory(uploadFolderPath);
                    }

                    List<string> fileUrls = new List<string>();

                    // 遍历上传的每个文件
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFile file = files[i];
                        if (file != null && file.ContentLength > 0)
                        {
                            string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                            string fileExtension = Path.GetExtension(file.FileName);
                            string uniqueFileName = fileName + fileExtension;
                            string filePath = Path.Combine(uploadFolderPath, uniqueFileName);

                            int count = 1;
                            while (File.Exists(filePath))
                            {
                                uniqueFileName = $"{fileName}_{count}{fileExtension}";
                                filePath = Path.Combine(uploadFolderPath, uniqueFileName);
                                count++;
                            }

                            // 保存文件到指定路径
                            file.SaveAs(filePath);

                            // 返回附件的 URL 地址
                            string fileUrl = "/attachments/" + uniqueFileName;
                            fileUrls.Add(fileUrl);
                        }
                    }

                    // 返回所有附件的 URL 地址列表
                    context.Response.Write("{\"success\":1, \"message\":\"上传成功\", \"urls\":" + new JavaScriptSerializer().Serialize(fileUrls) + "}");
                }
                else
                {
                    context.Response.Write("{\"success\":0, \"message\":\"上传失败：未找到文件\"}");
                }
            }
            catch (Exception ex)
            {
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

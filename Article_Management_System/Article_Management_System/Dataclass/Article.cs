using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Article_Management_System.Dataclass
{
    public class Article
    {
        public int ArticleId { get; set; } // 对应数据库中的主键字段  
        public int UserId { get; set; } // 对应数据库中的外键字段，指向Users表  
        public string Author { get; set; } // 作者名称，如果数据库中也有这个字段的话  
        public string Title { get; set; } // 文章标题  
        public string ContentMarkdownText { get; set; } // Markdown格式的内容  
        public string ContentText { get; set; } // 转换后的纯文本内容  
        public DateTime PublishTime { get; set; } // 发布时间，使用DateTime类型  
        public string Category { get; set; } // 文章类别  
    }
}
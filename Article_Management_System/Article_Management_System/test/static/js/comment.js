
// 地址跳转传参


function getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const params = {};

    urlParams.forEach((page, key) => {
        params[key] = page;
    });

    return params;
}
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


function formatDateTime(timestamp = Date.now()) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}`; // 仅到分钟  
    return dateTimeString;
}


// 提取文章图片地址
function extractImageUrlFromMessage(message) {
    const regex = /!\[.*\]\((.*?)\)/; // 匹配 ![图片alt](...) 格式的正则表达式
    const match = regex.exec(message);

    // 从匹配结果中提取图片地址
    if (match && match.length > 1) {
        return match[1];
    } else {
        // 如果匹配不到图片地址，返回 1-5.jpg 中的随机一个
        const randomIndex = Math.floor(Math.random() * 5) + 1; // 生成 1 到 5 的随机整数
        return `/uploads/${randomIndex}.jpg`;
    }
}


// 返回文章前73个字符串
function extractFirst73Chars(inputString) {
    // 将换行符替换为空字符串
    const stringWithoutNewlines = inputString.replace(/\n/g, '');
    // 使用正则表达式剔除特殊标点符号
    const cleanString = stringWithoutNewlines.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, '');
    // 截取前73个字符
    let result = cleanString.substring(0, 150);
    // 如果剩余字符超过73个，添加省略号
    if (cleanString.length > 150) {
        result += '...';
    }
    return result;
}

// 辅助函数：格式化日期  

function formatDate(dateString) {
    // 解析日期字符串  
    var date = new Date(dateString);

    // 验证日期是否有效  
    if (isNaN(date.getTime())) {
        throw new Error('无效的日期字符串');
    }

    // 格式化日期和时间  
    var formattedDate = date.getFullYear() + '年' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '月' +
        ('0' + date.getDate()).slice(-2) + '日' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2);
    return formattedDate;
}


// 提取文件名
function getFileName(filePath) {
    // 使用正则表达式匹配文件名部分
    var regex = /[^\\/]*$/;
    var match = regex.exec(filePath);

    if (match && match.length > 0) {
        return match[0];
    } else {
        return null; // 如果无法提取文件名，则返回null或其他适当的值
    }
}
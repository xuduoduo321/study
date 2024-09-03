// 注册页面动画 start
var signUpButton = document.getElementById('signUp')
var signInButton = document.getElementById('signIn')
var container = document.getElementById('dowebok')

signUpButton.addEventListener('click', function () {
    container.classList.add('right-panel-active')
})

signInButton.addEventListener('click', function () {
    container.classList.remove('right-panel-active')
})
// 注册页面动画 end

// 注册页面信息验证 start


// 手机号验证
function validateI_UserTel_Re(phoneNumber) {
    // 假设手机号码为11位数字，以1开头  
    var regex = /^1[3-9]\d{9}$/;
    var tel_ret = regex.test(phoneNumber);
    if (tel_ret) {
        // 如果手机号码匹配正则表达式，显示绿色信息  
        return true;
    } else {
        // 如果不匹配，显示红色信息  
        document.getElementById("test_phone").className = "validation-result error";
        document.getElementById("test_phone").textContent = "手机号码错误,请重新填写!";
        return false;
    }

}

// 用户名验证
function validateI_UserName_Re(username) {
    // 用户名验证规则：最短2个字符，可以包含字母（大小写均可）、数字、中文、下划线和连字符  
    var regex = /^[\u4e00-\u9fa5\w]{2,}$/; // \u4e00-\u9fa5 是中文字符范围，\w 是字母、数字和下划线  
    var username_ret = regex.test(username);

    if (username_ret) {
        // 如果用户名匹配正则表达式，显示绿色信息  
        return true;
    } else {
        // 如果不匹配，显示红色信息  
        document.getElementById("test_username").className = "validation-result error";
        document.getElementById("test_username").textContent = "用户名错误,请重新填写!";
        return false;
    }


}


// 用户密码验证

function validateI_UserPassword_Re(password) {
    // 假设密码至少8个字符，包含至少1个字母
    var regex = /^(?=.*[a-zA-Z]).{8,}$/;
    var pwd_ret = regex.test(password);

    if (pwd_ret) {
        // 如果密码匹配正则表达式，显示绿色信息  
        return true;
    } else {
        // 如果不匹配，显示红色信息  
        document.getElementById("test_password").className = "validation-result error";
        document.getElementById("test_password").textContent = "密码错误格式,请重新填写!";
        return false;
    }
}

function validateI_pas2_Re(password2) {
    var password1 = $("#Password").val();
    if (password1 === password2) {
        // 如果密码匹配，显示绿色信息  

        return true;

    } else {
        // 如果密码不匹配，显示红色信息  
        document.getElementById("test_password2").className = "validation-result error";
        document.getElementById("test_password2").textContent = "密码不一致,请重新填写!";
        // 返回false表示密码不匹配  
        return false;


    }

}
// 注册页面信息验证 end



$("#radioDiv input[type='radio']").click(function () {
    // 移除其他单选按钮的checked属性  
    $("#radioDiv input[type='radio']").not(this).prop("checked", false);

    // 当前点击的单选按钮已经是checked的，但为了代码的完整性，显式地设置它  
    $(this).prop("checked", true);

    // 用户注册start






    $("#addUser").click(function (event) {
        event.preventDefault();
        var tel = $("#UserTel").val();
        var name = $("#Username").val();
        var pasw1 = $("#Password").val();
        var pasw2 = $("#Password2").val();
        if (validateI_UserTel_Re(tel) && validateI_UserName_Re(name) && validateI_UserPassword_Re(pasw1) && validateI_pas2_Re(pasw2)) {
            var jsonDataObj = {
                Usertel: tel,
                Username: name,
                Password: pasw1,
            };
            var jsonDataStr = JSON.stringify(jsonDataObj);
            $.ajax({
                type: "POST",
                url: "/Register.aspx/UserAdd",
                contentType: "application/json;charset = utf-8",
                dataType: "json",
                data: jsonDataStr,
                success: function (data) {
                    if (data.d == "ture") {
                        alert("注册成功!");
                        location.reload();


                    } else {

                        alert("用户已被注册！");
                        location.reload();

                    }

                }, error: function () {

                    alert("系统错误！");
                }


            })

        } else {

            alert("注册信息错误,请重新填写!");
            return;

        }


    })

    // 用户注册end
    


});




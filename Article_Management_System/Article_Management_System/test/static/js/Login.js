var signUpButton = document.getElementById('signUp')
var signInButton = document.getElementById('signIn')
var container = document.getElementById('dowebok')

signUpButton.addEventListener('click', function () {
    container.classList.add('right-panel-active')
})

signInButton.addEventListener('click', function () {
    container.classList.remove('right-panel-active')
})



// 手机号验证

function validateI_UserTel_Lo(phoneNumber) {
    // 假设手机号码为11位数字，以1开头  
    var regex = /^1[3-9]\d{9}$/;
    var tel_ret = regex.test(phoneNumber);
    if (tel_ret) {
        // 如果手机号码匹配正则表达式，显示绿色信息  
        return true;
    } else {
        // 如果不匹配，显示红色信息  
        document.getElementById("Tip_Login_Tel").className = "validation-result error";
        document.getElementById("Tip_Login_Tel").textContent = "手机格式号码错误,请重新填写!";
        return false;
    }

}

// 密码验证

function validateI_UserPassword_Lo(password) {
    // 假设密码至少8个字符，包含至少1个字母
    var regex = /^(?=.*[a-zA-Z]).{8,}$/;
    var pwd_ret = regex.test(password);

    if (pwd_ret) {
        // 如果密码匹配正则表达式，显示绿色信息  
        return true;
    } else {
        // 如果不匹配，显示红色信息  
        document.getElementById("Tip_Login_Psw").className = "validation-result error";
        document.getElementById("Tip_Login_Psw").textContent = "密码格式错误,请重新填写!";
        return false;
    }
}


    $("#Login_tb1").click(function (event) {
        event.preventDefault();


            var tel = $("#L_tel").val();
            var pasw1 = $("#L_pws").val();
            if (validateI_UserTel_Lo(tel) && validateI_UserPassword_Lo(pasw1)) {
                var jsonDataObj = {
                    Usertel: tel,
                    Password: pasw1,
                }
                var jsonDataStr = JSON.stringify(jsonDataObj);
                $.ajax({
                    type: "POST",
                    url: "/Login.aspx/UserLogin",
                    contentType: "application/json;charset = utf-8",
                    dataType: "json",
                    data: jsonDataStr,
                    success: function (result) {
                        if (result.d.Success) {
                            alert(result.d.Message); // 显示“登录成功!”  
                            location.reload();
                            window.location.replace("index.html");

                        } else {
                            alert(result.d.Message); // 显示“用户名或密码错误!”  

                        }


                    },
                    error: function () {
                        alert("服务器错误!")

                    }


                })

            }

        } 








        )
    

    

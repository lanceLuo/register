//���ʺ��빫������
var flagHTML = ""
var mobileTipToOverseas = '<span class="phoneerrortip">11λ���֣�</span><a href="javascript:void(0);" id="js_get_flags" class="js_get_flags" hidefocus="true">���й���½����������</a>';
var mobileTipToChina = '<span class="phoneerrortip">�й���½���룿</span><a href="javascript:void(0);" id="js_get_flags" class="js_get_flags" hidefocus="true">�������</a>';
var mobileTipOverseasOK = '�����˺�Ϊ<font style="font-size:120%;padding:0px 2px 0 2px;color:RED">{mobile}</font>����¼������{phonecode}';
var mobileTipCustomMode = '<span class="phoneerrortip">11λ���֣����й���½��������д����</span>';
var isCustomMode = false;
var isMobileInput = false;
var isMailInput = false;
var isValidateCodehasFocus = false;
var isValidateCode1hasFocus = false;

function selRegTab(tabIndex) {
    if (tabIndex != '') {
        var toSelTab;
        switch (tabIndex) {
        case "phone":
            curIndex = "registPhone";
            toSelTab = $(".mod_regist_nav li[name='registPhone']");
            break;
        case "email":
            curIndex = "registMail";
            toSelTab = $(".mod_regist_nav li[name='registMail']");
            break;
        case "username":
            curIndex = "registCustom";
            toSelTab = $(".mod_regist_nav li[name='registCustom']");
            break;
        }
        if (toSelTab.length > 0) {

            $(".mod_regist_nav li").removeClass('cur');
            toSelTab.addClass("cur");
            document.getElementById("mod_regist_form").className = "mod_regist_form " + curIndex;
            toSelTab.click();
        }
    }
}

//���Ͷ���
function SendAPPDownLoadSMS(mobile) {
    var script = document.createElement('script');
    document.body.appendChild(script);
    //log(getRequestUrl("http://txz.dobest.com/common/msgsend/?m="+mobile+"&t=2&method=SendAPPDownLoadSMSCallback&fromid=rg1&r="+Math.random()));
    script.src = getRequestUrl("http://txz.dobest.com/common/msgsend/?m=" + mobile + "&t=2&method=SendAPPDownLoadSMSCallback&fromid=rg1&r=" + Math.random());
}

function SendAPPDownLoadSMSCallback(data) {//TODO: UI Event
}

//wutianzhi add 
function getQueryByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)","i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}
var pageMini = getQueryByName('pageType');
// ---wutianzhi add--

var curIndex = $(".mod_regist_nav li").eq(0).attr('name');
$(function() {
    //�������ݲɼ��ű�
    //$('<script src="http://ipic.staticdobest.com/external/install_beacon.js"></script>').appendTo("head")
    $(document).click(function(e) {
        var el = e.target;
        var str = $(el).attr("data-log");
        if (str) {
            var img = new Image;
            // img.src = 
        }
    })

    function log(s) {
        window.console && console.log(s)
    }

    //ת���ַ�Ϊ����
    function convertCharLetterInt(s) {
        var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < p.length; i++) {
            if (p.substring(i, i + 1) == (this.caseInsensitive ? s : s.toUpperCase())) {
                return i;
            }
        }
        return -1;
    }
    //=====================================================================
    // �����л�
    //=====================================================================
    $(".mod_regist_nav li").eq(0).addClass("cur");
    document.getElementById("mod_regist_form").className = "mod_regist_form " + curIndex;
    var nowUserAccount = '';
    var findPwdTip = "<a href=' http://pwd.dobest.com/ptinfo/SafeCenter/ScIndex/PwdFind.aspx?fromacc={username}' target='_blank'>�һ�����</a>";
    var loginTip = "<a href='http://login.dobest.com/sdo/Login/LoginSDO.php?appId=" + $.CONFIGS.defaultAppId + "&areaId=1&service=" + escape($.CONFIGS.serviceUrl) + "' target='_blank'>��¼</a>";

    var isFocusOnInputPhone = true;

    //ҳ������û���������Զ���ȡ����
    //�������ı��򣬰��س������ύ
    $(document).ready(function() {

        $("#mobile,#email,#username,#password,#checkCode,#realname,#idCard,#realEmail,#validateCode").live("keyup", function(e) {
            var curKey = e.which;
            if (curKey == 13) {
                //$(".submit_btn").click();
                doSubmit();
            }
        });

        $("#mobile").live("focus", function(e) {
            isFocusOnInputPhone = true;
        }).live("blur", function(e) {
            isFocusOnInputPhone = false;
            if (document.getElementById("mod_regist_form").className == "mod_regist_form registCustom") {
                var obj1 = document.getElementById("emailTip");
                var div1 = obj1.getElementsByTagName("p");
                var obj2 = document.getElementById("mobileTip");
                var div2 = obj2.getElementsByTagName("p");
                var v1 = document.getElementById("email").value;
                var v2 = document.getElementById("mobile").value;
                if (div1[1].style.display != "none" && div2[1].style.display == "none" && v1 == "" && v2 != "" || div1[1].style.display == "none" && div2[1].style.display != "none" && v2 == "" && v1 != "") {
                    $("#emailTip").find(".tipsError").hide();
                    $("#emailTip").find(".tipsInfo").hide();
                    $("#emailTip").find(".tipsBg").hide();
                    $("#mobileTip").find(".tipsError").hide();
                    $("#mobileTip").find(".tipsInfo").hide();
                    $("#mobileTip").find(".tipsBg").hide();
                    $.Valid.nodes = [];
                }
            }
        });

        $("#email").live("blur", function(e) {
            if (document.getElementById("mod_regist_form").className == "mod_regist_form registCustom") {
                var obj1 = document.getElementById("emailTip");
                var div1 = obj1.getElementsByTagName("p");
                var obj2 = document.getElementById("mobileTip");
                var div2 = obj2.getElementsByTagName("p");
                var v1 = document.getElementById("email").value;
                var v1 = document.getElementById("email").value;
                var v2 = document.getElementById("mobile").value;
                if (div1[1].style.display == "none" && div2[1].style.display != "none" && v1 != "" || div1[1].style.display != "none" && div2[1].style.display == "none" && v1 == "" && v2 != "") {
                    $("#emailTip").find(".tipsError").hide();
                    $("#emailTip").find(".tipsInfo").hide();
                    $("#emailTip").find(".tipsBg").hide();
                    $("#mobileTip").find(".tipsError").hide();
                    $("#mobileTip").find(".tipsInfo").hide();
                    $("#mobileTip").find(".tipsBg").hide();
                    $.Valid.nodes = [];
                }
            }
        });

        $("#mobile,#email,#username,#password,#checkCode,#idCard,#realEmail,#validateCode").live("keyup", function(e) {
            var curKey = e.which;
            if (curKey != 37 && curKey != 38 && curKey != 39 && curKey != 40) {
                CtoH(e.target);
                Trim(e.target);
            }
        });

        $("#checkCode").live("keyup", function(e) {
            if (pageType != "mini") {
                var ck = e.target;
                var code = $(ck).val();
                if (code != "" && code.length >= 6) {
                    $(".setpwd_tip").stop(true, true).show().animate({
                        opacity: 1
                    }, 700);
                }
            }
        }).live("blur", function(e) {
            if (pageType != "mini") {
                $(".setpwd_tip").stop(true, true).animate({
                    opacity: 0
                }, 700, function() {
                    $(this).hide()
                });
            }
            $("#checkCodeTip").find('.tipsInfo').html('����д�����е�6λ���֣��ղ���������');
        });

        selRegTab(tabIndex);

        switch (curIndex) {
        case "registPhone":
            $("#mobile").focus();
            break;
        case "registMail":
            $("#email").focus();
            break;
        case "registCustom":
            $("#username").focus();
            break;
        }

    });

    $("#btn_showContrast_phone, #btn_showContrast_email, #btn_showContrast_username").click(function() {
        var str = $(this).attr("id");
        if (str) {
            switch (str) {
            case "btn_showContrast_phone":
                selRegTab("phone");
                break;
            case "btn_showContrast_email":
                selRegTab("email");
                break;
            case "btn_showContrast_username":
                selRegTab("username");
                break;
            }
        }
        $("#mask, #popup_Contrast").hide();
    });

    $(".mod_regist_nav li").click(function() {
        isChangePwdMode = false;
        $(".mod_regist_form_submit2").hide();
        $(".mod_regedphone").hide();
        $("#mod_regist_form_submit").show();
        $(this).parent().children("li").removeClass("cur");
        $(this).addClass("cur");
        curIndex = $(this).attr('name');
        //�˴������������⴦��
        //$("#passwordTip").removeClass("show_tips");
        //$("#passwordTip").find(".tipsError").hide();
        //$("#passwordTip").find(".tipsInfo").hide();
        //$("#passwordTip").find(".tipsBg").hide();
        //�Ƴ���ɫ�߿� 
        //$("password").parent(".inputBox").removeClass("inputError");
        $.Valid.handleTip($("password"), "#passwordTip", 1);
        $.Valid.handleTip($("mobile"), "#mobileTip", 1);
        $.Valid.handleTip($("email"), "#emailTip", 1);
        $.Valid.handleTip($("username"), "#usernameTip", 1);
        $.Valid.handleTip($("checkCode"), "#checkCodeTip", 1);
        $.Valid.handleTip($("validateCode"), "#validateCodeTip", 1);
        $.Valid.handleTip($("validateCode1"), "#validateCode1Tip", 1);

        $(".expand_tip").stop(true, true).animate({
            opacity: 0
        }, 700, function() {
            $(this).hide()
        });
        switch (curIndex) {
        case "registPhone":
            //�ֻ�ע��
            document.getElementById("mod_regist_form").className = "mod_regist_form registPhone";
            document.getElementById("inputlabel1").innerHTML = "�ֻ�����(������д)";
            document.getElementById("mobile").value = "";
            document.getElementById("password").value = "";
            document.getElementById("validateCode").value = "";
            document.getElementById("validateCode1").value = "";
            $("#input_wrap_email").hide();
            $("#input_wrap_custom").hide();
            $("#input_wrap_username").show();
            $.Valid.nodes = [];
            isCustomMode = false;
            isMailInput = false;
            for (var i = 0; i <= 6; i++) {
                mobile = $(".registPhone .inputBox").eq(i).children(".inputLabel");
                mobile.removeClass("inputLabelHide");
            }
            $("#mobile").focus();
            if (!needVerifyCode) {
                $("#verifyCode").hide();
                $("#verifyCode1").hide();
                $(".mod_regist").removeClass("with_code");
            } else {
                $("#verifyCode").show();
                $("#verifyCode1").hide();
                if (!$(".mod_regist").hasClass("with_code")) {
                    $(".mod_regist").addClass("with_code");
                }
            }
            if (!$(".password_tip").hasClass("password_tip2")) {
                $(".password_tip").addClass("password_tip2");
            }
            break;
        case "registMail":
            //�ʼ�ע��
            document.getElementById("mod_regist_form").className = "mod_regist_form registMail";
            document.getElementById("inputlabel2").innerHTML = "����(������д)";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("validateCode").value = "";
            document.getElementById("validateCode1").value = "";
            $("#input_wrap_username").hide();
            $("#input_wrap_custom").hide();
            $("#input_wrap_email").show();
            $.Valid.nodes = [];
            isCustomMode = false;
            for (var i = 0; i <= 6; i++) {
                mobile = $(".registMail .inputBox").eq(i).children(".inputLabel");
                mobile.removeClass("inputLabelHide");
            }
            isMobileInput = false;
            $("#email").focus();
            if (!needVerifyCode) {
                $("#verifyCode").hide();
                $("#verifyCode1").hide();
                $(".mod_regist").removeClass("with_code");
            } else {
                $("#verifyCode").hide();
                $("#verifyCode1").show();
                if (!$(".mod_regist").hasClass("with_code")) {
                    $(".mod_regist").addClass("with_code");
                }
            }
            if (!$(".password_tip").hasClass("password_tip2")) {
                $(".password_tip").addClass("password_tip2");
            }
            break;
        case "registCustom":
            //����ע��
            document.getElementById("mod_regist_form").className = "mod_regist_form registCustom";
            document.getElementById("inputlabel1").innerHTML = "ע���ֻ�����(������ѡ��һ��)";
            document.getElementById("inputlabel2").innerHTML = "ע������(���ֻ�����ѡ��һ��)";
            document.getElementById("mobile").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("validateCode").value = "";
            document.getElementById("validateCode1").value = "";
            $("#input_wrap_username").show();
            $("#input_wrap_email").show();
            $("#input_wrap_custom").show();
            $.Valid.nodes = [];
            var mobile;
            for (var i = 0; i <= 6; i++) {
                mobile = $(".registCustom .inputBox").eq(i).children(".inputLabel");
                mobile.removeClass("inputLabelHide");
            }
            isCustomMode = true;
            $(".registCustom .inputBox").eq(1).removeClass("otherMbInput");
            $(".selcountry").hide();
            $("#username").focus();
            //����������ݺ���INPUT������ʾ��һ��INPUT���������email
            $(".registCustomMail").show();
            if (!needVerifyCode) {
                $("#verifyCode").hide();
                $("#verifyCode1").hide();
                $(".mod_regist").removeClass("with_code");
            } else {
                $("#verifyCode").hide();
                $("#verifyCode1").show();
                if (!$(".mod_regist").hasClass("with_code")) {
                    $(".mod_regist").addClass("with_code");
                }
            }
            if (!$(".password_tip").hasClass("password_tip2")) {
                $(".password_tip").addClass("password_tip2");
            }
            $(this).find(".tipsArrow, .tipsExtendedInfo").hide();
            break;
        }
    });

    //�Ƶ�����ע��Ĵ���������ʱ����ʾ��ʾ��Ϣ
    $(".tipsExtendedBtn").hover(function() {
        var pageMini = getQueryByName('pageType');
        if (pageMini == 'mini') {
            return
        }
        $(this).parent().not(".cur").find(".tipsArrow, .tipsExtendedInfo").toggle();
    });
    //=====================================================================
    // �������
    //=====================================================================

    $(".js_get_flags").live('click', function() {
        if ($(".selcountry").is(":visible")) {
            $(".selcountry").hide();
            $(".registPhone .inputBox").eq(1).removeClass("otherMbInput");
            $("#mobileTip").find(".tipsInfo").html(mobileTipToOverseas);
            //���¸�ֵ�����IE8�¼��������� 2012-10-22 pxm
            $("#mobile").val($("#mobile").val());
            //$(this).find("span").html('���ǹ����ֻ���');
        } else {
            //console.log($.CONFIGS.get_flags_url)
            if (!flagHTML) {
                $.get($.CONFIGS.get_flags_url, function(html) {
                    flagHTML = html
                    $("#flag_list").html(flagHTML);
                    $("#mobileTip").find(".tipsInfo").html(mobileTipToChina);
                }, "html")
            } else {
                $("#flag_list").html(flagHTML);
                $("#mobileTip").find(".tipsInfo").html(mobileTipToChina);
            }

            $(".selcountry").show();
            //���¸�ֵ�����IE8�¼��������� 2012-10-22 pxm
            $("#mobile").val($("#mobile").val());
            //Ϊ��ʾ���������������ռ�
            $(".registPhone .inputBox").eq(1).addClass("otherMbInput");
        }
        $("#mobile").focus();
    })
    $(".selcountry").hide()

    $("#mobile").focus(function() {
        if ($(".selcountry").is(":visible")) {
            $("#mobileTip").find(".tipsInfo").html(mobileTipToChina);
        } else {
            if (pageType == 'mini') {
                $("#mobileTip").find(".tipsInfo").html("11λ����");
            } else if (isCustomMode == false) {
                $("#mobileTip").find(".tipsInfo").html(mobileTipToOverseas);
            } else {
                $("#mobileTip").find(".tipsInfo").html(mobileTipCustomMode);
            }
        }
    })

    //ʵʱ�������ң������ݺ���
    $(".search_input").live({
        keyup: function() {
            var input = $(".search_input").val();
            if (input != '') {
                $("#flag_list").find("li").each(function() {
                    if ($(this).text().indexOf(input) >= 0) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                })
            } else {
                $("#flag_list").find("li").each(function() {
                    $(this).show();
                })
            }
        },
        focus: function() {
            var placehoder = $(this).parent().children(".inputLabel");
            $(this).parent().addClass("inputFocus");
            if ($(this)[0].value.length) {
                placehoder.addClass("inputLabelHide");
            } else {
                placehoder.removeClass("inputLabelHide");
            }
        },
        blur: function() {
            var placehoder = $(this).parent().children(".inputLabel");
            if ($(this)[0].value.length) {
                placehoder.addClass("inputLabelHide");
            } else {
                placehoder.removeClass("inputLabelHide");
            }
            $(this).parent().removeClass("inputFocus");
        }
    });

    var flag_in = true;
    //������뿪��������������ط�ʱ�������Զ�����������
    $(".selcountry").mouseenter(function() {
        flag_in = true;
    }).mouseleave(function() {
        flag_in = false;
    }).click(function(e) {
        if (e.target.className != "inputLabel" && e.target.className != "search_input" && e.target.className != "search_btn") {
            $("#flag_list").toggle();
            $("#verifyCode").toggle();
        }
    });
    //�л���ͬ�Ĺ��������
    $("#flag_list").delegate("li", "click", function() {
        var flag_class = $(this).find(".talk_flag").prop("class").replace(/talk_flag\s+/, "")
        var flag_code = $(this).find(".flag_name").html().match(/\+\d+/);
        $("#country_flag .talk_flag")[0].className = "talk_flag " + flag_class
        $("#country_code").html(flag_code[0] || "+1")
        $("#mobile").focus();
    });
    $("#flag_list").delegate(".flag_wrap", "click", function() {
        var flag_class = $(this).find(".talk_flag").prop("class").replace(/talk_flag\s+/, "")
        var flag_code = $(this).find(".flag_name").html().match(/\+\d+/);
        $("#country_flag .talk_flag")[0].className = "talk_flag " + flag_class
        $("#country_code").html(flag_code[0] || "+1")
        $("#mobile").focus();
    });
    $(document).click(function(e) {
        if (!flag_in && (e.target.className != "inputLabel" && e.target.className != "search_input" && e.target.className != "search_btn")) {
            $("#flag_list").hide();
            if (document.getElementById("mod_regist_form").className == "mod_regist_form registPhone") {
                $("#verifyCode").show();
            }
        }
    })

    //��placehoder�����У��������Ƶ��������
    $(".inputBox .inputLabel").live("click", function() {
        $(this).parent().children("input").focus();
    });
    //���û�����ʱ���ж��Ƿ�����PlaceHoder
    $("#registForm").delegate("input", "keypress keydown mousedown", function() {
        var node = this;
        setTimeout(function() {
            $.Valid.handlePlaceHoder(node, true)
        }, 0)
    });
    //���л������ֻ�ʱ��������֤
    $(".js_get_flags").live('mouseenter', function() {
        $.Valid.isNeedCheck = false;
    }).live('mouseleave', function() {
        $.Valid.isNeedCheck = true;
    })
    $("#js_get_phone").live('mouseenter', function() {
        if (!isFocusOnInputPhone) {
            $.Valid.isNeedCheck = false;
        }
    }).live('mouseleave', function() {
        $.Valid.isNeedCheck = true;
    })

    $("#validateCode").bind("keyup", function(e) {
        if ($("#validateCode").val() != '' && $("#validateCode").val().length >= 12) {
            $("#validateCode").blur();
            $("#validateCode").focus();
        }
    })

    $("#validateCode").live("focus", function(e) {
        isValidateCodehasFocus = true;
    }).live("blur", function(e) {
        isValidateCodehasFocus = false;
    })

    $("#validateCode1").live("focus", function(e) {
        isValidateCode1hasFocus = true;
    }).live("blur", function(e) {
        isValidateCode1hasFocus = false;
    })

    //�л�ҳǩ��ʱ�򲻽�����֤
    $(".mod_regist_nav li").live('mouseenter', function() {
        $.Valid.isNeedCheck = false;
    }).live('mouseleave', function() {
        $.Valid.isNeedCheck = true;
    })
    //�����ʾ�����ʱ�򲻽�����֤
    $(".showPassBtn").live('mouseenter', function() {
        $.Valid.isNeedCheck = false;
    }).live('mouseleave', function() {
        $.Valid.isNeedCheck = true;
    })

    $("#input_wrap_password").live('mouseenter', function() {
        $("#input_wrap_smscode,#input_wrap_custom,#input_wrap_email").attr("style", "pointer-events:none");
        if (curIndex == "registCustom") {
            $("#input_wrap_email").show();
        }
    }).live('mouseleave', function() {
        $("#input_wrap_smscode,#input_wrap_custom,#input_wrap_email").removeAttr("style");
        if (curIndex == "registCustom") {
            $("#input_wrap_email").show();
        }
    })

    //����&���ô� �����ֲ�
    function doubleFlagSwitch(flag_1, flag_2) {
        var flag = false;
        var switchFlag = setInterval(function() {
            if (flag) {
                $("#" + flag_1).show();
                $("#" + flag_2).hide();
                flag = false;
            } else {
                $("#" + flag_1).hide();
                $("#" + flag_2).show();
                flag = true;
            }
        }, 1000);
    }
    doubleFlagSwitch("doubleFlag_1", "doubleFlag_2");

    var isChangePwdMode = false;
    validate("#registForm", "mobile", {
        "ע���ֻ�����δ��д": function(node) {
            return /^\s*$/.test(node.value)
        },
        "ע���ֻ�����ֻ��Ϊ����": function(node) {
            return /\D+/.test(node.value)
        },
        "ע���ֻ�������д����ȷ���Ǵ�½�ֻ�����д����": function(node) {
            if (isCustomMode == false) {
                return false;
            }
            if (pageType == 'mini') {
                return false;
            }
            //�����ж����ڵ��ֻ�
            if ($(".selcountry").is(":visible")) {
                return false;
            }
            return !/^0*(13|15|18|14|17)\d{9}$/.test(node.value);
        },
        "ע���ֻ�������д����ȷ��<a href='javascript:void(0);' class='js_get_flags' hidefocus='true'>�Ǵ�½�ֻ��������ע��</a>": function(node) {
            if (isCustomMode == true) {
                return false;
            }
            if (pageType == 'mini') {
                return false;
            }
            //�����ж����ڵ��ֻ�
            if ($(".selcountry").is(":visible")) {
                return false;
            }
            return !/^0*(13|15|18|14|17)\d{9}$/.test(node.value);
        },
        "ע���ֻ�������д����ȷ": function(node) {
            if (pageType != 'mini') {
                return false;
            }
            return !/^0*(13|15|18|14|17)\d{9}$/.test(node.value);
        },
        "�˺����ѱ�ע�ᣬ��˵�¼": function(node) {
            if (isCustomMode == true) {
                return false;
            }
            if ($(".selcountry").is(":visible")) {
                var url = getRequestUrl($.CONFIGS.url_reg + "/user/existence/abroadphone.jsonp");
                var username = $("#country_code").html() + node.value;
                nowUserAccount = username;
                $.ajax({
                    url: url,
                    data: {
                        username: username,
                        appId: $.CONFIGS.defaultAppId,
                        areaId: $.CONFIGS.defaultAreaId
                    },
                    success: function(json) {
                        if (json.status == 0) {
                            if (json.existing) {
                                $.Valid.handleTip($("#mobile")[0], "#mobileTip", 0, "�ú�����ע�ᣡ����" + loginTip + "��" + findPwdTip.replace('{username}', nowUserAccount));
                                $(".expand_tip").hide();
                                $('#js_get_phone').addClass("wait");
                            } else {
                                var obj = document.getElementById("validateCodeTip");
                                var div = obj.getElementsByTagName("p");
                                if (div[1].style.display != "none" && "" != validcode) {
                                    return;
                                }
                                if (!$("#js_get_phone").hasClass("smscodesendloop")) {
                                    $('#js_get_phone').removeClass("wait");
                                }
                                if ($(".selcountry").is(":visible")) {
                                    $(".expand_tip").stop(true, true).show().animate({
                                        opacity: 1,
                                        top: 88,
                                        zIndex: 1000
                                    }, 700);
                                }
                                if ($(".selcountry").is(":visible")) {
                                    $("#mobileTip").addClass("show_tips");
                                    $("#mobileTip").find(".tipsInfo").show();
                                    $("#mobileTip").find(".tipsInfo").html(mobileTipOverseasOK.replace('{mobile}', nowUserAccount).replace('{phonecode}', $("#country_code").html()));
                                }
                            }
                        } else {
                            var message = $.CONFIGS.message[json.status];
                            if (typeof (message) == "undefined") {
                                message = json.message;
                            }
                            $.Valid.handleTip($("#mobile")[0], "#mobileTip", 0, message)
                            $('#js_get_phone').addClass("wait");
                            LoginLog.LogHpsFailed("method=checkPhoneExists&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                        }

                    },
                    timeout: 10000,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        /*
        			 *"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
        			 */
                        if (textStatus != "success") {
                            LoginLog.LogError("method=checkPhoneExists&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                        }
                    },
                    dataType: "jsonp"
                });
            } else {
                var url = getRequestUrl($.CONFIGS.url_cas + "/authen/checkAccountType.jsonp");
                var username = node.value;
                nowUserAccount = username;
                $.ajax({
                    url: url,
                    data: {
                        serviceUrl: 'register.dobest.com',
                        //Ŀǰ��д�����Է�������������
                        appId: $.CONFIGS.defaultAppId,
                        areaId: $.CONFIGS.defaultAreaId,
                        authenSource: 2,
                        inputUserId: username,
                        locale: 'zh_CN',
                        productId: 1,
                        productVersion: '1.7',
                        version: 21
                    },
                    success: function(json) {
                        if (json.return_code == 0) {
                            var isCanReg = true;
                            if (json.data.existing == 1) {
                                if (json.data.fromWoa == 1 && json.data.hasPwdLoginRecord == 0 && (typeof (json.data.loginType) == 'undefined' || json.data.loginType == '')) {
                                    isCanReg = true;
                                    clog('mobilecheck_exist_woa');
                                } else {
                                    $.Valid.handleTip($("#mobile")[0], "#mobileTip", 0, "�ú�����ע�ᣡ����" + loginTip + "��" + findPwdTip.replace('{username}', nowUserAccount));
                                    $(".expand_tip").hide();
                                    $('#js_get_phone').addClass("wait");
                                    isCanReg = false;
                                    isChangePwdMode = false;
                                    clog('mobilecheck_exist');
                                }
                            } else {
                                clog('mobilecheck_noexist');
                            }
                            if (isCanReg) {
                                var isValidCodeInput = true;
                                if ("undefined" == typeof validcode || "" == validcode) {
                                    isValidCodeInput = false;
                                }
                                if (!$("#js_get_phone").hasClass("smscodesendloop") && isValidCodeInput) {
                                    $('#js_get_phone').removeClass("wait");
                                }
                                if ($(".selcountry").is(":visible")) {
                                    $(".expand_tip").stop(true, true).show().animate({
                                        opacity: 1,
                                        top: 88,
                                        zIndex: 1000
                                    }, 700);
                                }
                                if ($(".selcountry").is(":visible")) {
                                    $("#mobileTip").addClass("show_tips");
                                    $("#mobileTip").find(".tipsInfo").show();
                                    $("#mobileTip").find(".tipsInfo").html(mobileTipOverseasOK.replace('{mobile}', nowUserAccount).replace('{phonecode}', $("#country_code").html()));
                                }
                            }
                        } else {
                            var message = $.CONFIGS.message[json.status];
                            if (typeof (message) == "undefined") {
                                message = json.message;
                            }
                            $.Valid.handleTip($("#mobile")[0], "#mobileTip", 0, message)
                            $('#js_get_phone').addClass("wait");
                            LoginLog.LogHpsFailed("method=checkPhoneExists&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                        }

                    },
                    timeout: 10000,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        /*
            			 *"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
            			 */
                        if (textStatus != "success") {
                            LoginLog.LogError("method=checkPhoneExists&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                        }
                    },
                    jsonpCallback: "checkAccountType_JSONPMethod",
                    dataType: "jsonp"
                });
            }
            return false;
        }
    }, {
        success: function() {//if($(".selcountry").is(":visible")){
        //	$("#mobileTip").addClass("show_tips");
        //	$("#mobileTip").find(".tipsInfo").show();
        //	$("#mobileTip").find(".tipsInfo").html(mobileTipOverseasOK.replace('{mobile}', nowUserAccount).replace('{phonecode}', $("#country_code").html()));
        //}
        }
    });

    $("#mobile").bind("keydown keyup", function(e) {
        $("#checkCode").val('');
        isMobileInput = false;
        if (isCustomMode) {
            return;
        }
        if (pageType != 'mini') {
            if (!$(".selcountry").is(":visible")) {
                if ($("#mobile").val() != '' && $("#mobile").val().length >= 3) {
                    if (/^0*(13|15|18|14)\d*$/.test($("#mobile").val())) {
                        $("#mobileTip").find(".tipsInfo").show();
                        $("#mobileTip").find(".tipsInfo").html("11λ���֡�");
                    }
                } else {
                    $("#mobileTip").find(".tipsInfo").html(mobileTipToOverseas);
                    $("#mobileTip").find(".tipsInfo").show();
                }
            }
        }
        if (!$("#js_get_phone").hasClass("smscodesendloop")) {
            var validcode = $("#validateCode").val();
            var isValidCodeInput = true;
            var obj = document.getElementById("validateCodeTip");
            var div = obj.getElementsByTagName("p");
            if (div[1].style.display != "none" || "" == validcode) {
                isValidCodeInput = false;
            }
            var em = e.target.value;
            if (!$(".selcountry").is(":visible")) {
                if (!/^\s*$/.test(em) && !/\D+/.test(em) && /^0*(13|15|18|14)\d{9}$/.test(em) && isValidCodeInput) {
                    $("#js_get_phone").text('��ѻ�ȡ��֤��');
                    $('#js_get_phone').removeClass("wait");
                    $(".expand_tip").stop(true, true).show().animate({
                        opacity: 1,
                        top: 88,
                        zIndex: 1000
                    }, 700);
                    isMobileInput = false;
                } else {
                    $('#js_get_phone').addClass("wait");
                    $(".expand_tip").stop(true, true).animate({
                        opacity: 0
                    }, 700, function() {
                        $(this).hide()
                    });
                }
            } else {
                if (!/^\s*$/.test(em) && !/\D+/.test(em) && isValidCodeInput) {
                    $("#js_get_phone").text('��ѻ�ȡ��֤��');
                    $('#js_get_phone').removeClass("wait");
                    //$(".expand_tip").stop(true,true).show().animate({opacity : 1},700);
                } else {
                    $('#js_get_phone').addClass("wait");
                    $(".expand_tip").stop(true, true).animate({
                        opacity: 0
                    }, 700, function() {
                        $(this).hide()
                    });
                }
            }

        } else {
            if (!$("#js_get_phone").hasClass("smscodeloopchange")) {
                $('#js_get_phone').addClass("smscodeloopchange");
            }
        }
    })

    /*��ʾ����*/
    var showPassBtnClick = false;
    $("#registForm").delegate(".showPassBtn", "click", function(e) {
        e.stopPropagation();
        var $input = $("#password");
        var html = ["<input type="]
        if ($input.attr("type") === "password") {
            $("#btnShowPass").text("��������");
            $(".password_tip").stop(true, true).animate({
                opacity: 0
            }, 700, function() {
                $(this).removeClass("active").hide()
            });
            html.push("text")
        } else {
            $("#btnShowPass").text("��ʾ����");
            $(".password_tip:not('.active')").addClass("active").stop(true, true).show().animate({
                opacity: 1
            }, 700);
            html.push("password")
        }
        String("tabindex,value,class,name,id").replace(/[^, ]+/g, function(p) {
            var val = $input.attr(p)
            if (val) {
                html.push(" " + p + "='" + val + "'")
            }
        });
        html.push(" />")
        $input.replaceWith(html.join(""));
        // $(".password").focus().val($(".password").val());

        if (pageMini == 'mini') {
            $(".password").val($(".password").val());
        } else {
            $(".password").focus().val($(".password").val());
        }

    });

    //�л�ҳǩ��ʱ�򲻽�����֤
    $(".showPassBtn").live('mouseenter', function() {
        if ($("#btnShowPass").text() == "��ʾ����") {
            $(".password_tip:not('.active')").addClass("active").stop(true, true).show().animate({
                opacity: 1
            }, 700);
        }
    }).live('mouseleave', function() {
        $(".password_tip").stop(true, true).animate({
            opacity: 0
        }, 700, function() {
            $(this).removeClass("active").hide()
        });
    })

    validate("#registForm", "password", {
        //û��ͨ������true������ʾ������Ϣ
        "����δ��д": function(node) {
            return /^\s*$/.test(node.value)
        },
        "������̣�����6λ��ĸ������": function(node) {
            return node.value.length < 6
        },
        "������������30λ��ĸ������": function(node) {
            return node.value.length > 30
        },
        "���뺬�Ƿ��ַ�������ʹ����ĸ�����֡�<a href='javascript:void(0);' class='showPassBtn' hidefocus='true'>�������</a>": function(node) {
            if (pageType == 'mini') {
                return false;
            }
            return /[\W_]/.test(node.value);
            //���ڷǷ��ַ�
        },
        "���뺬�Ƿ��ַ�������ʹ����ĸ�����֡�": function(node) {
            if (pageType != 'mini') {
                return false;
            }
            return /[\W_]/.test(node.value);
            //���ڷǷ��ַ�
        },
        "���벻�����û�����ͬ": function(node) {
            switch (curIndex) {
            case "registPhone":
                //�ֻ�ע��
                return $("#registForm .mobile").val() === node.value
            case "registMail":
                return $("#registForm .email").val() === node.value
            case "registCustom":
                return $("#registForm .username").val() === node.value
            }

        },
        "������ڼ򵥣�����Ϊͬһ�ַ�": function(node) {
            var s = node.value;
            var errorLength = 0;
            var tmpLength = 1;
            var i = 0;
            for (i = 1; i < s.length; i++) {
                if (s.substr(i, 1) == s.substr(i - 1, 1)) {
                    tmpLength++;
                } else {
                    tmpLength = 1;
                }
                if (tmpLength > errorLength) {
                    errorLength = tmpLength;
                }
            }
            return errorLength === s.length;
        },
        "������ڼ򵥣�����Ϊ������ĸ": function(node) {
            var s = node.value;
            var lvLastChar = s.substring(0, 1);
            var lvLetterDiff = 0;
            if (isNaN(lvLastChar)) {
                for (var i = 1; i < s.length; i++) {
                    var c = s.substring(i, i + 1);
                    if (isNaN(c)) {
                        if (i == 1) {
                            lvLetterDiff = convertCharLetterInt(c) - convertCharLetterInt(lvLastChar);
                            if (lvLetterDiff != 0 && lvLetterDiff != 1 && lvLetterDiff != -1) {
                                return false;
                            }
                        } else {
                            if ((convertCharLetterInt(c) - convertCharLetterInt(lvLastChar)) != lvLetterDiff) {
                                return false;
                            }

                        }
                        lvLastChar = c;
                    } else {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        "������ڼ򵥣�����Ϊ��������": function(node) {
            var s = node.value;
            var lvLastChar = s.substring(0, 1);
            var lvLetterDiff = 0;
            for (var i = 1; i < s.length; i++) {
                var c = s.substring(i, i + 1);
                if (isNaN(c) == false) {
                    if (i == 1) {
                        lvDigitialDiff = parseInt(c) - parseInt(lvLastChar);
                        if (lvDigitialDiff != 0 && lvDigitialDiff != 1 && lvDigitialDiff != -1) {
                            return false;
                        }
                    } else {
                        if ((parseInt(c) - parseInt(lvLastChar)) != lvDigitialDiff) {
                            return false;
                        }
                    }
                    lvLastChar = c;
                } else {
                    return false;
                }
            }
            return true;
        }
    });

    //�ж�����ǿ��
    $("#registForm").delegate(".password", "keydown keyup mousedown", function(e) {
        var length = this.value.length;
        if (length <= 6) {
            $("#passwordTip .tipsInfo").removeClass("curLow curMiddle curHigh")
            $("#passwordTip .tipsInfo").addClass("curLow")
        } else if (length < 11) {
            $("#passwordTip .tipsInfo").removeClass("curLow curMiddle curHigh")
            $("#passwordTip .tipsInfo").addClass("curMiddle")
        } else if (length < 30) {
            $("#passwordTip .tipsInfo").removeClass("curLow curMiddle curHigh")
            $("#passwordTip .tipsInfo").addClass("curHigh")
        }
        //if(!showPassBtnClick && e.type == "keydown"){
        //    $(".password_tip:not('.active')").addClass("active").stop(true,true).show().animate({opacity : 1},700);
        //}
    });

    validate("#registForm", "checkCode", {
        "��֤��δ��д": function(node) {
            var ret = /^\s*$/.test(node.value)
            return ret
        },
        "��д������֤��Ϊ�����е�6λ����": function(node) {
            var ret = !/^\d{6}$/.test(node.value)
            return ret
        },
        "���ȵ����ѻ�ȡ��֤�밴ť": function(node) {
            return !isSendSMSCode;
        }
    })

    validate("#registForm", "realname", {
        "����δ��д": function(node) {
            return /^\s*$/.test(node.value)
        },
        //��Ҳ��ͨ��
        "��д��������Ϊ2~5������": function(node) {
            return !/^[\u3E00-\u9FA5\��]{2,5}$/.test(node.value)
        }
    })

    var lastValidateCode = "";
    //ͼƬ��֤��
    validate("#registForm", "validateCode", {
        //û��ͨ������true������ʾ������Ϣ
        "��֤�벻��Ϊ��": function(node) {
            $('#js_get_phone').addClass("wait");
            return /^\s*$/.test(node.value)
        },
        "��֤��ӦΪ6λ����": function(node) {
            return ( node.value.length != 6) ;
        },
        "��֤�벻��ȷ": function(node) {
            var url = getRequestUrl($.CONFIGS.url_reg + "/user/register/checkcode-intime.jsonp");
            var validCode = $("#validateCode").val();
            if (curIndex != "registPhone") {
                validCode = $("#validateCode1").val();
            } else {
                validCode = $("#validateCode").val();
            }
            if (lastValidateCode != "") {
                var obj = document.getElementById("mobileTip");
                var tip = obj.getElementsByTagName("p");
                var smscode = document.getElementById("js_get_phone").className;
                if (validCode == lastValidateCode) {
                    if (tip[1].style.display == "none" && smscode != "input_expand_btn wait smscodesendloop" && $("#mobile").val().length != 0) {
                        $('#js_get_phone').removeClass("wait");
                    }
                    return false;
                } else {
                    //refreshImg();
                    lastValidateCode = "";
                    if (curIndex == "registPhone") {
                        $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 0, "��֤�벻��ȷ");
                    } else {
                        $.Valid.handleTip($("#validateCode1"), "#validateCode1Tip", 0, "��֤�벻��ȷ");
                    }
                    return true;
                }
            }
            $.ajax({
                url: url,
                data: {
                    checkCode: validCode,
                    sessionKey: $.CONFIGS.sessionKey,
                    appId: $.CONFIGS.defaultAppId,
                    areaId: $.CONFIGS.defaultAreaId
                },
                success: function(json) {
                    if (json.return_code == 0) {
                        lastValidateCode = validCode;
                        if (curIndex == "registPhone") {
                            $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 1);
                            var obj = document.getElementById("mobileTip");
                            var tip = obj.getElementsByTagName("p");
                            var smscode = document.getElementById("js_get_phone").className;
                            if (tip[1].style.display == "none" && smscode != "input_expand_btn wait smscodesendloop" && $("#mobile").val().length != 0) {
                                $('#js_get_phone').removeClass("wait");
                                $("#checkCode").css({
                                    'backgroundColor': 'transparent'
                                });
                            }
                        } else {
                            $.Valid.handleTip($("#validateCode1"), "#validateCode1Tip", 1);
                        }
                    } else {
                        LoginLog.LogHpsFailed("method=checkValidateCode&url=" + url + "&validateCode=" + validCode + "&sessionKey=" + $.CONFIGS.sessionKey + "&jsonstatus=" + json.return_code + "&jsonmessage=" + json.return_message);
                        if (curIndex == "registPhone") {
                            if (!isValidateCodehasFocus && $("#validateCode").val().length == 6) {
                                refreshImg();
                            }
                            lastValidateCode = "";
                            $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 0, "��֤�벻��ȷ");
                            $('#js_get_phone').addClass("wait");
                        } else {
                            if (!isValidateCode1hasFocus && $("#validateCode1").val().length == 6) {
                                refreshImg();
                            }
                            lastValidateCode = "";
                            $.Valid.handleTip($("#validateCode1"), "#validateCode1Tip", 0, "��֤�벻��ȷ");
                        }
                    }
                },
                timeout: 10000,
                error: function(XMLHttpRequest, textStatus, errorThrown) {

                    //"success", "notmodified", "error", "timeout", "abort", or "parsererror" 

                    if (textStatus != "success") {
                        LoginLog.LogError("method=checkValidateCode&url=" + url + "&validateCode=" + validCode + "&sessionKey=" + $.CONFIGS.sessionKey + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                    }
                    refreshImg();
                    lastValidateCode = "";
                    $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 0, "��֤�벻��ȷ");
                },
                dataType: "jsonp"
            });
            return false;
        }
    })

    /*validate("#registForm","validateCode1",{
        //û��ͨ������true������ʾ������Ϣ
        "��֤�벻��Ϊ��": function( node ){
            return /^\s*$/.test(node.value)
        },
        "��֤��ӦΪ6λ����":function(node){
        	return (node.value.length != 6);
        },
        "��֤�벻��ȷ":function(node){
        	var url=getRequestUrl($.CONFIGS.url_reg +"/user/register/checkcode-intime.jsonp");
            var validCode=$("#validateCode1").val();
        	if(lastValidateCode != ""){
        		if(validCode == lastValidateCode){
        			return false;
        		}
        		else{
        			refreshImg();
        			lastValidateCode = "";
        			$.Valid.handleTip($("#validateCode1"), "#validateCode1Tip" , 0, "��֤�벻��ȷ");
        			return true;
        		}
        	}
            $.ajax({
                url:url,
                data:{
                	checkCode:validCode,
                    sessionKey: $.CONFIGS.sessionKey,
                    appId: $.CONFIGS.defaultAppId,
                    areaId:$.CONFIGS.defaultAreaId
                },
                success: function(json){
                   if(json.return_code == 0){
                	   lastValidateCode = validCode;
                	   $.Valid.handleTip($("#validateCode1"), "#validateCode1Tip" , 1);
	                }else{
	                    LoginLog.LogHpsFailed("method=checkValidateCode&url=" + url + "&validateCode=" + validCode + "&sessionKey=" + $.CONFIGS.sessionKey + "&jsonstatus="+json.return_code+"&jsonmessage="+json.return_message);
	                    refreshImg(); 
	                    lastValidateCode = "";
	                   	$.Valid.handleTip($("#validateCode1"), "#validateCode1Tip" , 0, "��֤�벻��ȷ");
	                }
                },
                timeout:10000,
                error:function(XMLHttpRequest, textStatus, errorThrown){
        			
        			 //"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
        			 
        			if(textStatus!="success"){
        				LoginLog.LogError("method=checkValidateCode&url=" + url + "&validateCode=" + validCode + "&sessionKey=" + $.CONFIGS.sessionKey + "&textStatus="+textStatus+"&message="+errorThrown.message+"&description="+errorThrown.description);
        			}
        			refreshImg();
        			lastValidateCode = "";
        			$.Valid.handleTip($("#validateCode1"), "#validateCode1Tip" , 0, "��֤�벻��ȷ");
                },
                dataType:"jsonp"
            }); 
            return false;
        }
    })
*/
    validate("#registForm", "idCard", {
        "���֤����δ��д": function(node) {
            return /^\s*$/.test(node.value)
        },
        "���֤������д����": function(node) {
            return !IDCardCheck(node.value)
        }
    })
    //��֤email
    validate("#registForm", "email", {
        "ע������δ��д": function(node) {
            return /^\s*$/.test(node.value)
        },
        "������д���������": function(node) {
            //return !/^(\w)+(\.\w+)*@(\w)+\.(com|net|cn|org)$/.test(node.value)
            return !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(node.value)
        },
        "Ŀǰֻ֧��.com .net .cn .org��׺������": function(node) {
            return !/^(\w)+(\.\w+)*@(\w)+(\-*)+(\w)+\.(com|net|cn|org|com.cn|net.cn)$/.test(node.value.toLowerCase())
        },
        "��������Ƿ����": function(node) {
            if (isCustomMode == true) {
                return false;
            }
            nowUserAccount = $(".email").val();
            url = getRequestUrl($.CONFIGS.url_reg + "/user/existence/email.jsonp");
            $.ajax({
                url: url,
                data: {
                    appId: $.CONFIGS.defaultAppId,
                    areaId: $.CONFIGS.defaultAreaId,
                    username: $(".email").val()
                },
                success: function(json) {
                    if (json.status == 0) {
                        if (json.existing) {
                            $.Valid.handleTip($(".email")[0], "#emailTip", 0, "��������ע�ᣡ������" + findPwdTip.replace('{username}', nowUserAccount));
                        }
                    } else {
                        var message = $.CONFIGS.message[json.status];
                        if (typeof (message) == "undefined") {
                            message = json.message;
                        }
                        $.Valid.handleTip($(".email")[0], "#emailTip", 0, message)
                        LoginLog.LogHpsFailed("method=checkEMailExists&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                    }

                },
                timeout: 10000,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    /*
        			 *"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
        			 */
                    var excdes = "";
                    if (textStatus != "success") {
                        LoginLog.LogError("method=checkEMailExists&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                    }
                },
                dataType: "jsonp"

            })
            return false
        }
    })
    //��֤ͨ��֤(�����ʺ�)
    validate("#registForm", "username", {
        "�����˺�δ��д": function(node) {
            return /^\s*$/.test(node.value)
        },
        "���ȹ��̣�����4λ��ĸ������": function(node) {
            return node.value.length < 4
        },
        "���ȹ��������16λ��ĸ������": function(node) {
            return node.value.length > 16
        },

        "�����˺���λ��������ĸ": function(node) {
            return !/^[a-z]/i.test(node.value)
        },
        "<span id='listUnvalidChar'></span>Ϊ�Ƿ��ַ�,���Ϊ��ĸ������": function(node) {
            var array = [];
            node.value.replace(/\W/g, function(el) {
                array.push(el)
            })
            var clone = array.slice(0, 3);
            if (clone.length) {
                var str = clone.join(",")
                if (array.length > 2) {
                    str += "��"
                }
                setTimeout(function() {
                    $("#listUnvalidChar").html(str)
                }, 0)
                return true
            }
            return false;
        },
        "�������˺��Ƿ����": function(node) {
            nowUserAccount = $(".username").val();
            url = getRequestUrl($.CONFIGS.url_reg + "/user/existence/username/" + $(".username").val() + ".jsonp");
            $.ajax({
                url: url,
                data: {
                    appId: $.CONFIGS.defaultAppId,
                    areaId: $.CONFIGS.defaultAreaId,
                    username: $(".username").val()
                },
                success: function(json) {
                    if (json.status == 0) {
                        if (json.existing) {
                            $.Valid.handleTip($(".username")[0], "#usernameTip", 0, "�˺���ע�ᣡ������������" + findPwdTip.replace('{username}', nowUserAccount));
                        }
                    } else {
                        var message = $.CONFIGS.message[json.status];
                        if (typeof (message) == "undefined") {
                            message = json.message;
                        }
                        $.Valid.handleTip($(".username")[0], "#usernameTip", 0, message);
                        LoginLog.LogHpsFailed("method=checkUserNameExists&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                    }

                },
                timeout: 10000,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    /*
        			 *"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
        			 */
                    var excdes = "";
                    if (textStatus != "success") {
                        LoginLog.LogError("method=checkUserNameExists&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                    }
                },
                dataType: "jsonp"

            })
            return false
        }
    });
    //�����˺���֤email
    validate("#registForm", "realEmail", {
        //"����δ��д": function( node ){
        //    return /^\s*$/.test(node.value)
        //},
        "������д���������": function(node) {
            //return !/^(\w)+(\.\w+)*@(\w)+\.(com|net|cn|org)$/.test(node.value)
            if (node.value != '') {
                return !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(node.value)
            }
            return false;
        },
        "Ŀǰֻ֧��.com .net .cn .org��׺������": function(node) {
            if (node.value != '') {
                return !/^(\w)+(\.\w+)*@(\w)+\.(com|net|cn|org|com.cn|net.cn)$/.test(node.value.toLowerCase())
            }
            return false;
        }
    })

    //=====================================================================
    // ���˵Ľ���
    //=====================================================================
    //�����ֻ���֤��
    var isSendSMSCode = false;
    $("#registForm").delegate("#js_get_phone", "click", function(e) {
        if ($("#js_get_phone").hasClass("wait") && !$("#js_get_phone").hasClass("smscodesendloop") && $("#validateCode").val().length == 6) {
            var url = getRequestUrl($.CONFIGS.url_reg + "/user/register/checkcode-intime.jsonp");
            var validCode = $("#validateCode").val();

            if (lastValidateCode != "") {
                var obj = document.getElementById("mobileTip");
                var tip = obj.getElementsByTagName("p");
                var smscode = document.getElementById("js_get_phone").className;
                if (validCode == lastValidateCode) {
                    if (tip[1].style.display == "none" && smscode != "input_expand_btn wait smscodesendloop" && $("#mobile").val().length != 0) {
                        $('#js_get_phone').removeClass("wait");
                    }
                    return false;
                } else {
                    //refreshImg();
                    lastValidateCode = "";
                    if (curIndex == "registPhone") {
                        $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 0, "��֤�벻��ȷ");
                    } else {
                        $.Valid.handleTip($("#validateCode1"), "#validateCode1Tip", 0, "��֤�벻��ȷ");
                    }
                    return true;
                }
            }
            $.ajax({
                url: url,
                data: {
                    checkCode: validCode,
                    sessionKey: $.CONFIGS.sessionKey,
                    appId: $.CONFIGS.defaultAppId,
                    areaId: $.CONFIGS.defaultAreaId
                },
                success: function(json) {
                    if (json.return_code == 0) {
                        lastValidateCode = validCode;
                        if (curIndex == "registPhone") {
                            $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 1);
                            var obj = document.getElementById("mobileTip");
                            var tip = obj.getElementsByTagName("p");
                            var smscode = document.getElementById("js_get_phone").className;
                            if (tip[1].style.display == "none" && smscode != "input_expand_btn wait smscodesendloop" && $("#mobile").val().length != 0) {
                                $('#js_get_phone').removeClass("wait");
                                $("#checkCode").css({
                                    'backgroundColor': 'transparent'
                                });
                            }
                        } else {
                            $.Valid.handleTip($("#validateCode1"), "#validateCode1Tip", 1);
                        }
                    } else {
                        LoginLog.LogHpsFailed("method=checkValidateCode&url=" + url + "&validateCode=" + validCode + "&sessionKey=" + $.CONFIGS.sessionKey + "&jsonstatus=" + json.return_code + "&jsonmessage=" + json.return_message);
                        if (curIndex == "registPhone") {
                            if (!isValidateCodehasFocus && $("#validateCode").val().length == 6) {
                                refreshImg();
                            }
                            lastValidateCode = "";
                            $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 0, "��֤�벻��ȷ");
                            $('#js_get_phone').addClass("wait");
                        } else {
                            if (!isValidateCode1hasFocus && $("#validateCode1").val().length == 6) {
                                refreshImg();
                            }
                            lastValidateCode = "";
                            $.Valid.handleTip($("#validateCode1"), "#validateCode1Tip", 0, "��֤�벻��ȷ");
                        }
                    }
                },
                timeout: 10000,
                error: function(XMLHttpRequest, textStatus, errorThrown) {

                    //"success", "notmodified", "error", "timeout", "abort", or "parsererror"

                    if (textStatus != "success") {
                        LoginLog.LogError("method=checkValidateCode&url=" + url + "&validateCode=" + validCode + "&sessionKey=" + $.CONFIGS.sessionKey + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                    }
                    refreshImg();
                    lastValidateCode = "";
                    $.Valid.handleTip($("#validateCode"), "#validateCodeTip", 0, "��֤�벻��ȷ");
                },
                dataType: "jsonp"
            });
        }
        var obj1 = document.getElementById("mobileTip");
        var div1 = obj1.getElementsByTagName("p");
        var obj2 = document.getElementById("validateCodeTip");
        var div2 = obj2.getElementsByTagName("p");
        var validcode = $("#password").val();
        if (div1[1].style.display != "none" || (div2[1].style.display != "none" && "" != validcode)) {
            return false;
        }
        $("#registForm :input:visible").each(function() {
            if ($(this).is("#password")) {
                return false;
            }
            $(this).focus()
        })
        if (div1[1].style.display != "none" || div2[1].style.display != "none") {
            return false;
        }
        if (!$("#js_get_phone").hasClass("wait")) {
            $(".expand_tip").stop(true, true).animate({
                opacity: 0
            }, 700, function() {
                $(this).hide()
            });
            var node = $(this);
            if ($(".selcountry").is(":visible")) {
                var mobile = $("#country_code").html() + $("#mobile").val();
            } else {
                var mobile = $("#mobile").val();
            }

            if (!isChangePwdMode) {
                sendSMSCodeUrl = getRequestUrl($.CONFIGS.url_reg + "/user/register/confirm-needed-mobile.jsonp");
                sendSMSCodeData = {
                    appId: $.CONFIGS.defaultAppId,
                    areaId: $.CONFIGS.defaultAreaId,
                    mobile: mobile,
                    productId: 12,
                    sessionKey: $.CONFIGS.sessionKey,
                    validateCode: $("#validateCode").val(),
                    password: $("#password").val(),
                    realname: $("#realname").val(),
                    idCard: $("#idCard").val(),
                    backUrl: $.CONFIGS.serviceUrl
                }
            } else {
                sendSMSCodeUrl = getRequestUrl($.CONFIGS.url_reg + "/user/register/sendchangepwdsms.jsonp");
                sendSMSCodeData = {
                    appId: $.CONFIGS.defaultAppId,
                    areaId: $.CONFIGS.defaultAreaId,
                    mobile: mobile
                }
            }
            $.ajax({
                url: sendSMSCodeUrl,
                data: sendSMSCodeData,
                success: function(json) {
                    ViewEvent_SendSMSCode(json);
                    if (json.status != 0) {
                        LoginLog.LogHpsFailed("method=sendSMSCode&url=" + sendSMSCodeUrl + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                    }
                    //refreshImg();
                    lastValidateCode = "";
                },
                timeout: 10000,
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    var excdes = "";
                    if (textStatus != "success") {
                        LoginLog.LogError("method=sendSMSCode&url=" + sendSMSCodeUrl + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                    }
                    //��һ�γ��ִ�����Ҫ����
                    $.ajax({
                        url: sendSMSCodeUrl,
                        data: sendSMSCodeData,
                        success: function(json) {
                            ViewEvent_SendSMSCode(json);
                            if (json.status != 0) {
                                LoginLog.LogHpsFailed("method=sendSMSCode&url=" + sendSMSCodeUrl + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                            }
                        },
                        timeout: 10000,
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            var excdes = "";
                            if (textStatus != "success") {
                                LoginLog.LogError("method=sendSMSCode&url=" + sendSMSCodeUrl + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                            }
                        },
                        dataType: "jsonp"

                    })

                },
                dataType: "jsonp"

            })
        }
    })

    function ViewEvent_SendSMSCode(json) {
        var returnCode = 0;
        if (isChangePwdMode) {
            returnCode = json.return_code;
        } else {
            returnCode = json.status;
        }
        if (returnCode == 0) {
            var node = $("#js_get_phone");
            if (isChangePwdMode) {
                $.CONFIGS.requestId = json.sessionKey;
            } else {
                $.CONFIGS.requestId = json.requestId;
            }
            $("#checkCode").attr("readonly", false);
            //$("#checkCode").css({'backgroundColor':'transparent'})
            isSendSMSCode = true;
            $("#checkCodeTip").find('.tipsInfo').html('����д�����е�6λ���֣��ղ���������');
            node.addClass("wait");
            node.addClass("smscodesendloop");
            var i = 61;
            var timer = setInterval(function() {
                i--;
                if (i == 0) {
                    if ($("#js_get_phone").hasClass("smscodeloopchange")) {
                        node.text("��ѻ�ȡ��֤��");
                    } else {
                        node.text("�ٴλ�ȡ��֤��");
                    }
                    node.removeClass("smscodeloopchange");
                    node.removeClass("smscodesendloop");
                    node.removeClass("wait")

                    clearInterval(timer);
                    return false;
                }
                var text = i + "�����ٴλ�ȡ";
                node.text(text);
            }, 1000)
            //Ϊ����ʱ����־��������Ҫ����ʱ���¼,�ɹ������ֻ���֤��,BY PXM
            time_BeginSMS = new Date().getTime();
            $.Valid.handleTip($(".checkCode")[0], "#checkCodeTip", 4, "��֤���ѷ�����ע����ն���")
        } else {
            var message = $.CONFIGS.message[returnCode];
            if (typeof (message) == "undefined") {
                if (isChangePwdMode) {
                    message = json.return_message;
                } else {
                    message = json.message;
                }

            }
            if (returnCode == -10285101) {
                $.Valid.handleTip($(".mobile")[0], "#mobileTip", 0, "�ú�����ע�ᣡ����" + loginTip + "��" + findPwdTip.replace('{username}', nowUserAccount))
            } else if (returnCode == -10515903) {
                message = "ͼƬ��֤����д����";
                $.Valid.handleTip($(".validateCode")[0], "#validateCodeTip", 0, message)
            } else {
                $.Valid.handleTip($(".checkCode")[0], "#checkCodeTip", 0, message)
            }
        }
    }

    //��ȡͼƬ��֤��
    function refreshImg() {
        url = getRequestUrl($.CONFIGS.url_reg + "/user/validate-code.jsonp");
        data = {
            appId: $.CONFIGS.defaultAppId,
            areaId: $.CONFIGS.defaultAreaId,
            backUrl: $.CONFIGS.serviceUrl
        };
        $.ajax({
            url: url,
            data: data,
            success: function(json) {
                ViewEvent_RefreshImg(json);
                if (json.status != 0) {
                    LoginLog.LogHpsFailed("method=getValidateCode&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                }
            },
            timeout: 10000,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                /*
    			 *"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
    			 */
                if (textStatus != "success") {
                    LoginLog.LogError("method=getValidateCode&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                }
                //Ϊ֧�����Լ�http/https���
                useHttps = false;
                $.ajax({
                    url: getRequestUrl(url),
                    data: data,
                    success: function(json) {
                        ViewEvent_RefreshImg(json);
                        if (json.status != 0) {
                            LoginLog.LogHpsFailed("method=getValidateCode&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                        }
                    },
                    timeout: 10000,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        /*
    	    			 *"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
    	    			 */
                        if (textStatus != "success") {
                            LoginLog.LogError("method=getValidateCode&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                        }
                    },
                    dataType: "jsonp"
                })
            },
            dataType: "jsonp"
        })
    }
    //ˢ����֤��ľ�����Ϊ
    function ViewEvent_RefreshImg(json) {
        if (json.status == 0) {
            $.CONFIGS.sessionKey = json.sessionKey;
            $("#imgCode").attr("src", json.imgSrc);
            $("#imgCode1").attr("src", json.imgSrc);
            if (json.isNeedValidateCode == false) {
                needVerifyCode = false;
                $("#verifyCode").hide();
                $("#verifyCode1").hide();
                $(".mod_regist").removeClass("with_code");
            } else {
                needVerifyCode = true;
                //ֻ�з��ֻ�ע�����Ҫ����
                if (curIndex != "registPhone") {
                    if (!$(".mod_regist").hasClass("with_code")) {
                        $(".mod_regist").addClass("with_code");
                    }
                    $("#verifyCode1").show();
                } else {
                    if (!$(".mod_regist").hasClass("with_code")) {
                        $(".mod_regist").addClass("with_code");
                    }
                    $("#verifyCode").show();
                }
            }
        }
    }
    //��ȡ��֤����Ϣ
    refreshImg();
    setInterval(refreshImg, 180000)
    $("#reVerify").click(function(e) {
        e.preventDefault();
        refreshImg();
    })

    $("#reVerify1").click(function(e) {
        e.preventDefault();
        refreshImg();
    })

    //ͳһˢ�£����ڳ��ִ����ˢ��
    function globalRefresh() {
        if ($("#div_ErrorInfo").is(":visible")) {
            $("#div_ErrorInfo").hide();
            $("#div_Register").show();
        }
        refreshImg();
        $('#checkCode').val('');
    }

    $('.err_refresh').bind('click', function() {
        globalRefresh();
    });

    function setLoginState(vKey, url) {
        loginUrl = getRequestUrl($.CONFIGS.url_login + "/authen/rltLogin.jsonp");
        loginData = {
            authenSource: 2,
            customSecurityLevel: 2,
            productId: 1,
            reset: 1,
            version: 21,
            appId: $.CONFIGS.defaultAppId,
            areaId: $.CONFIGS.defaultAreaId,
            vkey: vKey,
            serviceUrl: $.CONFIGS.serviceUrl
        };
        $.ajax({
            url: loginUrl,
            data: loginData,
            success: function(json) {
                ViewEvent_SetLoginState(url);
                if (json.status != 0) {
                    LoginLog.LogHpsFailed("method=setLoginState&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                }
            },
            timeout: 10000,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                common_log("setLoginStateError=" + nowUserAccount + '^$^' + jqXHR.status)
                var excdes = "";
                if (textStatus != "success") {
                    LoginLog.LogError("method=setLoginState&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                }
                //��һ�γ��ִ�����Ҫ����
                $.ajax({
                    url: loginUrl,
                    data: loginData,
                    success: function(json) {
                        ViewEvent_SetLoginState(url);
                        if (json.status != 0) {
                            LoginLog.LogHpsFailed("method=setLoginState&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                        }
                    },
                    timeout: 10000,
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        common_log("setLoginStateError=" + nowUserAccount + '^$^' + jqXHR.status)
                        var excdes = "";
                        if (textStatus != "success") {
                            LoginLog.LogError("method=setLoginState&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                        }

                        if (locationTarget == 'top') {
                            parent.location.replace(url);
                        } else {
                            location.replace(url);
                        }
                    },
                    dataType: "jsonp",
                    jsonpCallback: "rltLogin_JSONPMethod"
                })
            },
            dataType: "jsonp",
            jsonpCallback: "rltLogin_JSONPMethod"
        })
    }

    function ViewEvent_SetLoginState(url) {
        //common_log("setLoginStateOK=" + nowUserAccount)
        if (locationTarget == 'top') {
            parent.location.replace(url);
        } else {
            location.replace(url);
        }
    }

    //����ע�᷽ʽ
    $("#submit").click(function() {
        if (isChangePwdMode && curIndex == "registPhone" && !$(".selcountry").is(":visible")) {
            if ($.Valid.nodes.length != 0) {
                return false;
            }
            $("#registForm :input:visible").each(function() {
                $(this).focus()
            })
            if ($.Valid.nodes.length != 0) {
                return false;
            }
            $(".mod_regist_form_submit2").show();
            $(".mod_regedphone").show();
            $("#mod_regist_form_submit").hide();
            return;
        }
        doSubmit();
    });

    $("#close_btn_regedphone").bind("click", function() {
        $(".mod_regist_form_submit2").hide();
        $(".mod_regedphone").hide();
        $("#mod_regist_form_submit").show();
    })

    function agrCheck() {
        if (document.getElementById("agr_chk").checked) {
            var isconfirm = confirm("����ϸ�Ķ��û�Э�鲢ȷ���Ƿ���ܡ�Ҫ���ܲ�ע����");
            return isconfirm;
        } else {
            alert("����ϸ�Ķ��û�Э�鲢ȷ���Ƿ����");
            return false;
        }
    }

    function doSubmit() {
        if ($.Valid.nodes.length != 0) {
            return false;
        }
        $("#registForm :input:visible").each(function() {
            if (!(curIndex == "registPhone" && $(this).is("#validateCode"))) {
                $(this).focus()
            }
        })
        if ($.Valid.nodes.length != 0) {
            return false;
        }

        if (!agrCheck()) {
            return false;
        }

        var data = {
            appId: $.CONFIGS.defaultAppId,
            areaId: $.CONFIGS.defaultAreaId,
            advfrom: $.CONFIGS.advfrom,
            password: $("#password").val(),
            realname: $("#realname").val(),
            idCard: $("#idCard").val()
        }, regSuccHref, url, isNeedLogin = false
        var accountType = "mobile";
        if (isChangePwdMode && curIndex == "registPhone" && !$(".selcountry").is(":visible")) {
            data.validateCode = $("#checkCode").val(),
            data.sessionKey = $.CONFIGS.requestId,
            data.mobile = $("#mobile").val();
            accountType = "mobile";
            mobileType = "mobile";
            url = getRequestUrl($.CONFIGS.url_reg + "/user/register/checkandchangepwd.jsonp");
            regSuccHref = $.CONFIGS.base_url + "/register/phoneSucc?serviceUrl=" + encodeURIComponent($.CONFIGS.serviceUrl) + "&locationTarget=" + $.CONFIGS.locationTarget + "&phone=" + encodeURIComponent(data.mobile)
            regSuccHref = regSuccHref + "&mobileType=" + mobileType;
            if (needLogin == 1) {
                isNeedLogin = true;
            }
        } else {
            switch (curIndex) {
            case "registPhone":
                //�ֻ�
                accountType = "mobile";
                mobileType = "mobile";
                url = getRequestUrl($.CONFIGS.url_reg + "/user/register/confirm-needed-mobile/validation.jsonp")
                if ($(".selcountry").is(":visible")) {
                    data.mobile = $("#country_code").html() + $("#mobile").val();
                    accountType = "abroadmobile";
                    mobileType = "abroadmobile";
                } else {
                    data.mobile = $("#mobile").val();
                }
                data.preRequestId = $.CONFIGS.requestId
                data.validateCode = $("#checkCode").val()
                data.backUrl = $.CONFIGS.serviceUrl
                regSuccHref = $.CONFIGS.base_url + "/register/phoneSucc?serviceUrl=" + encodeURIComponent($.CONFIGS.serviceUrl) + "&locationTarget=" + $.CONFIGS.locationTarget + "&phone=" + encodeURIComponent(data.mobile)
                regSuccHref = regSuccHref + "&mobileType=" + mobileType;
                if (needLogin == 1) {
                    isNeedLogin = true;
                }
                break;
            case "registMail":
                //����
                accountType = "email";
                url = getRequestUrl($.CONFIGS.url_reg + "/user/register/confirm-needed-email.jsonp")
                // ???
                data.email = $("#email").val()
                data.sessionKey = $.CONFIGS.sessionKey
                data.backUrl = $.CONFIGS.base_url + "/register/EmailConfirm?serviceUrl=" + encodeURIComponent($.CONFIGS.serviceUrl) + "&locationTarget=" + $.CONFIGS.locationTarget + "&customerAcc=" + data.email + "&accountType=email&emailResultNewId=1"
                if ($.CONFIGS.zb_type == 1) {
                    data.backUrl = data.backUrl + "&zb_type=1";
                }
                if (typeof $.CONFIGS.css_url != "undefined") {
                    data.backUrl = data.backUrl + "&css_url=" + $.CONFIGS.css_url;
                }

                $("#validateCode1").val() && (data.validateCode = $("#validateCode1").val())
                var curUrl = location.href;
                //��ȡ��ǰurl��ַ
                var firstIndex = curUrl.indexOf("?");
                var paraString = "";
                if (firstIndex > 0) {
                    paraString = curUrl.substring(firstIndex + 1);
                }
                regSuccHref = $.CONFIGS.base_url + "/register/emailSucc?email=" + data.email
                regSuccHref = regSuccHref + "&paraString=" + encodeURIComponent(paraString);
                break;
            case "registCustom":
                accountType = "username";
                url = getRequestUrl($.CONFIGS.url_reg + "/user/register/username.jsonp")
                data.username = $("#username").val()
                data.mobile = $("#mobile").val()
                data.sessionKey = $.CONFIGS.sessionKey
                data.email = $("#realEmail").val()
                if ("undefined" == typeof data.email) {
                    data.email = $("#email").val()
                }
                data.backUrl = $.CONFIGS.serviceUrl
                $("#validateCode1").val() && (data.validateCode = $("#validateCode1").val())
                regSuccHref = $.CONFIGS.base_url + "/register/AccountSucc?serviceUrl=" + encodeURIComponent($.CONFIGS.serviceUrl) + "&locationTarget=" + $.CONFIGS.locationTarget + "&customerAcc=" + data.username
                if (needLogin == 1) {
                    isNeedLogin = true;
                }
                break;
            }
        }
        data.isInner = 1;
        //�����regSuccHref�ɹ�ҳ��ַ��ͳһ��������
        regSuccHref = regSuccHref + "&appId=" + data.appId + "&areaId=" + data.areaId;
        if (actId != -1) {
            regSuccHref = regSuccHref + "&actId=" + actId;
            if (curIndex == "registMail") {
                data.backUrl = data.backUrl + "&appId=" + data.appId + "&areaId=" + data.areaId + "&actId=" + actId;
            }
        }
        if (directTarget == 1 && curIndex != "registMail") {
            regSuccHref = regSuccHref + "&directTarget=" + directTarget;
        }
        if (pageType != '') {
            regSuccHref = regSuccHref + "&pageType=" + pageType;
        }
        if (cssId != '') {
            regSuccHref = regSuccHref + "&cssId=" + cssId;
        }
        regSuccHref = regSuccHref + "&accountType=" + accountType;

        if ($.CONFIGS.zb_type == 1) {
            regSuccHref = regSuccHref + "&zb_type=1";
        }

        if (typeof $.CONFIGS.css_url != "undefined") {
            regSuccHref = regSuccHref + "&css_url=" + $.CONFIGS.css_url;
        }

        //��ʼִ��ע�Ṧ��
        $.ajax({
            url: url,
            data: data,
            timeout: 10000,
            success: function(json) {
                if (json.status == 0) {
                    regSuccHref = regSuccHref + "&requestId=" + json.requestId
                    if (isNeedLogin) {
                        setLoginState(json.vKey, regSuccHref)
                    } else {
                        if (locationTarget == 'top') {
                            parent.location.replace(regSuccHref);
                        } else {
                            location.replace(regSuccHref);
                        }
                    }
                    //Ϊ����ʱ����־��������Ҫ����ʱ���¼,BY PXM
                    time_EndReg = new Date().getTime();
                    //curIndex ����ע�᷽ʽ
                    var userName;
                    switch (curIndex) {
                    case "registPhone":
                        //�ֻ�
                        userName = data.mobile;
                        break;
                    case "registMail":
                        //����
                        userName = data.email;
                        break;
                    case "registCustom":
                        userName = data.username;
                        break;
                    }
                    LoginLog.Log('Register&RegType=' + curIndex + '&time_BeginReg=' + time_BeginReg + '&time_EndReg=' + time_EndReg + '&UserName=' + userName);

                } else {
                    var message = $.CONFIGS.message[json.status];
                    if (typeof (message) == "undefined") {
                        if (isChangePwdMode) {
                            message = json.return_message;
                        } else {
                            message = json.message;
                        }
                    }
                    if (json.status == -10285002) {
                        $.Valid.handleTip($(".checkCode")[0], "#checkCodeTip", 0, message);
                    }
                    if (json.status == -10242004 || json.status == -10242008 || json.status == -10901142 || json.status == -10742136) {
                        $.Valid.handleTip($(".checkCode")[0], "#checkCodeTip", 0, "ϵͳ��ʱ����<a href='javascript:globalRefresh();'>ˢ��</a>");
                    }
                    else if (json.status == -10285101) {} else {
                        $(".call_back_tips").html("<p>" + message + "</p>");
                    }
                    if (curIndex != "registPhone") {
                        refreshImg();
                    }
                    LoginLog.LogHpsFailed("method=register&url=" + url + "&username=" + nowUserAccount + "&jsonstatus=" + json.status + "&jsonmessage=" + json.message);
                }
            },
            timeout: 10000,
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                /*
    			 *"success", "notmodified", "error", "timeout", "abort", or "parsererror" 
    			 */
                var excdes = "";
                if (textStatus != "success") {
                    LoginLog.LogError("method=register&url=" + url + "&username=" + nowUserAccount + "&textStatus=" + textStatus + "&message=" + errorThrown.message + "&description=" + errorThrown.description);
                }
                //$(".call_back_tips").html("<p>����ʱ</p>");
                $('#div_ErrorInfo').show();
                $('#div_Register').hide();
            },
            dataType: "jsonp"
        })
        setTimeout(function() {
            $(".call_back_tips").html("");
        }, 10000)
    }

    //�޸�����ע�᷽ʽ
    $("#submit_goon").click(function() {
        doSubmit();
    });

    //=====================================================================
    // ��תľ��
    //=====================================================================

    /*slider*/
    function slider(id) {
        var $slider = $("#" + id);
        var $ul = $("#" + id + " ul");
        var $li = $("#" + id + " li");
        var $LiLeft = $li.width();
        var $LiLast, $LiFirst
        $ul.css({
            width: $li.length * $li.width() + "px"
        });
        $slider.children(".prev").click(function() {
            $LiLast = $ul.find("li").last();
            if (!$li.is(":animated")) {
                $LiLast.insertBefore($ul.find("li").first());
                $li.css({
                    left: "-" + $LiLeft + "px"
                });
                $li.animate({
                    left: 0
                }, 800, function() {
                    $li.css({
                        left: 0
                    });
                });
            }
        });
        $slider.children(".next").click(function() {
            $LiFirst = $ul.find("li").first();
            if (!$li.is(":animated")) {
                $li.animate({
                    left: "-" + $LiLeft + "px"
                }, 800, "swing", function() {
                    $LiFirst.insertAfter($ul.find("li").last());
                    $li.css({
                        left: 0
                    });
                });
            }
        });
    }
    slider("SideBnerSlider");

    //=====================================================================
    // ��֤������
    //=====================================================================
    $("#verifyCode .inputBox").live({
        mouseenter: function() {
            $(this).parent().addClass("hover");
            $("#imgCode").addClass("bigImgCode");
            if ($("#validateCodeTip").find(".tipsInfo").is(":visible") || $("#validateCodeTip").find(".tipsError").is(":visible")) {
                $("#imgCode").addClass("bigImgCode2");
            }
        },
        mouseleave: function() {
            if (!$(this).find("input").is(":focus")) {
                $(this).parent().removeClass("hover");
                $("#imgCode").removeClass("bigImgCode");
                $("#imgCode").removeClass("bigImgCode2");
            }
        }
    });
    $("#verifyCode input").live("blur", function() {
        if (!$(this).parent().hasClass("hover")) {
            $("#imgCode").removeClass("bigImgCode");
            $("#imgCode").removeClass("bigImgCode2");
        }
    });

    $("#verifyCode1 .inputBox").live({
        mouseenter: function() {
            $(this).parent().addClass("hover");
            $("#imgCode1").addClass("bigImgCode");
            if ($("#validateCode1Tip").find(".tipsInfo").is(":visible") || $("#validateCode1Tip").find(".tipsError").is(":visible")) {
                $("#imgCode1").addClass("bigImgCode2");
            }
        },
        mouseleave: function() {
            if (!$(this).find("input").is(":focus")) {
                $(this).parent().removeClass("hover");
                $("#imgCode1").removeClass("bigImgCode");
                $("#imgCode1").removeClass("bigImgCode2");
            }
        }
    });
    $("#verifyCode1 input").live("blur", function() {
        if (!$(this).parent().hasClass("hover")) {
            $("#imgCode1").removeClass("bigImgCode");
            $("#imgCode1").removeClass("bigImgCode2");
        }
    });

    //=====================================================================
    // ��ҳ����tips
    //=====================================================================
    $("#popup_Contrast .tip").live({
        mouseenter: function() {
            var tips = $("#popup_Contrast .phoneTips");
            var pLeft = $(this).position().left;
            var pTop = $(this).position().top;

            tips.css({
                left: pLeft + 15,
                top: pTop - 30
            }).show();
            tips.children(".tipsArrow").css({
                left: 57
            })
            tips.find(".info").html("���ֻ���֧��");
        },
        mouseleave: function() {
            $("#popup_Contrast .phoneTips").hide();
        }
    });
    $("#popup_Contrast .notFoget, #popup_Contrast .safe").live({
        mouseenter: function() {
            $(this).find(".tipsCon").show();
            $(this).find(".block").hide();
            $(this).find(".tipsArrow_hover").addClass("out_opa");
            $(this).find(".tipsCon").addClass("out_opa2");
            $(this).find(".tipsCon").addClass("tips_opa");
        },
        mouseleave: function() {
            $(this).find(".tipsCon").hide();
            $(this).find(".block").show();
            $(this).find(".tipsArrow_hover,.tipsCon").removeClass("out_opa");
            $(this).find(".tipsCon").removeClass("out_opa2");
            $(this).find(".tipsCon").removeClass("tips_opa");
        }
    });
    $("#popup_Contrast table").live("mouseenter", function() {
        $(this).find(".notFoget .tipsArrow").removeClass("large");
        $(this).find(".notFoget .tipsCon").hide();
        $(this).find(".notFoget .block").show();
        $("#popup_Contrast .phoneTips").hide();
    });
})

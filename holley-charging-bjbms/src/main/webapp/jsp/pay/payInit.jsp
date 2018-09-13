﻿
<html>
<head>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>
        充值
    </title>
    <style>
        .input_text {
            padding: 10px 10px;
            border: 1px solid #d5d9da;
            border-radius: 5px;
            box-shadow: 0 0 5px #e8e9eb inset;
            width: 100px;
            font-size: 1em;
            outline: 0;
        }

        .input_text:focus {
            border: 1px solid #b9d4e9;
            border-top-color: #b6d5ea;
            border-bottom-color: #b8d4ea;
            box-shadow: 0 0 5px #b9d4e9;
        }

        .button {
            color: #666;
            background-color: #EEE;
            border-color: #EEE;
            font-weight: 300;
            font-size: 16px;
            font-family: "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
            text-decoration: none;
            text-align: center;
            line-height: 40px;
            height: 40px;
            padding: 0 40px;
            margin: 0;
            display: inline-block;
            appearance: none;
            cursor: pointer;
            border: none;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            -webkit-transition-property: all;
            transition-property: all;
            -webkit-transition-duration: .3s;
            transition-duration: .3s;
        }

        .button-primary {
            background-color: #1B9AF7;
            border-color: #1B9AF7;
            color: #FFF;
        }

        .button-primary:visited:visited {
            color: #FFF;
        }

        .button-primary:hover, .button-primary:focus
        {
            background-color: #4cb0f9;
            border-color: #4cb0f9;
            color: #FFF;
        }

        .button-pill {
            border-radius: 200px;
        }

        .alipay_select {
            width: 120px;
            background: url(http://codepay.fateqq.com/img/alipay.jpg) no-repeat 14px 0;
        }

        .qqpay_select {
            width: 130px;
            background: url(http://codepay.fateqq.com/img/qqpay.jpg) no-repeat 14px 0;
        }

        .wechat_select {
            width: 120px;
            background: url(http://codepay.fateqq.com/img/weixin.jpg) no-repeat 16px 0;

        }

        .type_select {
            float: left;
            padding: 1px;
            margin: 5px 5px 0px 0px;

            border: 1px solid #80C5FF;
            color: #0061F3;
            font-size: 13px;
            padding: 5px;
            margin-left: 0px;
            float: left;
            padding-left: 2px;
            padding-right: 20px;
            padding-top: 14px;
            height: 20px;
        }
    </style>
</head>
<body>
<form name="form1" id="form1" method="get" action="bjbms/user/alipay.action">
    <div>
        <table width="550" border="0" align="center" cellpadding="8" cellspacing="1" bgcolor="#ffffff">
            <tbody>
            <tr>
                <td colspan="2">
                    <div align="center"><strong>在线支付</strong></div>
                </td>
            </tr>
            <!--          注释以下代码 可禁止自己输入价格-->
            <tr>
                <td>
                    <div align="right">金额：</div>
                </td>

                <td>
                	<input name="total_amount" id="total_amount" type="text" value="${total_amount}"  readonly="readonly" class="input_text"> 元
                	<input name="out_trade_no" id="out_trade_no" type="hidden" value="${out_trade_no}">
                </td>
                    
            </tr>
            
            <!--              注释结束位置            -->
<!--             <tr>
                <td>
                    <div align="right">用户：</div>
                </td>

                <td><input name="pay_id" id="pay_id" type="text" value="" class="input_text"
                           style=" width:200px;"   ></td>

            </tr> -->
            <tr>
                <td>
                    <div align="right">支付：</div>
                </td>
                <td>
                	<label>
                        <div class="type_select alipay_select">
                            <input type="radio" name="type" value="1" checked="checked">
                        </div>
                    </label>
                   <!--  <label>
                        <div class="type_select wechat_select">
                            <input type="radio" name="type" value="3">
                        </div>
                    </label> -->
                    <!-- <label>
                        <div class="qqpay_select type_select">
                            <input type="radio" name="type" value="2">
                        </div>
                    </label> -->
                </td>
            </tr>
          
            <tr>
                <td>
                    <div align="right"></div>
                </td>
                <td><label>
                        <input type="submit"  id="Submit" class="button button-pill button-primary"
                               value="支付宝支付">

                    </label></td>
            </tr>
            </tbody>
        </table>
    </div>
</form>
<script src="http://codepay.fateqq.com/js/jquery-1.10.2.min.js"></script>

<script type="text/javascript">
    var type = document.getElementsByName('type');
    var price = document.getElementById('price');
    var money = document.getElementById('money');
    var FormSubmit = document.getElementById('Submit');
    for (var i = 0; i < type.length; i++) {
        type[i].onclick = function () {
            switch (parseInt(this.value)) {
                case 1:
                    FormSubmit.value = '支付宝支付';
                    break;
                case 2:
                    FormSubmit.value = 'QQ钱包支付';
                    break;
                case 3:
                    FormSubmit.value = '微信支付';
                    break;
                default:
                    FormSubmit.value = '支付宝支付';
            }
        }
    }
/*     $(".w-pay-money").click(function () {
        $(".w-pay-money").removeClass('w-pay-money-selected');
        $(this).addClass('w-pay-money-selected');
        price.value = $(this).attr('data');
        money.value = $(this).attr('data');
    }); */
    
</script>
</body>
</html>

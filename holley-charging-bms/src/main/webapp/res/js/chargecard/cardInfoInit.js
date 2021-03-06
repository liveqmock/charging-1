//充电卡操作
var cardOcx;
var isOpen=false;
var READ_CARDINFO = "readCardInfo"; // 读卡信息
var REGISTER_CARD = "registerCard"; // 开卡
var searchCardInfoUrl = "person/cardManager_searchCardInfo.action";//查询充电卡信息接口
var operaType={"openCard":"1","rechargeCard":"2","unLockCard":"3",
				"getBadRecordCard":"4","setPasswordCard":"5","getInfoCard":"6","getUsableMoneyCard":"7"
				};
var defaultPwd = "123456";
var resultCode={"0":"正确","1":"有必填参数为空","2":"有参数长度不符合函数要求","5":"连接DE620用户卡失败",
				"600":"连接DE620ISAM卡失败","999":"取随机数错误","101":"打开T6主卡槽错误","102":"打开T6侧卡槽错误",
				"103":"选ESAN母卡MF失败","104":"选ESAMMF失败","105":"读ESAM母卡标识文件失败","106":"主卡槽插入非法卡",
				"107":"读ESAM标识文件失败","108":"侧卡槽插入非法卡","109":"更新ESAM终端机编号失败","110":"建ESAM应用文件失败",
				"111":"选择母卡ESAM应用文件失败","112":"建立母卡ESAM文件失败","113":"选择ESAM应用文件失败","114":"装载35密钥失败",
				"452":"校验PIN失败","501":"重装PIN失败","463":"校验PIN失败"
				};
/**
 * 根据类型获取返回值
 */
function getReslutByType(type){
	tempObj = {};
	switch(type){
	case "1":alert(type);break;
	case "2":alert(type);break;
	case "3":alert(type);break;
	case "4":alert(type);break;
	case "5":alert(type);break;
	case "6":tempObj.cardNo = cardOcx.cardNO;tempObj.busNo = cardOcx.result1;
			 temp = cardOcx.result2;tempStr = temp.split("$$");
			 tempObj.realName = tempStr[0];tempObj.sex = tempStr[1];tempObj.userCardNo = tempStr[2];
			 tempObj.phone = tempStr[3];tempObj.email = tempStr[4];
			 break;
	case "7":tempObj.cardUsableMoney = cardOcx.result1/100;break;
	default:alert("未知操作！！");
	}
	return tempObj;
}
/*
 * 开卡
 * long OpenCard(LPCTSTR password, LPCTSTR startDate, LPCTSTR endDate, LPCTSTR useName, LPCTSTR certificateNo, LPCTSTR phoneNo, LPCTSTR emailAddr, LPCTSTR userSex)
 */
function openCard(password,startDate,endDate,realName,userCardNo,phone,email,sex){
	return cardOcx.OpenCard(password,startDate,endDate,realName,userCardNo,phone,email,sex);
}
/*
 * 充值
 * long Charge(LPCTSTR password, LPCTSTR chargeDate, long money)
 * chargeDate:YYYYMMDDHHMMSS
 * money:充值金额，单位：分
 */
function rechargeCard(password,reChargeDate,money){
	return cardOcx.Charge(password,reChargeDate,money);	
}
/*
 * 解灰
 * long UnLock(LPCTSTR password, LPCTSTR recordNo, LPCTSTR chargeDate, long money)
 */
function unLockBadRecord(password,recordNo,chargeDate,money){
	return cardOcx.UnLock(password,recordNo,chargeDate,money);	
}
/*
 * 获取灰色记录
 * long GetGreyRecord(LPCTSTR password)
 */
function getBadRecord(password){
	return cardOcx.GetGreyRecord(password);	
}

/*
 * 设置密码
 * long SetCardPassword(LPCTSTR newPassword)
 */
function resetCardPwd(newPassword){
	return cardOcx.SetCardPassword(newPassword);
}

/*
 * 获取卡信息
 * long GetUserInfo()
 */
function getCardInfo(){
	return cardOcx.GetUserInfo();
}

/*
 * 获取卡余额
 * long GetBalance(LPCTSTR password)
 */
function getCardUsableMoney(password){
	if(password){
		return cardOcx.GetBalance(password);	
	}else{
		return cardOcx.GetBalance(defaultPwd);	
	}
	
}



/*
 * 检查OCX函数调用结果返回结果码
 */
function checkCardResult(code,isNotShowInfo){
	if("0" == code){
		return true;
	}else{
		if(isNotShowInfo){
			return false;
		}else{
			result = resultCode[code];
			if(result){
				showInfo(result);	
			}else{
				showInfo("未知结果code："+code+"！！");		
			}
			return false;
		}
		
	}
}
/**
 * 异步获取数据库充电卡信息
 * @param cardNo充电卡号
 */
function searchCardInfo(cardNo,type){
	$.post(searchCardInfoUrl,{"cardNo":cardNo,"type":type},function(data){
		if("success" == data.map.msg){
			if(type == READ_CARDINFO){
				$("#startTime").val( data.map.cardInfo.startTimeDesc);
				$("#endTime").val( data.map.cardInfo.endTimeDesc);
				$("#rechargeBtn").attr("disabled",false);
				$("#checkBadRcordBtn").attr("disabled",false);
				$("#readCardUsableBtn").attr("disabled",false);
				$("#goChangePwdBtn").attr("disabled",false);
			}else if(type == REGISTER_CARD){
				$("#saveBtn").attr("disabled",false);
			}
			
		}else{
			showInfo(data.map.msg);
		}
		
	})
}

/**
 * 异步获取数据库充电卡信息
 * @param cardNo充电卡号
 */
function searchCardInfoForRegisterCard(cardNo){
	$.post(searchCardInfoUrl,{"cardNo":cardNo},function(data){
		if("success" == data.map.msg){
			$("#saveBtn").attr("disabled",false);
			$("#")
		}else{
			showInfo(data.map.msg);
		}
		
	})
}
/**
 * 开卡初始化
 */
function registerCardInit(){
	rs = false;
	cardOcx = document.getElementById("chargeCardOcx");//初始化OCX控件
	if(!cardOcx){
		//showInfo("初始化控件失败！！");
		return rs;
	}
	try{
		code = getCardInfo();	
	}catch(e){
		//showInfo("初始化控件失败！！");
		return rs;
	}
	if(checkCardResult(code)){
		cardInfoObj = getReslutByType(operaType.getInfoCard);
		cardNo = cardInfoObj.cardNo;
		busNo = cardInfoObj.busNo;
		if(isEmpty(cardNo)){
			showInfo("读取卡号失败！！");	
		}else if(isEmpty(busNo)){
			showInfo("读取运营商编号失败！！");	
		}else{
			rs=true;
			$("#busNo").val(busNo);
			$("#chargeCardNo").val(cardNo);
		}
	}
	return rs;
}
//读取卡信息初始化
function checkCardInit(){
	rs = false;
	cardOcx = document.getElementById("chargeCardOcx");//初始化OCX控件
	if(!cardOcx){
		//showInfo("初始化控件失败！！");
		return rs;
	}
	try{
		code = getCardInfo();	
	}catch(e){
		//showInfo("初始化控件失败！！");
		return rs;
	}
	
	if(checkCardResult(code)){
		cardInfoObj = getReslutByType(operaType.getInfoCard);
		cardNo = cardInfoObj.cardNo;
		busNo = cardInfoObj.busNo;
		if(isEmpty(cardNo)){
			showInfo("读取卡号失败！！");	
		}else if(isEmpty(busNo)){
			showInfo("读取运营商编号失败！！");	
		}else{
			realName = cardInfoObj.realName;
			sex = cardInfoObj.sex;
			userCardNo = cardInfoObj.userCardNo;
			phone = cardInfoObj.phone;
			email = cardInfoObj.email;
			$("#realName").val(realName);
			$("#phone").val(phone);
			$("#email").val(email);
			$("#userCardNo").val(userCardNo);
			$("#busNo").val(busNo);
			$("#chargeCardNo").val(cardNo);
			if("男" == sex){
				$("#sex1").attr("checked",true);
			}else if("女" == sex){
				$("#sex2").attr("checked",true);
			}
			//自动读取卡余额
			if(checkCardResult(getCardUsableMoney(),true)){
				$("#usableMoney").val(getReslutByType(operaType.getUsableMoneyCard).cardUsableMoney);
			}else{
				$("#usableMoney").val("未知");
			}
			//自动读取卡余额
			rs=true;
		}
		
	}
		
	
	return rs;
}
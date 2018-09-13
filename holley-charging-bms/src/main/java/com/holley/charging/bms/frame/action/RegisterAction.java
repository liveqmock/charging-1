package com.holley.charging.bms.frame.action;

import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.holley.charging.action.BaseAction;
import com.holley.charging.common.ValidateUtil;
import com.holley.charging.model.bus.BusUser;
import com.holley.charging.model.bus.BusUserExample;
import com.holley.charging.service.website.UserService;
import com.holley.common.cache.charging.CacheKeyProvide.KeyMsgCodeTypeEnum;
import com.holley.common.cache.charging.ChargingCacheUtil;
import com.holley.common.constants.Globals;
import com.holley.common.constants.ResultBean;
import com.holley.common.constants.RoleTypeEnum;
import com.holley.common.constants.charge.CertificateStatusEnum;
import com.holley.common.constants.charge.UserTypeEnum;
import com.holley.common.security.SecurityUtil;
import com.holley.common.util.StringUtil;
import com.holley.platform.service.MessageService;
import com.holley.web.common.util.Validator;

public class RegisterAction extends BaseAction {

    private static final long serialVersionUID = 1L;
    private UserService       userService;
    private MessageService    messageService;
    private static final Log  logger           = LogFactory.getLog(RegisterAction.class);

    public String init() {
        return SUCCESS;
    }

    /**
     * 发送短信验证码
     * 
     * @return
     */
    public String sendPhoneCode() {
        String phone = this.getParameter("mobile");
        if (StringUtil.isEmpty(phone)) {
            this.success = false;
            this.message = "手机号码为空!";
            return SUCCESS;
        }

        // 注册验证
        BusUserExample emp = new BusUserExample();
        BusUserExample.Criteria cr = emp.createCriteria();
        cr.andPhoneEqualTo(phone);
        cr.andUserTypeEqualTo(UserTypeEnum.PLATFORM.getShortValue());
        List<BusUser> userList = userService.selectUserByExample(emp);
        if (userList != null && userList.size() > 0) {
            this.success = false;
            this.message = "手机号码已被注册!";
            return SUCCESS;
        }

        ResultBean bean = ValidateUtil.checkCanGetMobileCode(this.getSessionID(), KeyMsgCodeTypeEnum.REGISTER);
        if (bean.isSuccess()) {
            // String randomCode = RandomUtil.getRandomNumber(4);
            // boolean result = messageService.sendPhoneCode(phone, "【51充电】您的短信验证码为：" + randomCode + " 有效期为1分钟！");
            String randomCode = "1234";
            boolean result = true;
            if (result) {
                // 存储验证码
                ChargingCacheUtil.setMessageValidateCode(this.getSessionID(), randomCode, KeyMsgCodeTypeEnum.REGISTER);
                this.success = true;
                this.message = "短信发送成功!";
            } else {
                this.success = false;
                this.message = "短信发送失败!";
            }
        } else {
            this.success = false;
            this.message = bean.getMessage();
        }
        return SUCCESS;
    }

    /**
     * 注册
     * 
     * @return
     * @throws Exception
     */
    public String register() throws Exception {
        String phone = this.getParameter("mobile");
        String password = this.getParameter("password");
        String phonecode = this.getParameter("phonecode");
        short usertype = UserTypeEnum.PLATFORM.getShortValue();

        // 验证注册信息
        if (!validateParams(phone, password, phonecode)) {
            return SUCCESS;
        }

        String realpcode = ChargingCacheUtil.getMessageValidateCode(getSessionID(), KeyMsgCodeTypeEnum.REGISTER);

        // removeRedisCache(phone);
        // removeRedisCache("phone_code_time");
        if (realpcode == null || !realpcode.equals(phonecode)) {
            this.success = false;
            this.message = "短信验证码不正确!";
            return SUCCESS;
        }

        BusUserExample emp = new BusUserExample();
        BusUserExample.Criteria cr = emp.createCriteria();
        cr.andPhoneEqualTo(phone);
        cr.andUserTypeEqualTo(usertype);
        List<BusUser> userList = userService.selectUserByExample(emp);
        if (userList != null && userList.size() > 0) {
            this.success = false;
            this.message = "手机号码已被注册!";
            return SUCCESS;
        }

        // 用户
        String pwd = SecurityUtil.passwordEncrypt(password);
        BusUser user = new BusUser();
        user.setUsername(phone);
        user.setPassword(pwd);
        user.setPayPassword(pwd);
        user.setPhone(phone);
        user.setPhoneStatus(CertificateStatusEnum.PASSED.getShortValue());
        user.setEmailStatus(CertificateStatusEnum.FAILED.getShortValue());
        user.setUserType(usertype);
        user.setRegistTime(new Date());
        user.setRegistIp(getRemoteIP());
        user.setHeadImg(Globals.DEFAULT_HEAD_URL);
        // 插入用户角色
        boolean res = userService.insertUser(user, UserTypeEnum.getEnmuByValue(usertype), RoleTypeEnum.ENTERPRISE, null, null);
        // cookie记住userid和phone,userid30分钟失效，phone默认2周
        // saveToCookie(COOKIE_LOGIN_ACCOUNT, phone);
        // saveToCookie30Min(COOKIE_LOGIN_USERID, Des.encrypt(user.getId().toString()));
        if (res) {
            this.success = true;
            this.message = "注册成功!";
        } else {
            this.success = false;
            this.message = "注册失败!";
        }

        return SUCCESS;
    }

    private boolean validateParams(String phone, String password, String phonecode) {
        if (StringUtil.isEmpty(phone) || !Validator.isMobile(phone)) {
            this.success = false;
            this.message = "请正确填写11位手机号!";
            return false;
        }

        if (password == null || password == "" || !Validator.isPassword(password)) {
            this.success = false;
            this.message = "密码为6-16位数字字母组合!";
            return false;
        }

        if (StringUtil.isEmpty(phonecode)) {
            this.success = false;
            this.message = "请输入短信验证码!";
            return false;
        }
        return true;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    public void setMessageService(MessageService messageService) {
        this.messageService = messageService;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

}

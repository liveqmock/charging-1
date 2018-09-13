package com.holley.charging.dcs.dao.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.holley.charging.dcs.dao.model.User;
import com.holley.charging.dcs.dao.model.UserExample;

public interface UserMapper {

    int countByExample(UserExample example);

    int deleteByExample(UserExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(User record);

    int insertSelective(User record);

    List<User> selectByExample(UserExample example);

    User selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record")
    User record, @Param("example")
    UserExample example);

    int updateByExample(@Param("record")
    User record, @Param("example")
    UserExample example);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    List<User> selectByCardNum(Map<String, Object> paraMap);
}

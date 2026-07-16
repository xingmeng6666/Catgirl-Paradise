package com.sky.controller.admin;

import com.sky.result.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController("adminShopController")
@RequestMapping("/admin/shop")
@Tag(name = "店铺相关接口")
@Slf4j
public class ShopController {

    public static final String KEY = "SHOP_STATUS";

    @Autowired
    private RedisTemplate redisTemplate;

    @PutMapping("/{status}")
    @Operation(summary = "设置店铺营业状态")
    public Result setStatus(@PathVariable Integer status){
        log.info("设置店铺营业状态为：{}", status==1?"营业中":"打样中");
        redisTemplate.opsForValue().set(KEY,status.toString());
        return Result.success();
    }

    @GetMapping("/status")
    @Operation(summary = "查询店铺营业状态")
    public Result<Integer> getStatus(){
        String statusStr = (String) redisTemplate.opsForValue().get(KEY);
        Integer status = statusStr == null ? null : Integer.valueOf(statusStr);
        log.info("查询店铺营业状态为：{}", status==1?"营业中":"打样中");
        return Result.success(status);
    }
}

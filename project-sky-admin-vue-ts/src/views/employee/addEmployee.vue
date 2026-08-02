<template>
  <div class="addBrand-container">
    <HeadLable :title="title"
               :goback="true" />
    <div class="container">
      <el-form ref="ruleFormRef"
               :model="ruleForm"
               :rules="rules"
               :inline="false"
               label-width="180px"
               class="demo-ruleForm">
        <!--          <el-form-item label="员工职级" prop="region">-->
        <!--            <el-select v-model="ruleForm.region" placeholder="请选择品牌名称">-->
        <!--              <el-option label="区域一" value="shanghai"></el-option>-->
        <!--              <el-option label="区域二" value="beijing"></el-option>-->
        <!--            </el-select>-->
        <!--            <el-button @click="submitForm('ruleForm')" type="primary" class="continue" style="margin-left: 10px;" >+新增职级</el-button>-->
        <!--          </el-form-item>-->
        <el-form-item label="账号:"
                      prop="username">
          <el-input v-model="ruleForm.username"
                    placeholder="请输入账号"
                    maxlength="20" />
        </el-form-item>
        <el-form-item label="员工姓名:"
                      prop="name">
          <el-input v-model="ruleForm.name"
                    placeholder="请输入员工姓名"
                    maxlength="12" />
        </el-form-item>
        <!-- <el-form-item
          label="密码:"
          prop="password"
        >
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
          />
        </el-form-item> -->
        <!-- <el-form-item
          label="确认密码:"
          prop="rePassword"
        >
          <el-input
            v-model="ruleForm.rePassword"
            type="password"
            autocomplete="off"
            placeholder="请输入确认密码"
          />
        </el-form-item> -->
        <el-form-item label="手机号:"
                      prop="phone">
          <el-input v-model="ruleForm.phone"
                    placeholder="请输入手机号"
                    maxlength="11" />
        </el-form-item>
        <el-form-item label="性别:"
                      prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号:"
                      prop="idNumber"
                      class="idNumber">
          <el-input v-model="ruleForm.idNumber"
                    placeholder="请输入身份证号"
                    maxlength="20" />
        </el-form-item>
        <div class="subBox address">
          <!-- <el-form-item> -->
          <el-button @click="router.push('/employee')">
            取消
          </el-button>
          <el-button type="primary"
                     :class="{ continue: actionType === 'add' }"
                     @click="submitForm('ruleForm', false)">
            保存
          </el-button>
          <el-button v-if="actionType == 'add'"
                     type="primary"
                     @click="submitForm('ruleForm', true)">
            保存并继续添加
          </el-button>
          <!-- </el-form-item> -->
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import HeadLable from '@/components/HeadLable/index.vue'
import { queryEmployeeById, addEmployee, editEmployee } from '@/api/employee'

defineOptions({
  name: 'addShop'
})

const router = useRouter()
const route = useRoute()

const ruleFormRef = ref<FormInstance>()
const title = ref('添加员工')
const actionType = ref('')
const ruleForm = ref({
  name: '',
  phone: '',
  // 'password': '',
  // 'rePassword': '',
  sex: '男',
  idNumber: '',
  username: ''
})

// const validateRepassword = (rule: any, value: any, callback: any) => {
//   if (value === '') {
//     callback(new Error('请再次输入密码'))
//   } else if (value !== ruleForm.value.password) {
//     callback(new Error('两次输入密码不一致!'))
//   } else {
//     callback()
//   }
// }

const isCellPhone = (val: any) => {
  if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
    return false
  } else {
    return true
  }
}

const checkphone = (rule: any, value: any, callback: any) => {
  // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
  if (value == '') {
    callback(new Error('请输入手机号'))
  } else if (!isCellPhone(value)) {
    //引入methods中封装的检查手机格式的方法
    callback(new Error('请输入正确的手机号!'))
  } else {
    callback()
  }
}

const validID = (rule: any, value: any, callback: any) => {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (value == '') {
    callback(new Error('请输入身份证号码'))
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('身份证号码不正确'))
  }
}

const rules = computed(() => {
  return {
    name: [
      {
        required: true,
        // 'message': '请输入员工姓名',
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('请输入员工姓名'))
          } else {
            // const reg = /^[一-龥_a-zA-Z]{1,12}$/
            // if (!reg.test(value)) {
            //   callback(new Error('姓名输入不符，请输入1-12个字符'))
            // } else {
            //   callback()
            // }
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    username: [
      {
        required: true,
        // message: '请输入账号',
        validator: (rule: any, value: string, callback: Function) => {
          if (!value) {
            callback(new Error('请输入账号'))
          } else {
            const reg = /^([a-z]|[0-9]){3,20}$/
            if (!reg.test(value)) {
              callback(new Error('账号输入不符，请输入3-20个字符'))
            } else {
              callback()
            }
          }
        },
        trigger: 'blur'
      }
    ],
    phone: [{ required: true, validator: checkphone, trigger: 'blur' }],
    idNumber: [{ required: true, validator: validID, trigger: 'blur' }]
  }
})

const init = async () => {
  const id = route.query.id
  queryEmployeeById(id).then((res: any) => {
    // String(res.status) === '200'
    if (res.data.code === 1) {
      ruleForm.value = res.data.data
      ruleForm.value.sex = res.data.data.sex === '0' ? '女' : '男'
      // ruleForm.value.password = ''
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

const submitForm = (formName: any, st: any) => {
  ruleFormRef.value?.validate((valid: any) => {
    if (valid) {
      if (actionType.value === 'add') {
        const params = {
          ...ruleForm.value,
          sex: ruleForm.value.sex === '女' ? '0' : '1'
        }
        addEmployee(params)
          .then((res: any) => {
            if (res.data.code === 1) {
              ElMessage.success('员工添加成功！')
              if (!st) {
                router.push({ path: '/employee' })
              } else {
                ruleForm.value = {
                  username: '',
                  name: '',
                  phone: '',
                  // 'password': '',
                  // 'rePassword': '',
                  sex: '男',
                  idNumber: ''
                }
              }
            } else {
              ElMessage.error(res.data.msg)
            }
          })
          .catch(() => {
            // ElMessage.error('请求出错了：' + err.message)
          })
      } else {
        const params = {
          ...ruleForm.value,
          sex: ruleForm.value.sex === '女' ? '0' : '1'
        }
        editEmployee(params)
          .then((res: any) => {
            if (res.data.code === 1) {
              ElMessage.success('员工信息修改成功！')
              router.push({ path: '/employee' })
            } else {
              ElMessage.error(res.data.msg)
            }
          })
          .catch(() => {
            // ElMessage.error('请求出错了：' + err.message)
          })
      }
    } else {
      return false
    }
  })
}

onMounted(() => {
  actionType.value = route.query.id ? 'edit' : 'add'
  if (route.query.id) {
    title.value = '修改员工信息'
    init()
  }
})
</script>

<style lang="scss" scoped>
$gray-5: #F3F4F7;
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 0px;
    .HeadLable {
      background-color: transparent;
      margin-bottom: 0px;
      padding-left: 0px;
    }
    .container {
      position: relative;
      z-index: 1;
      background: #fff;
      padding: 30px;
      border-radius: 4px;
      // min-height: 500px;
      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px $gray-5;
      }
    }
    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }
    .el-input {
      width: 293px;
    }
  }
}
</style>

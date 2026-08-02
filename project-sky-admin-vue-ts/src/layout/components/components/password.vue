<template>
  <el-dialog
    title="修改密码"
    v-model="props.dialogFormVisible"
    width="568px"
    class="pwdCon"
    append-to-body
    @close="handlePwdClose()"
  >
    <el-form :model="form" label-width="85px" :rules="rules" ref="formRef">
      <el-form-item label="原始密码：" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          type="password"
          placeholder="6 - 20位密码，数字或字母，区分大小写"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="affirmPassword">
        <el-input
          v-model="form.affirmPassword"
          type="password"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handlePwdClose()">取 消</el-button>
        <el-button type="primary" @click="handleSave()">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { editPassword } from '@/api/users'

defineOptions({ name: 'Password' })

const props = defineProps<{
  dialogFormVisible: boolean
}>()

const emit = defineEmits<{
  handleClose: []
}>()

const formRef = ref<any>(null)
const form = reactive({
  oldPassword: '',
  newPassword: '',
  affirmPassword: '',
})

const validatePwd = (_rule: any, value: any, callback: Function) => {
  const reg = /^[0-9A-Za-z]{6,20}$/
  if (!value) {
    callback(new Error('请输入'))
  } else if (!reg.test(value)) {
    callback(new Error('6 - 20位密码，数字或字母，区分大小写'))
  } else {
    callback()
  }
}

const validatePass2 = (_rule: any, value: any, callback: Function) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.newPassword) {
    callback(new Error('密码不一致，请重新输入密码'))
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [{ validator: validatePwd, trigger: 'blur' }],
  newPassword: [{ validator: validatePwd, trigger: 'blur' }],
  affirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
}

async function handleSave() {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const parnt = {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      }
      await editPassword(parnt)
      emit('handleClose')
      formRef.value?.resetFields()
    } else {
      return false
    }
  })
}

function handlePwdClose() {
  formRef.value?.resetFields()
  emit('handleClose')
}

defineExpose({
  formRef,
})
</script>

<style lang="scss">
.navbar {
  .pwdCon {
    .el-dialog__body {
      padding-top: 60px;
      padding: 60px 100px 0;
    }
    .el-input__inner {
      padding: 0 12px;
    }
    .el-form-item {
      margin-bottom: 26px;
    }
    .el-form-item__label {
      text-align: left;
    }
    .el-dialog__footer {
      padding-top: 14px;
    }
  }
}
</style>

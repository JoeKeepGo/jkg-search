<template>
  <main class="auth-page">
    <Card class="auth-card">
      <div class="auth-header">
        <h1>管理员登录</h1>
        <p>登录后可修改运行时搜索配置。</p>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <label>
          用户名
          <Input v-model="username" autocomplete="username" required />
        </label>

        <label>
          密码
          <Input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="error" class="form-error">{{ error }}</p>

        <Button type="submit" :disabled="loading">
          <LogIn :size="16" />
          {{ loading ? '登录中' : '登录' }}
        </Button>
      </form>
    </Card>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn } from 'lucide-vue-next'
import { login } from '@/lib/api'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'

const route = useRoute()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true

  try {
    await login(username.value, password.value)
    await router.push(route.query.redirect || '/admin')
  } catch (err) {
    error.value = err.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>


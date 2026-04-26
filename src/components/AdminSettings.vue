<template>
  <main class="admin-page">
    <header class="admin-header">
      <div>
        <h1>设置</h1>
        <p>修改保存后立即写入 SQLite，下一次加载搜索页即生效。</p>
      </div>
      <div class="admin-actions">
        <Button variant="outline" as="a" href="/admin">
          <LayoutDashboard :size="16" />
          后台
        </Button>
        <ThemeToggle />
        <Button variant="ghost" @click="handleLogout">
          <LogOut :size="16" />
          退出
        </Button>
      </div>
    </header>

    <Tabs default-value="search">
      <TabsList>
        <TabsTrigger value="search">搜索配置</TabsTrigger>
        <TabsTrigger value="providers">搜索源</TabsTrigger>
      </TabsList>

      <TabsContent value="search">
        <Card>
          <form class="settings-form" @submit.prevent="submit">
            <label>
              站点标题
              <Input v-model="form.site_title" required />
            </label>

            <label>
              Google PSE CX
              <Input v-model="form.google_pse_cx" placeholder="Programmable Search Engine cx" />
            </label>

            <div class="switch-row">
              <div>
                <h2>DuckDuckGo Instant Answer</h2>
                <p>开启后仅提供 `/api/ddg?q=...` 的补充答案能力。</p>
              </div>
              <Switch v-model="form.duckduckgo_enabled" />
            </div>

            <p v-if="error" class="form-error">{{ error }}</p>

            <div class="form-actions">
              <Dialog v-model:open="confirmOpen">
                <DialogTrigger>
                  <Button type="button" variant="outline">
                    <RotateCcw :size="16" />
                    清空 CX
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div class="dialog-stack">
                    <h2>清空 Google PSE CX</h2>
                    <p>清空后如果环境变量 `VITE_GOOGLE_CSE_CX` 存在，搜索页会回退使用它。</p>
                    <div class="dialog-actions">
                      <Button variant="ghost" @click="confirmOpen = false">取消</Button>
                      <Button variant="destructive" @click="clearCx">清空</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button type="submit" :disabled="saving">
                <Save :size="16" />
                {{ saving ? '保存中' : '保存' }}
              </Button>
            </div>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="providers">
        <Card>
          <Table>
            <thead>
              <tr>
                <th>搜索源</th>
                <th>角色</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Google PSE Element</td>
                <td>主搜索源</td>
                <td>启用</td>
              </tr>
              <tr>
                <td>DuckDuckGo Instant Answer API</td>
                <td>可选补充</td>
                <td>{{ form.duckduckgo_enabled ? '启用' : '关闭' }}</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </TabsContent>
    </Tabs>

    <Toast :message="toast.message" :type="toast.type" />
  </main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutDashboard, LogOut, RotateCcw, Save } from 'lucide-vue-next'
import { getSettings, logout, saveSettings } from '@/lib/api'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Dialog from '@/components/ui/Dialog.vue'
import DialogContent from '@/components/ui/DialogContent.vue'
import DialogTrigger from '@/components/ui/DialogTrigger.vue'
import Input from '@/components/ui/Input.vue'
import Switch from '@/components/ui/Switch.vue'
import Table from '@/components/ui/Table.vue'
import Tabs from '@/components/ui/Tabs.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import Toast from '@/components/ui/Toast.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const saving = ref(false)
const error = ref('')
const confirmOpen = ref(false)
const toast = reactive({
  message: '',
  type: 'success'
})
const form = reactive({
  google_pse_cx: '',
  site_title: 'Luxirty Search',
  duckduckgo_enabled: false
})

function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  window.setTimeout(() => {
    toast.message = ''
  }, 2400)
}

async function load() {
  const settings = await getSettings()
  form.google_pse_cx = settings.google_pse_cx || ''
  form.site_title = settings.site_title || 'Luxirty Search'
  form.duckduckgo_enabled = Boolean(settings.duckduckgo_enabled)
}

async function submit() {
  error.value = ''
  saving.value = true

  try {
    const settings = await saveSettings(form)
    form.google_pse_cx = settings.google_pse_cx || ''
    form.site_title = settings.site_title || 'Luxirty Search'
    form.duckduckgo_enabled = Boolean(settings.duckduckgo_enabled)
    showToast('设置已保存')
  } catch (err) {
    error.value = err.message || '保存失败'
  } finally {
    saving.value = false
  }
}

function clearCx() {
  form.google_pse_cx = ''
  confirmOpen.value = false
}

async function handleLogout() {
  await logout()
  await router.push('/login')
}

onMounted(async () => {
  try {
    await load()
  } catch (err) {
    error.value = err.message || '加载设置失败'
  }
})
</script>

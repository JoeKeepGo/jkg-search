<template>
  <main class="admin-page">
    <header class="admin-header">
      <div>
        <h1>后台</h1>
        <p>管理搜索运行时配置。</p>
      </div>
      <div class="admin-actions">
        <Button variant="outline" as="a" href="/">
          <Search :size="16" />
          搜索页
        </Button>
        <ThemeToggle />
        <Button variant="ghost" @click="handleLogout">
          <LogOut :size="16" />
          退出
        </Button>
      </div>
    </header>

    <Tabs default-value="overview">
      <TabsList>
        <TabsTrigger value="overview">概览</TabsTrigger>
        <TabsTrigger value="settings" @click="$router.push('/admin/settings')">设置</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div class="admin-grid">
          <Card>
            <h2>Google PSE</h2>
            <p>主搜索源继续使用 Google Programmable Search Element。</p>
            <Button as="a" href="/admin/settings" variant="secondary">
              <Settings :size="16" />
              配置
            </Button>
          </Card>
          <Card>
            <h2>DuckDuckGo</h2>
            <p>仅作为 Instant Answer API 补充，不作为完整搜索替代。</p>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </main>
</template>

<script setup>
import { LogOut, Search, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { logout } from '@/lib/api'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Tabs from '@/components/ui/Tabs.vue'
import TabsContent from '@/components/ui/TabsContent.vue'
import TabsList from '@/components/ui/TabsList.vue'
import TabsTrigger from '@/components/ui/TabsTrigger.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()

async function handleLogout() {
  await logout()
  await router.push('/login')
}
</script>

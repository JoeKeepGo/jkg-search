<template>
  <main class="search-home">
    <header class="public-nav">
      <Button as="a" href="https://luxirty.com/posts/luxirty-search/" target="_blank" variant="ghost">
        关于
      </Button>
      <Button as="a" href="/login" variant="outline">
        <Settings :size="16" />
        后台
      </Button>
    </header>

    <section class="home-search-panel">
      <div class="home-title-block">
        <h1>{{ siteTitle }}</h1>
        <p>基于 Google Programmable Search Element 的轻量搜索。</p>
      </div>

      <Card class="public-search-card">
        <div class="gcse-searchbox-only" data-resultsUrl="search"></div>
        <p v-if="cseError" class="cse-error">{{ cseError }}</p>
      </Card>
    </section>

    <footer class="public-footer">
      <span>
        Create by <a href="https://luxirty.com/about/" target="_blank">Luxirty</a>
      </span>
      <span>
        Open Source on <a href="https://github.com/KoriIku/luxiry-search" target="_blank">GitHub</a>
      </span>
    </footer>
  </main>
</template>

<script>
import { Settings } from 'lucide-vue-next'
import { loadGoogleCse } from '@/lib/google-cse'
import { getGooglePseSettings } from '@/lib/settings'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'

export default {
  components: {
    Button,
    Card,
    Settings
  },
  data() {
    return {
      siteTitle: 'Luxirty Search',
      cseError: ''
    }
  },
  async mounted() {
    const settings = await getGooglePseSettings()
    this.siteTitle = settings.siteTitle
    document.title = settings.siteTitle

    if (!settings.cx) {
      this.cseError = 'Google PSE CX 尚未配置'
      return
    }

    try {
      await loadGoogleCse(settings.cx)
    } catch {
      this.cseError = 'Google PSE 加载失败'
    }
  }
};
</script>

<style scoped>
.search-home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  color: var(--foreground);
  background: var(--background);
}

.public-nav {
  width: min(960px, 100%);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.home-search-panel {
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  margin: auto 0;
}

.home-title-block {
  display: grid;
  gap: 10px;
  text-align: center;
}

.home-title-block h1 {
  color: var(--foreground);
  font-size: 48px;
  line-height: 1.1;
  font-weight: 700;
}

.home-title-block p {
  color: var(--muted-foreground);
  font-size: 16px;
}

.public-search-card {
  width: min(720px, 100%);
  padding: 18px;
}

.cse-error {
  margin-top: 16px;
  text-align: center;
  color: var(--muted-foreground);
}

.public-footer {
  width: min(960px, 100%);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px 18px;
  padding: 20px 0 4px;
  color: var(--muted-foreground);
  font-size: 14px;
}

.public-footer a {
  color: var(--foreground);
  font-weight: 600;
}

@media (max-width: 600px) {
  .search-home {
    padding: 16px;
  }

  .public-nav {
    justify-content: space-between;
  }

  .home-title-block h1 {
    font-size: 36px;
  }
}
</style>

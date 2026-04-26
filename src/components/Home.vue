<template>
  <main class="search-home">
    <header class="public-nav">
      <div class="public-brand">{{ siteTitle }}</div>
      <div class="public-actions">
        <Button as="a" href="https://luxirty.com/posts/luxirty-search/" target="_blank" variant="ghost">
          关于
        </Button>
        <ThemeToggle />
        <Button as="a" href="/login" variant="outline">
          <Settings :size="16" />
          后台
        </Button>
      </div>
    </header>

    <section class="home-search-panel">
      <div class="home-title-block">
        <h1>{{ siteTitle }}</h1>
        <p>基于 Google Programmable Search Element 的轻量搜索。</p>
      </div>

      <div class="public-search-surface">
        <form class="public-search-form" @submit.prevent="submitSearch">
          <Search :size="18" class="search-form-icon" />
          <Input v-model="searchQuery" :placeholder="`搜索 ${siteTitle}`" autocomplete="off" autofocus />
          <Button type="submit">
            搜索
          </Button>
        </form>
        <p v-if="cseError" class="cse-error">{{ cseError }}</p>
      </div>
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
import { Search, Settings } from 'lucide-vue-next'
import { getGooglePseSettings } from '@/lib/settings'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

export default {
  components: {
    Button,
    Input,
    Search,
    Settings,
    ThemeToggle
  },
  data() {
    return {
      searchQuery: '',
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
    }
  },
  methods: {
    submitSearch() {
      const query = this.searchQuery.trim()
      if (!query) return
      this.$router.push({ path: '/search', query: { q: query } })
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
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.public-brand {
  min-width: 0;
  color: var(--foreground);
  font-size: 15px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.public-actions {
  display: flex;
  align-items: center;
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

.public-search-surface {
  width: min(720px, 100%);
  min-height: 54px;
}

.public-search-form {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: 1px solid var(--input);
  border-radius: 8px;
  background: var(--card);
  padding: 8px;
}

.search-form-icon {
  color: var(--muted-foreground);
  margin-left: 4px;
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
    align-items: flex-start;
  }

  .home-title-block h1 {
    font-size: 36px;
  }

  .public-actions {
    flex-shrink: 0;
  }

  .public-search-form {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .public-search-form .ui-button {
    grid-column: 1 / -1;
    width: 100%;
  }
}
</style>

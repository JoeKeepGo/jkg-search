<template>
  <main class="search-results-page">
    <header class="results-header" id="searchContainer">
      <Button class="search-title" variant="ghost" @click="goHome">
        {{ siteTitle }}
      </Button>
      <Card class="results-search-card">
        <div class="gcse-searchbox"></div>
      </Card>
      <Button as="a" href="/login" variant="outline">
        <Settings :size="16" />
        后台
      </Button>
    </header>

    <section class="search-result-zone">
      <div class="gcse-searchresults" data-linkTarget="_blank" data-refinementStyle="link"></div>
      <p v-if="cseError" class="cse-error">{{ cseError }}</p>
    </section>

    <footer class="public-footer">
      <span>
        Create by <a href="https://luxirty.com/posts/luxirty-search/" target="_blank">Luxirty</a>
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
  name: 'SearchPage',
  components: {
    Button,
    Card,
    Settings
  },
  props: ['query'],
  data() {
    return {
      siteTitle: 'Luxirty Search',
      cseError: ''
    }
  },
  async mounted() {
    if (!this.query) {
      this.goHome();
      return
    }

    const settings = await getGooglePseSettings()
    this.siteTitle = settings.siteTitle
    this.setupResultsRenderedCallback();  // 注册渲染结果回调函数

    if (!settings.cx) {
      this.cseError = 'Google PSE CX 尚未配置'
      return
    }

    try {
      await loadGoogleCse(settings.cx, window.__gcse || {})
    } catch {
      this.cseError = 'Google PSE 加载失败'
    }
  },
  methods: {
    setTitle() {
      const inputContent = document.getElementsByName('search')[0]?.value || this.query;
      document.title = inputContent + ' - ' + this.siteTitle
    },
    goHome() {
      // 使用 window.location.href 跳转到根路径
      window.location.href = '/';
    },
    setupResultsRenderedCallback() {
      // 定义一个渲染回调函数，用于移除不需要的属性
      const myWebResultsRenderedCallback = () => {
        const links = document.querySelectorAll('a.gs-title');

        links.forEach((anchor) => {
          // 移除 'data-cturl' 和 'data-ctorig' 属性
          anchor.removeAttribute('data-cturl');
          anchor.removeAttribute('data-ctorig');
        });

        // 设置搜索标题，多页签时更好切换
        this.setTitle();
      };

      // 将回调注册到 Google Custom Search 引擎对象
      window.__gcse || (window.__gcse = {});
      window.__gcse.searchCallbacks = {
        web: {
          rendered: myWebResultsRenderedCallback,
        },
      };
    }
  }
};
</script>
<style scoped>
.search-results-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 320px;
  box-sizing: border-box;
  color: var(--foreground);
  background: var(--background);
}

.results-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--background) 92%, transparent);
  backdrop-filter: blur(10px);
}

.search-title {
  flex: 0 0 auto;
  color: var(--foreground);
  font-size: 20px;
  font-weight: 700;
}

.results-search-card {
  flex: 1;
  min-width: 0;
  padding: 8px;
}

/* 针对小屏幕的样式 */
@media (max-width: 600px) {
  .results-header {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 10px;
  }

  .search-title {
    align-self: center;
  }
}

.search-result-zone {
  flex-grow: 1;
  padding: 28px 0 0;
}

.cse-error {
  width: min(760px, calc(100vw - 32px));
  margin: 24px auto;
  color: var(--muted-foreground);
}

.public-footer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px 18px;
  border-top: 1px solid var(--border);
  padding: 16px;
  font-size: 14px;
  color: var(--muted-foreground);
  margin-top: 36px;
}

.public-footer a {
  color: var(--foreground);
  font-weight: 600;
}
</style>

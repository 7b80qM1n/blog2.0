const path = require("path");
const math = require("remark-math");
const katex = require("rehype-katex");

module.exports = {
  title: "oooooooooooo",
  tagline: "-",
  titleDelimiter: "-",
  url: "https://www.7b80qm1n.cn/",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "7b80qM1n", // Usually your GitHub org/user name.
  projectName: "7b80qM1n.cn", // Usually your repo name.
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      title: "7b80qM1n",
      logo: {
        alt: "庆民",
        src: "img/logo.png",
        srcDark: "img/logo.png",
      },
      items: [
        {
          to: "/",
          label: "首页",
          position: "right",
        },
        {
          label: "理论知识",
          position: "right",
          items: [
            {
              label: "网络基础",
              // position: "right",
              to: "docs/resources/Networking Essentials/TCP/NetworkingEssentials-01",
            },
            {
              label: "网络编程",
              // position: "right",
              to: "docs/resources/socket/模拟ssh远程执行命令/socket06",
            },
          ],
        },
        {
          label: "笔记",
          position: "right",
          items: [
            {
              label: "前端",
              // position: "right",
              to: "docs/note/frontEnd/http/http01",
            },
            {
              label: "python后端",
              // position: "right",
              to: "docs/note/pythonBackend/python三大框架/pythonBackend-1",
            },
          ],
        },
        {
          label: "博客",
          position: "right",
          items: [
            {
              label: "python",
              to: "tags/python",
            },
            {
              label: "linux",
              to: "tags/linux",
            },
            {
              label: "git",
              to: "tags/git",
            },
            {
              label: "随笔",
              to: "tags/随笔",
            },
          ],
        },
      ],
    },
    // algolia: {
    //   apiKey: "12d60893d1554cadaf090f4ad3ee740a",
    //   indexName: "blog",
    //   appId: "8QDD70BS8W",
    // },
    footer: {
      style: "dark",
      links: [
        // {
        //   title: "Docs",
        //   items: [
        //     {
        //       label: "Style Guide",
        //       to: "docs/doc1"
        //     },
        //     {
        //       label: "Second Doc",
        //       to: "docs/doc2"
        //     }
        //   ]
        // },
        // {
        //   title: "Community",
        //   items: [
        //     {
        //       label: "Stack Overflow",
        //       href: "https://stackoverflow.com/questions/tagged/docusaurus"
        //     },
        //     {
        //       label: "Discord",
        //       href: "https://discordapp.com/invite/docusaurus"
        //     }
        //   ]
        // },
        // {
        //   title: "Social",
        //   items: [
        //     {
        //       label: "博客",
        //       to: "/",
        //     },
        //     {
        //       label: "Gitee",
        //       href: "https://gitee.com/JqM1n",
        //     },
        //     {
        //       label: "Bilibili 哔哩哔哩",
        //       href: "https://space.bilibili.com/69871411",
        //     },
        //   ],
        // },
      ],
      copyright: `Copyright © 2021 庆民gg | CC BY-NC 4.0</p>`,
    },
    prism: {
      theme: require("prism-react-renderer/themes/github"),
      darkTheme: require("prism-react-renderer/themes/oceanicNext"),
      defaultLanguage: "javascript",
    },
    googleAnalytics: {
      trackingID: "UA-118572241-1",
      anonymizeIP: true, // Should IPs be anonymized?
    },
    gtag: {
      trackingID: "G-6PSESJX0BM",
      // Optional fields.
      anonymizeIP: true, // Should IPs be anonymized?
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // editUrl: "https://github.com/zxuqian/zxuqian.cn/tree/master",
          remarkPlugins: [math],
          rehypePlugins: [katex],
          // showLastUpdateTime: true,  
        },
        blog: {
          path: "./blog",
          routeBasePath: "/",
          blogSidebarTitle: "近期文章",
          feedOptions: {
            type: "all",
            title: "7b80qM1n",
            copyright: `Copyright © 2021 庆民gg | CC BY-NC 4.0</p>`,
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "daily",
          priority: 0.5,
        },
      },
    ],
  ],
  // themes: ["@docusaurus/theme-live-codeblock"],
  plugins: [
    path.resolve(__dirname, "./src/plugin/plugin-baidu-analytics"),
    path.resolve(__dirname, "./src/plugin/plugin-baidu-push"),
    // "@docusaurus/plugin-ideal-image",
    path.resolve(__dirname, "./src/plugin/plugin-google-adsense"),
    path.resolve(__dirname, "./src/plugin/plugin-onesignal-push"),
    "docusaurus2-dotenv",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        docsRouteBasePath: "/docs",
        blogRouteBasePath: "/blog",
        language: ["en", "zh"],
        translations:{
          "search_placeholder": "搜索..",
          "see_all_results": "查看所有搜索结果",
          "no_results": "没找到任何相关结果.",
          "search_results_for": "搜索到 \"{{ keyword }}\" 的相关结果",
          "search_the_documentation": "搜索文档",
          "count_documents_found": "只找到{{ count }}篇相关文档",
          "count_documents_found_plural": "找到{{ count }}篇相关文档",
          "no_documents_were_found": "没找到任何相关文档"
        }
      },
    ],
  ],
  stylesheets: [
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      type: "text/css",
    },
    {
      href: "/katex/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X",
      crossorigin: "anonymous",
    },
    {
      href: "https://fonts.font.im/css?family=Raleway:500,700&display=swap",
      type: "text/css",
      rel: "stylesheet",
    },
    // {
    //   href: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
    //   type: "text/css",
    //   rel: "stylesheet",
    // },
  ],
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en"],
    localeConfigs: {
      "zh-CN": {
        label: "中文",
      },
      en: {
        label: "English",
      },
    },
  },
};

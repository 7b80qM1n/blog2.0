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
              label: "网络编程",
              // position: "right",
              to: "docs/resources/socket/网络架构及其演变过程/socket01",
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
    algolia: {
      apiKey: "d95e3410bcf9a842ca04da9e5cd16168",
      indexName: "blog",
      appId: "8QDD70BS8W",
    },
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
    // [
    //   "@easyops-cn/docusaurus-search-local",
    //   {
    //     hashed: true,
    //     // indexPages: true,
    //     blogRouteBasePath: "/",
    //     language: ["en", "zh"],
    //   },
    // ],
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

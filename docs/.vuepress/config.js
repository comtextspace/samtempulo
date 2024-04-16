import { defaultTheme } from "@vuepress/theme-default";

import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'

import md_footnote from "markdown-it-footnote";
import md_attrs from "markdown-it-attrs";
import md_table from "markdown-it-multimd-table";
import md_katex from "@iktakahiro/markdown-it-katex";

export default defineUserConfig ({
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
  lang: "ru-RU",
  title: "Samtempulo",
  base: "/",
  description: "Samtempulo",
  head: [
    // <!-- revisionme -->
    [
      "script",
      {},
      `
	    var __rm__config = {
        projectId: '-Nva0pMtD0w_l3EZqBrf',
        locale: 'ru',
        contextWidget: 0,
        embedBtn: 0,
        floatingBtn: 1,
        floatingBtnPosition: 'left',
        floatingBtnStyle: 'light',
			};
    `,
    ],
    [
      "script",
      {
        src: "https://widget.revisionme.com/app.js",
        defer: "defer",
        id: "rm_app_script",
      },
    ],
    // <!-- /revisionme -->
  ],
  theme: defaultTheme({
    sidebar: false,
    contributors: false,
    lastUpdatedText: "Последниее изменение",
    navbar: [{ text: "Главная", link: "/" },
             { text: "О сайте", link: "/static/about.md" }
    ],
  }),

  extendsMarkdown: (md) => {
    md.use(md_footnote);
    md.use(md_katex, {
      strict: false,
    });
    md.use(md_attrs);
    md.use(md_table, {
      multiline: true,
      rowspan: true,
      headerless: true,
    });
  },
});

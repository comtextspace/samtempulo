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
  title: "MarxHub",
  base: "/marxhub/",
  description: "MarxHub",
  head: [
/*
    // <!-- revisionme -->
    [
      "script",
      {},
      `
	    var __rm__config = {
        projectId: '',
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
    */
  ],
  theme: defaultTheme({
    sidebar: false,
    contributors: false,
    lastUpdatedText: "Последниее изменение",
    navbar: [{ text: "Главная", link: "/" }],
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

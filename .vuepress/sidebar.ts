import {SidebarConfig4Multiple} from "vuepress/config";

import roadmapSideBar from "./sidebars/roadmapSideBar";
import noteSideBar from "./sidebars/noteSideBar";
import toolSideBar from "./sidebars/toolSideBar";
// @ts-ignore
export default {
    "/学习路线/": roadmapSideBar,
    "/学习笔记/": noteSideBar,
    "/编程工具/": toolSideBar,
    // 降级，默认根据文章标题渲染侧边栏
    "/": "auto",
} as SidebarConfig4Multiple;

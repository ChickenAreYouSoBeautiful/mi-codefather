import {SidebarConfig4Multiple} from "vuepress/config";

import roadmapSideBar from "./sidebars/roadmapSideBar";
import noteSideBar from "./sidebars/noteSideBar";
import toolSideBar from "./sidebars/toolSideBar";
import projectNoteSideBar from "./sidebars/projectNoteSideBar";
import operationSideBar from "./sidebars/operationSideBar";
import documentsSideBar from "./sidebars/documentsSideBar";
// @ts-ignore
export default {
    "/学习路线/": roadmapSideBar,
    "/文档/": documentsSideBar,
    "/学习笔记/": noteSideBar,
    "/编程工具/": toolSideBar,
    "/项目笔记/": projectNoteSideBar,
    "/运维/": operationSideBar,
    // 降级，默认根据文章标题渲染侧边栏
    "/": "auto",
} as SidebarConfig4Multiple;

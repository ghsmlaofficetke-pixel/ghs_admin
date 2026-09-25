import React from "react";

export interface MenuItemTypes {
  key: string;
  label: React.ReactNode;
  isTitle?: boolean;
  icon?: string;
  url?: string;
  parentKey?: string;
  target?: string;
  children?: MenuItemTypes[];
  roles?: string[];
  menuKey?: string;
}

const ALL_MENU_ITEMS: MenuItemTypes[] = [
  { key: "menu", label: "Menu", isTitle: true },

  {
    key: "dashboard",
    label: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
    icon: "mgc_home_3_line",
    url: "/dashboard",
    menuKey: "dashboard",
  },

  { key: "apps", label: "Apps", isTitle: true },

  {
    key: "apps-calendar",
    label: "ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು (TP)",
    icon: "mgc_calendar_line",
    url: "/apps/calendar",
    menuKey: "calendar",
  },

  {
    key: "apps-project",
    label: "ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ",
    icon: "mgc_building_2_line",
    menuKey: "taluk",
    children: [
      { key: "apps-tarikere",   label: "ತರೀಕೆರೆ (ತಾ)",                               icon: "mgc_building_2_line", url: "/apps/taluk/tarikere",                      menuKey: "tarikere"   },
      { key: "apps-ajjampura",  label: "ಅಜ್ಜಂಪುರ (ತಾ)",                              icon: "mgc_building_2_line", url: "/apps/taluk/ajjampura",                     menuKey: "ajjampura"  },
      { key: "apps-purasabe",   label: "ಪುರಸಭೆ ತರೀಕೆರೆ",                             icon: "mgc_folder_2_line",   url: "/apps/panchayath/purasabetarikere",         menuKey: "purasabe"   },
      { key: "apps-panchayath", label: (<>ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ <br/> ಅಜ್ಜಂಪುರ</>),        icon: "mgc_folder_2_line",   url: "/apps/panchayath/panchayathajjampura",      menuKey: "panchayath" },
    ],
  },

  {
    key: "apps-contacts",
    label: "ಕಾರ್ಯಕರ್ತರ ಸಂಪರ್ಕ",
    icon: "mgc_notification_line",
    url: "/apps/contacts",
    menuKey: "contacts",
  },

  {
    key: "apps-statistics",
    label: "ಅಂಕಿ-ಅಂಶಗಳು",
    icon: "mgc_align_left_line",
    url: "/apps/statdata",
    menuKey: "statdata",
  },

  {
    key: "apps-govtoffice",
    label: "ಇಲಾಖೆಗಳ ಸಂಪರ್ಕ",
    icon: "mgc_building_2_line",
    url: "/apps/govtoffice",
    menuKey: "govtoffice",
  },

  {
    key: "apps-adhiveshana",
    label: "ಅಧಿವೇಶನ",
    icon: "mgc_calendar_line",
    url: "/apps/adhiveshana",
    menuKey: "adhiveshana",
  },

  {
    key: "apps-mlaladd",
    label: "MLA-LAD",
    icon: "mgc_folder_2_line",
    url: "/apps/mlaladd",
    menuKey: "mlaladd",
  },

  {
    key: "apps-schem",
    label: "ವಿವಿಧ ಅನುದಾನಗಳು",
    icon: "mgc_folder_2_line",
    url: "/apps/schem",
    menuKey: "schem",
  },

  {
    key: "apps-chunavane",
    label: "ಚುನಾವಣೆ [Election]",
    icon: "mgc_building_2_line",
    menuKey: "election",
    roles: ["admin", "superadmin"],
    children: [
      { key: "cast",     label: "ಜನಸಂಖ್ಯೆ ಜಾತಿವಾರು", icon: "mgc_align_left_line", url: "/admin/villages",     menuKey: "election" },
      { key: "election", label: "MLA Election",        icon: "mgc_folder_2_line",   url: "/admin/elections",    menuKey: "election" },
      { key: "blablo",   label: "BLA-2 & BLO",         icon: "mgc_folder_2_line",   url: "/admin/bla-blo-list", menuKey: "election" },
    ],
  },

  {
    key: "apps-govtlinks",
    label: "GOVT Links",
    icon: "mgc_right_line",
    url: "/apps/govtlinks",
    menuKey: "govtlinks",
  },

  {
    key: "apps-yuva-sangha",
    label: "ಭಾರತ ಜೋಡೋ ಯುವ ಸಂಘ",
    icon: "mgc_align_left_line",
    url: "/apps/yuva-sangha",
    menuKey: "yuva-sangha",
  },

  {
    key: "apps-gauranthi-samiti",
    label: "ಗ್ಯಾರಂಟಿ ಸಮಿತಿ",
    icon: "mgc_user_3_line",
    url: "/apps/gauranthi-samiti",
    menuKey: "gauranthi-samiti",
  },

  {
    key: "admin-section",
    label: "Admin",
    isTitle: true,
    roles: ["admin", "superadmin"],
  },
  {
    key: "admin-users",
    label: "User Management",
    icon: "mgc_settings_4_line",
    url: "/admin/users",
    roles: ["admin", "superadmin"],
    menuKey: "user-management",
  },
];

export function getFilteredMenuItems(): MenuItemTypes[] {
  const role    = localStorage.getItem("userRole") || "user";
  const isAdmin = role === "admin" || role === "superadmin";

  let allowedMenus: string[] = [];
  try { allowedMenus = JSON.parse(localStorage.getItem("allowedMenus") || "[]"); } catch {}

  function filterItem(item: MenuItemTypes): MenuItemTypes | null {
    if (item.roles && !item.roles.includes(role)) return null;
    if (!isAdmin && allowedMenus.length > 0 && item.menuKey) {
      if (!allowedMenus.includes(item.menuKey)) return null;
    }
    if (item.children) {
      const filteredChildren = item.children.map(filterItem).filter(Boolean) as MenuItemTypes[];
      if (filteredChildren.length === 0 && item.menuKey) return null;
      return { ...item, children: filteredChildren.length ? filteredChildren : undefined };
    }
    return item;
  }

  return ALL_MENU_ITEMS.map(filterItem).filter(Boolean) as MenuItemTypes[];
}

export const ALL_MENU_KEYS: { key: string; label: string }[] = [
  { key: "dashboard",        label: "Dashboard" },
  { key: "calendar",         label: "ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು (TP)" },
  { key: "taluk",            label: "ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ (ಎಲ್ಲಾ)" },
  { key: "tarikere",         label: "ತರೀಕೆರೆ (ತಾ)" },
  { key: "ajjampura",        label: "ಅಜ್ಜಂಪುರ (ತಾ)" },
  { key: "purasabe",         label: "ಪುರಸಭೆ ತರೀಕೆರೆ" },
  { key: "panchayath",       label: "ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ ಅಜ್ಜಂಪುರ" },
  { key: "contacts",         label: "ಕಾರ್ಯಕರ್ತರ ಸಂಪರ್ಕ" },
  { key: "statdata",         label: "ಅಂಕಿ-ಅಂಶಗಳು" },
  { key: "govtoffice",       label: "ಇಲಾಖೆಗಳ ಸಂಪರ್ಕ" },
  { key: "adhiveshana",      label: "ಅಧಿವೇಶನ" },
  { key: "mlaladd",          label: "MLA-LAD" },
  { key: "schem",            label: "ವಿವಿಧ ಅನುದಾನಗಳು" },
  { key: "govtlinks",        label: "GOVT Links" },
  { key: "yuva-sangha",      label: "ಭಾರತ ಜೋಡೋ ಯುವ ಸಂಘ" },
  { key: "gauranthi-samiti", label: "ಗ್ಯಾರಂಟಿ ಸಮಿತಿ" },
  { key: "user-management",  label: "User Management" },
  { key: "chunavane",        label: "Chunavane" },
];

export const MENU_ITEMS = ALL_MENU_ITEMS;

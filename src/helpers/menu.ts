import { getFilteredMenuItems, MenuItemTypes } from "../constants/menu";

const getMenuItems = () => getFilteredMenuItems();

// Finds the chain of ancestor keys leading to `targetKey`, by walking
// the actual tree structure — NOT by relying on item.parentKey, which
// is never set on the menu data. (Relying on parentKey was the bug:
// after navigating to a submenu link, the parent dropdown had no way
// to know it should stay open, so it collapsed right after selection.)
const findParentPath = (
  menuItems: MenuItemTypes[] | undefined,
  targetKey: string,
  path: string[] = []
): string[] | null => {
  if (!menuItems) return null;

  for (const item of menuItems) {
    if (item.key === targetKey) return path;
    if (item.children) {
      const found = findParentPath(item.children, targetKey, [...path, item.key]);
      if (found) return found;
    }
  }
  return null;
};

const findAllParent = (menuItems: MenuItemTypes[], menuItem: MenuItemTypes): string[] => {
  return findParentPath(menuItems, menuItem.key) || [];
};

const findMenuItem = (
  menuItems: MenuItemTypes[] | undefined,
  menuItemKey: MenuItemTypes["key"] | undefined
): MenuItemTypes | null => {
  if (menuItems && menuItemKey) {
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) return menuItems[i];
      const found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

// Collect the keys of every descendant (children, grandchildren, ...)
// of a menu item. Used when closing a menu so its whole sub-tree is
// removed from the "open" list in one go.
const findAllChildren = (menuItem: MenuItemTypes): string[] => {
  let keys: string[] = [];
  (menuItem.children || []).forEach((child) => {
    keys.push(child.key);
    keys = [...keys, ...findAllChildren(child)];
  });
  return keys;
};

export { getMenuItems, findAllParent, findAllChildren, findMenuItem };
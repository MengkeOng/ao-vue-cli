const pkg = state => state.pkg;
const app = state => state.app;
const device = state => state.app.device;
const sidebar = state => state.app.sidebar;
const effect = state => state.app.effect;
const menuitems = state => state.menu.items;
const user = state => state.app.user;
const proposer = state => state.app.proposer;
const componententry = state => {
  return state.menu.items.filter(
    c => c.meta && c.meta.label === "Components"
  )[0];
};

export { pkg, app, device, sidebar, effect, menuitems, componententry, user, proposer };

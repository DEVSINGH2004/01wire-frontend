/** 
  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 PRO React layouts
import Dashboards from "layouts/pages/dashboards";
import MyCredits from "layouts/pages/myCredits";
import Releases from "layouts/pages/releases";
import Clients from "layouts/pages/clients"

// Material Dashboard 2 PRO React TS components
import MDAvatar from "components/MDAvatar";
import ClientIcon from "assets/images/icons/sidebarClient.svg";
import DashboardIcon from "assets/images/icons/sidebarDashboard.svg";
import ReleaseIcon from "assets/images/icons/sidebarRelease.svg";
import WalletIcon from "assets/images/icons/sidebarWallet.svg";

const routes = [
  {
    type: "collapse",
    name: "Dashboards",
    key: "dashboards",
    icon: <img src={DashboardIcon} width="24px" height="24px"/>,
    noCollapse: true,
    route: "/dashboards",
    component: <Dashboards />,
  },
  {
    type: "collapse",
    name: "Release",
    icon: <img src={ReleaseIcon} width="24px" height="24px"/>,
    key: "releases",
    noCollapse: true,
    route: "/releases",
    component: <Releases />,
  },
  {
    type: "collapse",
    name: "Client",
    icon: <img src={ClientIcon} width="24px" height="24px"/>,
    key: "clients",
    noCollapse: true,
    route: "/clients",
    component: <Clients />,
  },
  {
    type: "collapse",
    name: "My Credits",
    key: "my-credits",
    noCollapse: true,
    route: "/my-credits",
    icon: <img src={WalletIcon} width="24px" height="24px"/>,
    component: <MyCredits />,
  },

  // { type: "divider", key: "divider-0" },
  // {
  //   type: "collapse",
  //   name: "Dashboards",
  //   key: "dashboards",
  //   icon: <Icon fontSize="medium">dashboard</Icon>,
  //   collapse: [
  //     {
  //       name: "Analytics",
  //       key: "analytics",
  //       route: "/dashboards/analytics",
  //       component: <Analytics />,
  //     },
  //     {
  //       name: "Sales",
  //       key: "sales",
  //       route: "/dashboards/sales",
  //       component: <Sales />,
  //     },
  //   ],
  // },
];

export default routes;

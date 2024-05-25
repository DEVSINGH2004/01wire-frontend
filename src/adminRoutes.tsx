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
import UserManagement from "layouts/pages/user-management";
import Publications from "layouts/pages/publications";
import Releases from "layouts/pages/releases";
import Bundles from "layouts/pages/bundles";
// Material Dashboard 2 PRO React TS components
import ReleaseIcon from "assets/images/icons/sidebarRelease.svg";
import UserIcon from "assets/images/account_box.svg";
import PublicationIcon from "assets/images/publicationIcon.svg";
import BundleIcon from "assets/images/bundle.svg";
import PublishedOrder from "assets/images/published.svg";

const adminRoutes = [
  {
    type: "collapse",
    name: "PR Management",
    icon: <img src={ReleaseIcon} width="24px" height="24px" />,
    key: "releases",
    noCollapse: true,
    route: "/releases",
    component: <Releases />,
  },
  {
    type: "collapse",
    name: "User Management",
    icon: <img src={UserIcon} width="24px" height="24px" />,
    key: "userManagement",
    noCollapse: true,
    route: "/user-management",
    component: <UserManagement />,
  },
  {
    type: "collapse",
    name: "Publications",
    icon: <img src={PublicationIcon} width="24px" height="24px" />,
    key: "publications",
    noCollapse: true,
    route: "/publications",
    component: <Publications />,
  },
  {
    type: "collapse",
    name: "Bundles",
    icon: <img src={BundleIcon} width="24px" height="24px" />,
    key: "bundles",
    noCollapse: true,
    route: "/bundles",
    component: <Bundles />,
  },
  {
    type: "collapse",
    name: "Published Order",
    icon: <img src={PublishedOrder} width="24px" height="24px" />,
    key: "publishedOrder",
    noCollapse: true,
    route: "/published-order",
    component: <Dashboards />,
  },
];

export default adminRoutes;

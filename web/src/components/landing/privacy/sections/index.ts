import type { ComponentType } from "react";

import WhoWeAre from "./01-who-we-are";
import InformationWeCollect from "./02-information-we-collect";
import HowWeCollect from "./03-how-we-collect";
import HowWeUse from "./04-how-we-use";
import StorageAndSecurity from "./05-storage-and-security";
import Sharing from "./06-sharing";
import Retention from "./07-retention";
import YourRights from "./08-your-rights";
import ChildrenChanges from "./09-children-changes";

// `id` must match the <section id> inside each component; `title` is the
// shorter label shown in the table of contents.
export const POLICY_SECTIONS: {
  id: string;
  title: string;
  Component: ComponentType;
}[] = [
  { id: "who-we-are", title: "1. Who we are", Component: WhoWeAre },
  {
    id: "information-we-collect",
    title: "2. Information we collect",
    Component: InformationWeCollect,
  },
  {
    id: "how-we-collect",
    title: "3. How we collect information",
    Component: HowWeCollect,
  },
  { id: "how-we-use", title: "4. How we use information", Component: HowWeUse },
  {
    id: "storage-and-security",
    title: "5. Storage and security",
    Component: StorageAndSecurity,
  },
  {
    id: "sharing",
    title: "6. Sharing and third parties",
    Component: Sharing,
  },
  {
    id: "retention",
    title: "7. How long we keep information",
    Component: Retention,
  },
  {
    id: "your-rights",
    title: "8. Your rights and choices",
    Component: YourRights,
  },
  {
    id: "children-changes",
    title: "9. Children, changes and contact",
    Component: ChildrenChanges,
  },
];

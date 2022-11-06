// Import your Client Component

import Planning from "components/Planning";
import poolsScraping from "../scraping/pools";

export default async function Page() {
  const pools = await poolsScraping();

  switch (pools) {
    case null:
      return <div />;
    default:
      return <Planning activities={pools} />;
  }
}

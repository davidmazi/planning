import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Activity, ActivityType } from "../types/common.types";
import dynamic from "next/dynamic";
import { poolNames } from "../types/activities.types";
import { SchedulerExistingEvent } from "@cubedoodl/react-simple-scheduler/dist/types/types";
import { DateTime } from "luxon";

const Scheduler = dynamic(
  () => import("@cubedoodl/react-simple-scheduler").then((a) => a.Scheduler),
  { ssr: false }
);

const Home: NextPage = () => {
  const [selected, setSelected] = useState(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);

  // Retrieve activities from API
  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((res) => setActivities(res));
  }, []);

  const [events, setEvents] = useState<SchedulerExistingEvent[]>([]);

  // Map activities to events
  useEffect(() => {
    const mappedActivities: SchedulerExistingEvent[] = [];
    activities.forEach((activity) => {
      console.log(activity);
      if (activity.type === ActivityType.pool) {
        mappedActivities.push({
          from: DateTime.fromISO(
            new Date(activity.start).toISOString()
          ).toJSDate(),
          to: DateTime.fromISO(new Date(activity.end).toISOString()).toJSDate(),
          name:
            poolNames.find((poolName) => poolName.id === activity.poolId)
              ?.name || "No Name",
          calendar: { name: "", enabled: true },
          repeat: 0,
          is_current: false,
          style: {
            filter: `hue-rotate(${Number(activity.poolId) * 10}deg)`,
          },
        });
      }
    });
    setEvents(mappedActivities);
  }, [activities]);

  return (
    <div>
      <Head>
        <title>Planning App</title>
        <meta name="description" content="Timetable Scheduler App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
        role="main"
      >
        {events && events.length > 0 && (
          <Scheduler
            editable={false}
            events={events}
            selected={selected}
            setSelected={setSelected}
            onRequestAdd={(evt) => console.log(evt)}
            onRequestEdit={(evt) => alert("Edit element requested")}
            style={{
              container: { width: "100%", height: "85vh" },
              head: { width: "95%" },
              body: {
                height: "100%",
                width: "100%",
              },
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Home;

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
    const mappedActivities: SchedulerExistingEvent[] = activities.map(
      (activity) => {
        return {
          from: DateTime.fromISO(activity.start).toJSDate(),
          to: DateTime.fromISO(activity.end).toJSDate(),
          name:
            activity.type === ActivityType.pool
              ? poolNames.find((poolName) => poolName.id === activity.poolId)
                  ?.name || "No Name"
              : "N/A",
          calendar: { name: "", enabled: true },
          repeat: 0,
          is_current: false,
        };
      }
    );
    setEvents(mappedActivities);
  }, [activities]);
  return (
    <div>
      <Head>
        <title>Planning App</title>
        <meta name="description" content="Timetable Scheduler App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {events && events.length > 0 && (
          <Scheduler
            events={events}
            selected={selected}
            setSelected={setSelected}
            style={{
              container: { width: "100%" },
              head: { width: "100vw" },
              body: {
                height: "100vh",
                width: "100vw",
              },
            }}
            onRequestAdd={(evt) => evt}
            onRequestEdit={(evt) => alert("Edit element requested")}
          />
        )}
      </main>
    </div>
  );
};

export default Home;

import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Activity, ActivityType } from "../types/common.types";
import dynamic from "next/dynamic";
import { poolNames } from "../types/activities.types";
import {
  SchedulerEvent,
  SchedulerExistingEvent,
} from "@cubedoodl/react-simple-scheduler/dist/types/types";
import { DateTime } from "luxon";

const Scheduler = dynamic(
  () => import("@cubedoodl/react-simple-scheduler").then((a) => a.Scheduler),
  { ssr: false }
);

const MobileScheduler = dynamic(
  () =>
    import("@cubedoodl/react-simple-scheduler").then((a) => a.MobileScheduler),
  { ssr: false }
);

const Home: NextPage = () => {
  const [mobileView, setMobileView] = useState<boolean>();

  useEffect(() => {
    setMobileView(window.innerWidth > 800);

    function resize() {
      setMobileView(window.innerWidth > 800);
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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
      if (activity.type === ActivityType.pool) {
        const poolNameIndex = poolNames.findIndex(
          (poolName) => poolName.id === activity.poolId
        );
        mappedActivities.push({
          from: DateTime.fromISO(
            new Date(activity.start).toISOString()
          ).toJSDate(),
          to: DateTime.fromISO(new Date(activity.end).toISOString()).toJSDate(),
          name: poolNames[poolNameIndex].name,
          calendar: { name: "", enabled: true },
          repeat: 0,
          is_current: false,
          style: {
            backgroundImage: `url("/waves.svg")`,
            backgroundPositionY: "bottom",
            backgroundRepeat: "repeat-x",
            filter: `hue-rotate(${poolNameIndex * 30}deg)`,
          },
        });
      }
    });
    setEvents(mappedActivities);
  }, [activities]);

  function alertForEvent(evt?: SchedulerEvent) {
    if (evt) {
      const eventName = Object.hasOwn(evt, "name")
        ? (evt as SchedulerExistingEvent)["name"]
        : "N/A";
      alert(
        `${eventName}
The ${evt.from.toLocaleDateString()} from ${evt.from.toLocaleTimeString()} to ${evt.to.toLocaleTimeString()}`
      );
    }
  }

  return (
    <div>
      <Head>
        <title>Planning App</title>
        <meta name="description" content="Timetable Scheduler App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main role="main">
        {events && events.length > 0 && (
          <>
            {mobileView ? (
              <Scheduler
                editable={false}
                events={events}
                selected={selected}
                setSelected={setSelected}
                onRequestAdd={(evt) => alert(`Can't add event`)}
                onRequestEdit={(evt) => alertForEvent(evt)}
                style={{
                  container: { width: "100%", height: "85vh" },
                  head: { width: "95%" },
                  body: {
                    height: "100%",
                    width: "100%",
                  },
                }}
              />
            ) : (
              <MobileScheduler
                events={events}
                onRequestEdit={(evt) => alertForEvent(evt)}
                style={{
                  event: {},
                  box: {},
                  container: { width: "100vw", height: "95vh" },
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

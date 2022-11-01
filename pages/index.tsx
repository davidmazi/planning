import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Activity, ActivityType } from "../types/common.types";
import { poolNames } from "../types/activities.types";
import { SchedulerExistingEvent } from "@cubedoodl/react-simple-scheduler/dist/types/types";
import { DateTime } from "luxon";
import TimeTable from "../components/TimeTable";
import FilterSelect from "../components/FilterSelect";

const Home: NextPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  // Retrieve activities from API
  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((res) => setActivities(res));
  }, []);

  const [events, setEvents] = useState<SchedulerExistingEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState(events);

  // Map activities to events
  useEffect(() => {
    if (activities) {
      const mappedActivities: SchedulerExistingEvent[] = [];
      if (activities.length > 0)
        activities.forEach((activity) => {
          if (activity.type === ActivityType.pool) {
            const poolNameIndex = poolNames.findIndex(
              (poolName) => poolName.id === activity.poolId
            );
            mappedActivities.push({
              from: DateTime.fromISO(
                new Date(activity.start).toISOString()
              ).toJSDate(),
              to: DateTime.fromISO(
                new Date(activity.end).toISOString()
              ).toJSDate(),
              name: poolNames[poolNameIndex].name,
              calendar: { name: "", enabled: true },
              repeat: 0,
              is_current: false,
              style: {
                backgroundImage: `url("/waves.svg")`,
                backgroundPositionY: "bottom",
                backgroundRepeat: "repeat-x",
                filter: `hue-rotate(${poolNameIndex * 30}deg)`
              }
            });
          }
        });
      setEvents(mappedActivities);
    }
  }, [activities]);

  //Reset filteredEvents when events gets updated
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  return (
    <div>
      <Head>
        <title>Planning App</title>
        <meta name="description" content="Timetable TimeTable App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main role="main">
        {events && events.length > 0 && (
          <>
            <FilterSelect events={events} setEvents={setFilteredEvents} />
            <TimeTable events={filteredEvents} />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;

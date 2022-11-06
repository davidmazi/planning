"use client";
import React, { useEffect, useState } from "react";
import { Activity, ActivityTypeEnum } from "../types/common.types";
import { SchedulerExistingEvent } from "@cubedoodl/react-simple-scheduler/dist/types/types";
import { poolNames } from "../scraping/types/activities.types";
import { DateTime } from "luxon";
import FilterSelect from "./common/FilterSelect";
import TimeTable from "./common/TimeTable";

type Props = { activities: Activity[] };

const Planning: React.FC<Props> = ({ activities }) => {
  // TODO getFromServerProps for SSR
  const [events, setEvents] = useState<SchedulerExistingEvent[]>([]);

  const [filteredEvents, setFilteredEvents] = useState(events);

  // Map activities to events
  useEffect(() => {
    if (activities) {
      const mappedActivities: SchedulerExistingEvent[] = [];
      if (activities.length > 0)
        activities.forEach((activity) => {
          switch (activity.type) {
            case ActivityTypeEnum.pool:
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
                  filter: `hue-rotate(${poolNameIndex * 30}deg)`,
                },
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

export default Planning;

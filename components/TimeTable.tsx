import React, { FunctionComponent, useEffect, useState } from "react";
import {
  SchedulerEvent,
  SchedulerExistingEvent
} from "@cubedoodl/react-simple-scheduler/dist/types/types";
import dynamic from "next/dynamic";

const Scheduler = dynamic(
  () => import("@cubedoodl/react-simple-scheduler").then((a) => a.Scheduler),
  { ssr: false }
);

const MobileScheduler = dynamic(
  () =>
    import("@cubedoodl/react-simple-scheduler").then((a) => a.MobileScheduler),
  { ssr: false }
);

type Props = { events: SchedulerExistingEvent[] };

const TimeTable: FunctionComponent<Props> = ({ events }) => {
  const [desktopView, setDesktopView] = useState<boolean>();

  useEffect(() => {
    setDesktopView(window.innerWidth > 800);

    function resize() {
      setDesktopView(window.innerWidth > 800);
    }

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const [selected, setSelected] = useState(new Date());

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
    <>
      {desktopView ? (
        <Scheduler
          editable={false}
          events={events}
          selected={selected}
          setSelected={setSelected}
          onRequestAdd={(evt) => alert(`Can't add event`)}
          onRequestEdit={(evt) => alertForEvent(evt)}
          style={{
            container: {
              width: "100%", height: "85vh"
            },
            head: { width: "95%" },
            body: {
              height: "100%",
              width: "100%"
            }
          }}
        />
      ) : (
        <MobileScheduler
          events={events}
          onRequestEdit={(evt) => alertForEvent(evt)}
        />
      )}
    </>
  );
};

export default TimeTable;

import React, { Dispatch, FunctionComponent } from "react";
import { SchedulerExistingEvent } from "@cubedoodl/react-simple-scheduler/dist/types/types";
import Select from "react-select";
import makeAnimated from "react-select/animated";

type Props = {
  events: SchedulerExistingEvent[];
  setEvents: Dispatch<SchedulerExistingEvent[]>;
};

type ValueLabel = { value: string; label: string };

const animatedComponents = makeAnimated();

const FilterSelect: FunctionComponent<Props> = ({ events, setEvents }) => {
  const individualEventValues = events.reduce((acc, curr) => {
    if (!acc.some((accEvent) => accEvent.label === curr.name))
      acc.push({ value: curr.name, label: `${curr.name}` });
    return acc;
  }, new Array<ValueLabel>());

  const handleChange = (values: ValueLabel[]) => {
    const filteredEvents = events.filter((event) => {
      return !values.some((value) => value.label === event.name);
    });
    setEvents(filteredEvents);
  };

  return (
    <div className="filter-select">
      <Select
        onChange={(values) => handleChange(values as ValueLabel[])}
        placeholder="Select to hide events"
        closeMenuOnSelect={false}
        components={animatedComponents}
        defaultValue={[]}
        isMulti
        options={individualEventValues}
      />
    </div>
  );
};

export default FilterSelect;

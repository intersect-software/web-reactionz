import { useEffect, useMemo, useState } from "react";
import { Input, InputGroup, SelectPicker } from "rsuite";
import TimeIcon from "@rsuite/icons/Time";

type Unit = "second" | "minute" | "hour" | "day";
const UNIT_SECOND_MULTIPLIERS: { [k in Unit]: number } = {
  second: 1,
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
};

const convertSecondsToBiggerTimeUnit = (
  seconds: number
): { period: number; unit: Unit } => {
  let largestUnit: Unit = "second";
  Object.entries(UNIT_SECOND_MULTIPLIERS).forEach(([unit, multiplier]) => {
    if (seconds > multiplier) largestUnit = unit as Unit;
  });

  return {
    period: Math.floor(seconds / UNIT_SECOND_MULTIPLIERS[largestUnit]),
    unit: largestUnit,
  };
};

export default function TimePeriodPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (seconds: number) => void;
}) {
  const unitDetails = useMemo(
    () => convertSecondsToBiggerTimeUnit(value),
    [value]
  );

  const [timePeriod, setTimePeriod] = useState<number>(unitDetails.period);
  const [timeUnit, setTimeUnit] = useState<Unit>(unitDetails.unit);

  useEffect(() => {
    const seconds = timePeriod * UNIT_SECOND_MULTIPLIERS[timeUnit];
    onChange(seconds);
  }, [timePeriod, timeUnit]);

  return (
    <InputGroup>
      <InputGroup.Addon>
        <TimeIcon />
      </InputGroup.Addon>
      <Input
        value={timePeriod}
        type="number"
        min="0"
        onChange={(v) => setTimePeriod(+v)}
      />
      <SelectPicker
        appearance="subtle"
        data={Object.keys(UNIT_SECOND_MULTIPLIERS).map((k) => ({
          value: k,
          label: `${k}s`,
        }))}
        value={timeUnit}
        cleanable={false}
        searchable={false}
        onChange={(v) => setTimeUnit(v! as Unit)}
      />
    </InputGroup>
  );
}

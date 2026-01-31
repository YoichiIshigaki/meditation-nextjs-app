import { useGetApi } from "@/hooks/useApi";

// curl http://localhost:3000/api/dashboard/user_id?type=past_meditation
export const usePastMeditation = () => {
  // past_meditation
  const apiPathPrefix = "/api/dashboard";
  const { isPending, error, data, isSuccess } = useGetApi(
    `${apiPathPrefix}`,
    { type: "past_meditation" },
    "past_meditation",
  );
  return { isPending, error, data, isSuccess };
};

// curl http://localhost:3000/api/dashboard/user_id?type=mindfulness_meter&start_date=2024-01-01&end_date=2024-01-03
export const useMindfulnessMeter = (range: {
  startDate: Date;
  endDate: Date;
}) => {
  // mindfulness_meter
  const apiPathPrefix = "/api/dashboard";
  const params = {
    start_date: range.startDate.toISOString(),
    end_date: range.endDate.toISOString(),
  };
  const { isPending, error, data, isSuccess } = useGetApi(
    `${apiPathPrefix}`,
    { type: "mindfulness_meter", ...params },
    "mindfulness_meter",
  );
  return { isPending, error, data, isSuccess };
};

// curl http://localhost:3000/api/dashboard/user_id?type=meditation_calender&start_date=2024-01-01&end_date=2024-01-03
export const useMeditationCalender = (range: {
  startDate: Date;
  endDate: Date;
}) => {
  // mindfulness_meter
  const apiPathPrefix = "/api/dashboard";
  const params = {
    start_date: range.startDate.toISOString(),
    end_date: range.endDate.toISOString(),
  };
  const { isPending, error, data, isSuccess } = useGetApi(
    `${apiPathPrefix}`,
    { type: "mindfulness_meter", ...params },
    "mindfulness_meter",
  );
  return { isPending, error, data, isSuccess };
};

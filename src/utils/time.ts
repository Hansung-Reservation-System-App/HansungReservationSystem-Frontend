// startTime / endTime JSON
export const toFirestoreTimestamp = (date: Date) => {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanos: 0,
  };
};

// Add hours
export const addHours = (date: Date, hours: number) => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

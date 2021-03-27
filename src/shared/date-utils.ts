const timestampToDate = (timestamp: string) => {
  const values = timestamp.split(/[\s-:]/);
  if (values.length !== 6) {
    throw new Error(
      `Error transforming string to date, string don't match format YYYY-MM-DD HH:MM:SS. ${timestamp}`
    );
  }

  const [year, month, date, hours, minutes, seconds] = values.map(Number);
  return new Date(year, month - 1, date, hours, minutes, seconds);
};

export { timestampToDate };

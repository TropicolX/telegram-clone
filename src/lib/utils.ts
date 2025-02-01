export const getLastSeen = (lastActive: string) => {
  if (!lastActive) {
    return 'last seen a long time ago';
  }
  const lastActiveDate = new Date(lastActive);
  const currentDate = new Date();
  const diff = currentDate.getTime() - lastActiveDate.getTime();
  const days = diff / (1000 * 60 * 60 * 24);

  if (days < 1) {
    return 'last seen recently';
  } else if (days < 7) {
    return 'last seen within a week';
  } else if (days < 30) {
    return 'last seen within a month';
  } else {
    return 'last seen a long time ago';
  }
};

export const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const formatDate = (date: Date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday = date >= today;
  const isYesterday = date >= yesterday && date < today;
  const isWithinWeek =
    date >= new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);

  if (isToday) {
    return 'Today';
  } else if (isYesterday) {
    return 'Yesterday';
  } else if (isWithinWeek) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return `${date.toLocaleDateString('en-US', {
      month: 'short',
    })} ${date.getDate()}${getOrdinalSuffix(date.getDate())}`;
  }
};

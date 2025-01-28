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

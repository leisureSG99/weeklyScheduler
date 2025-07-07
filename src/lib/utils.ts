export const getBackgroundColorByType = (type: string): string => {
  switch (type) {
    case 'Meeting':
      return 'bg-purple-500 text-white';
    case 'Task':
      return 'bg-blue-500 text-white';
    case 'Reminder':
      return 'bg-yellow-500';
    case 'KPI':
      return 'bg-gray-700 text-white';
    default:
      return 'bg-green-500 text-white';
  }
}; 
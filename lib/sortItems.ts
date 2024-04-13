import ListItem from "@/lib/model/listItem";

export function sortItemsByCompleted(a: ListItem, b: ListItem): number {
  if(a.dateCompleted && b.dateCompleted) {
    if(a.dateCompleted < b.dateCompleted)
      return 1;
    else if(b.dateCompleted < a.dateCompleted)
      return -1;
    else
      return 0;
  }

  if(a.status == 'Completed' && b.status != 'Completed')
    return 1;
  if(b.status == 'Completed' && a.status != 'Completed')
    return -1;

  return 0;
}

export function sortItemsByIndex(a: ListItem, b: ListItem): number {
  if(a.sectionIndex > b.sectionIndex)
    return 1;
  if(b.sectionIndex > a.sectionIndex)
    return -1;

  return 0;
}
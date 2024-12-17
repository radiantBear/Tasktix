import { sortItems } from "./sortItems";
import ListItem from '@/lib/model/listItem';

test('High priority items are sorted before low priority ones', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Paused",
      priority: "Low",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: new Date("2024-07-24T01:23:45.000Z"),
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Paused",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: new Date("2024-07-24T01:23:45.000Z"),
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Paused",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: new Date("2024-07-24T01:23:45.000Z"),
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Paused",
      priority: "Low",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: new Date("2024-07-24T01:23:45.000Z"),
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, false));

  expect(result).toMatchObject(expected);
});

test('Items completed most recent are sorted before items completed longer ago', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: new Date("2024-07-24T01:23:45.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: new Date("2024-07-24T01:23:47.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: new Date("2024-07-24T01:23:47.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: new Date("2024-07-24T01:23:45.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, false));

  expect(result).toMatchObject(expected);
});

test('Incomplete items are sorted before completed items', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: new Date("2024-07-24T01:23:47.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 512906,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: new Date("2024-07-24T01:23:47.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, false));

  expect(result).toMatchObject(expected);
});

test('When due dates are active, items due first are sorted before items due later', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-25T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-25T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, true));

  expect(result).toMatchObject(expected);
});

test('When due dates are active, items without due dates are sorted before item with due dates', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, true));

  expect(result).toMatchObject(expected);
});

test('When due dates are active, items without due dates are not reordered relative to each other', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "First item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Second item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "First item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Second item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: null,
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, true));

  expect(result).toMatchObject(expected);
});

test('Identical items are both returned', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Unstarted",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: null,
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, true));

  expect(result).toMatchObject(expected);
});

test('Items completed at the same time are both returned', () => {
  const data: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: new Date("2024-07-26T03:36:23.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: new Date("2024-07-26T03:36:23.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];
  const expected: ListItem[] = [
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: new Date("2024-07-26T03:36:23.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    },
    {
      id: "aaaaaaaaaaaaaaaa",
      name: "Some item",
      status: "Completed",
      priority: "High",
      isUnclear: false,
      expectedMs: 5400000,
      elapsedMs: 0,
      sectionIndex: 5,
      dateCreated: new Date("2024-07-23T23:21:27.000Z"),
      dateDue: new Date("2024-07-27T00:00:00.000Z"),
      dateStarted: null,
      dateCompleted: new Date("2024-07-26T03:36:23.000Z"),
      assignees: [],
      tags: [
        { id: "2FQnwqjtBIrAMszw", name: "Bug", color: "Red" },
        { id: "KP0VT3jRol43jK9P", name: "Tests", color: "Yellow" }
      ],
      listId: "1On1rU4RinRQlllI",
      sectionId: "llUKnepuhpGy71vG"
    }
  ];

  const result = data.sort(sortItems.bind(null, false, true));

  expect(result).toMatchObject(expected);
});
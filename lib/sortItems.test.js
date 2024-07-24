const { describe } = require("node:test");
const { sortItems } = require("./sortItems");

describe('Works correctly for lists with no due dates or time tracking', () => {
  test('High priority items are sorted before low priority ones', () => {
    const data = [
      {
        id: "aaaaaaaaaaaaaaaa",
        name: "First item",
        status: "Unstarted",
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
        name: "First item",
        status: "Unstarted",
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
    const expected = [
      {
        id: "aaaaaaaaaaaaaaaa",
        name: "First item",
        status: "Unstarted",
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
        name: "First item",
        status: "Unstarted",
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
});
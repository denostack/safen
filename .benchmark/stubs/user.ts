function repeatArray<T>(n: number, fn: (idx: number) => T): T[] {
  return Array.from({ length: n }, (_, idx) => fn(idx));
}

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomUser() {
  return {
    id: random(1, 100000),
    email: "wan2land@gmail.com",
    name: "wan2land",
    articles: repeatArray(20, (i) => ({
      id: i,
      title: `title ${i}`,
      content: `content ${i}`,
      comments: repeatArray(3, (i) => ({
        id: i,
        contents: `contents ${i}`,
        createdAt: {
          timestamp: 1671926400000,
          offset: 0,
        },
      })),
      updatedAt: {
        timestamp: 1671926400000,
        offset: 0,
      },
      createdAt: {
        timestamp: 1671926400000,
        offset: 0,
      },
    })),
    comments: repeatArray(3, (i) => ({
      id: i,
      contents: `contents ${i}`,
      createdAt: {
        timestamp: 1671926400000,
        offset: 0,
      },
    })),
    location: "Seoul",
    createdAt: {
      timestamp: 1671926400000,
      offset: 0,
    },
  };
}

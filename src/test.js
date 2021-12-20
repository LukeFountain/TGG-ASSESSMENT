it("test", () => {
  expect(createSearchParams({ x: 3, y: 4 })).toBe(`location:x${3}, y:${4}`);
});

function createSearchParams(location) {
  return `location:x${location.x}, y:${location.y}`;
}

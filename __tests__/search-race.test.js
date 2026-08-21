/** This models the sequence guard used in useProducts: late results cannot replace newer input. */
test('a stale search result cannot overwrite a newer query', async () => {
  let activeRequest = 0;
  let displayed = [];
  const deferred = () => { let resolve; const promise = new Promise((r) => { resolve = r; }); return { promise, resolve }; };
  const first = deferred(); const second = deferred();
  const load = async (request) => { const id = ++activeRequest; const result = await request.promise; if (id === activeRequest) displayed = result; };
  const oldSearch = load(first); const newSearch = load(second);
  second.resolve(['new query']); await newSearch;
  first.resolve(['old query']); await oldSearch;
  expect(displayed).toEqual(['new query']);
});

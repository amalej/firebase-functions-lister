import { loadFunctionsConfig } from "../src";

describe("Test loading of Firebase Functions Config (Node.js)", () => {
  let config: any = {};
  beforeAll(async () => {
    config = await loadFunctionsConfig("./__tests__/firebase-proj");
  });

  it("should load codebase in correct order", async () => {
    expect(config[0].codebase).toEqual("default");
    expect(config[1].codebase).toEqual("second-codebase");
    expect(config[2].codebase).toEqual("third-codebase");
  });

  it("should load functions from 'default' codebase", async () => {
    expect(config[0].functionNames.sort()).toMatchObject(
      [
        "helloWorldJs01",
        "groups.groupedFunctionJs01",
        "groups.groupedFunctionJs02",
        "onDocWrittenJs01",
      ].sort()
    );
  });

  it("should load functions from 'second-codebase' codebase", async () => {
    expect(config[1].functionNames.sort()).toMatchObject(
      [
        "helloWorldTs01",
        "helloWorldTs02",
        "grouped.helloWorldTsGrouped01",
      ].sort()
    );
  });

  it("should load functions from 'third-codebase' codebase", async () => {
    expect(config[2].functionNames.sort()).toMatchObject(
      [
        "helloWorldJsEs01",
        "groups.groupedHelloWorldJsEs01",
        "groups.groupedHelloWorldJsEs02",
      ].sort()
    );
  });
});

describe("Test failed loading of Firebase Functions Config (Node.js)", () => {
  it("should return empty functions since TypeScript has not been built", async () => {
    const config = await loadFunctionsConfig(
      "./__tests__/firebase-proj-unbuilt-ts"
    );

    expect(config[0].functions).toEqual({});
  });
});

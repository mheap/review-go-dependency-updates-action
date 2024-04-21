const fs = require("fs");

const action = require(".");
const core = require("@actions/core");
const github = require("@actions/github");

const { when } = require("jest-when");
const mockedEnv = require("mocked-env");
const nock = require("nock");
nock.disableNetConnect();

const owner = "mheap";
const repo = "go-project";

describe("Go dependency Updates", () => {
  let restore;
  let restoreTest;

  beforeEach(() => {
    restore = mockedEnv({
      GITHUB_EVENT_NAME: "issue",
      GITHUB_EVENT_PATH: "/github/workspace/event.json",
      GITHUB_WORKFLOW: "demo-workflow",
      GITHUB_ACTION: "go-review-dependency-updates",
      GITHUB_ACTOR: "mheap",
      GITHUB_REPOSITORY: "mheap/test-go-deps",
      GITHUB_WORKSPACE: "/github/workspace",
      GITHUB_SHA: "e21490305ed7ac0897b7c7c54c88bb47f7a6d6c4",
      INPUT_TOKEN: "this_is_invalid",
    });
    jest.mock("fs");

    core.setOutput = jest.fn();
    core.setFailed = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    restore();
    restoreTest();
    jest.resetModules();
    jest.resetAllMocks();

    if (!nock.isDone()) {
      throw new Error(
        `Not all nock interceptors were used: ${JSON.stringify(
          nock.pendingMocks()
        )}`
      );
    }
    nock.cleanAll();
  });

  describe("foo", () => {
    it("runs", async () => {
      restoreTest = mockPr({});

      await action();

      expect(core.setOutput).toBeCalledTimes(1);
      expect(core.setOutput).toBeCalledWith("status", "success");
    });
  });
});

function mockPr(envParams = {}) {
  const payload = {
    pull_request: { number: 1 },
  };
  return mockEvent(
    {
      action: "opened",
      ...payload,
    },
    envParams
  );
}

function mockEvent(mockPayload, envParams = {}) {
  github.context.payload = mockPayload;
  const r = mockedEnv(envParams);
  return r;
}

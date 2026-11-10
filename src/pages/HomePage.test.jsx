import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "../test/test-utils";

const laneArticle = (lane, source) => ({
  title: `Top story from ${source}`,
  url: `https://news.google.com/rss/articles/${lane}-story`,
  image: null,
  source,
  published: "2026-07-03T04:12:11.000Z",
  lane,
});

const fakeNewsResponse = {
  liberal: [laneArticle("liberal", "MSNBC")],
  conservative: [laneArticle("conservative", "Fox News")],
  neutral: [laneArticle("neutral", "NPR")],
};

const fakeStoriesResponse = {
  stories: [
    {
      id: "abc",
      title: "House elects a new leader",
      outletCount: 5,
      missingLanes: ["conservative"],
      lanes: {
        liberal: [
          {
            title: "Liberal take on the new leader",
            url: "https://example.com/liberal-take",
            source: "HuffPost",
            lane: "liberal",
          },
        ],
        conservative: [],
        neutral: [
          {
            title: "Neutral take on the new leader",
            url: "https://example.com/neutral-take",
            source: "AP",
            lane: "neutral",
          },
        ],
      },
    },
  ],
};

const fakeApi = (url) =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve(
        String(url).includes("/stories")
          ? fakeStoriesResponse
          : fakeNewsResponse,
      ),
  });

describe("HomePage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(fakeApi),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads all three lanes without requiring a login", async () => {
    renderWithProviders(<HomePage />);

    expect(
      await screen.findByRole("heading", { name: "Liberal", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Conservative", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Neutral", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Top story from MSNBC").length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getAllByText("Top story from Fox News").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Top story from NPR").length).toBeGreaterThan(0);
  });

  it("requests news from the Newsful API with the search query", async () => {
    renderWithProviders(<HomePage />);
    await screen.findByRole("heading", { name: "Liberal", level: 2 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/news$/),
      expect.anything(),
    );
  });

  it("shows an error state with retry when the news API is down", async () => {
    fetch.mockImplementation(() => Promise.reject(new Error("network down")));
    renderWithProviders(<HomePage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /couldn.t load the news/i,
    );
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});

describe("HomePage search", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(fakeApi),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows matched stories side by side, flagging lanes with no coverage", async () => {
    renderWithProviders(<HomePage />);
    expect(
      await screen.findByRole("heading", { name: "House elects a new leader" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Liberal take on the new leader" }),
    ).toHaveAttribute("href", "https://example.com/liberal-take");
    expect(
      screen.getByRole("link", { name: "Neutral take on the new leader" }),
    ).toBeInTheDocument();
    expect(screen.getByText("No coverage found")).toBeInTheDocument();
  });

  it("hides matched stories during a search", async () => {
    renderWithProviders(<HomePage />, { route: "/?q=climate" });
    await screen.findByRole("heading", { name: "Liberal", level: 2 });
    expect(
      screen.queryByRole("heading", { name: /same story/i }),
    ).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalledWith(
      expect.stringMatching(/\/stories$/),
      expect.anything(),
    );
  });

  it("still shows the lanes when matched stories fail to load", async () => {
    fetch.mockImplementation((url) =>
      String(url).includes("/stories")
        ? Promise.resolve({ ok: false, status: 502 })
        : fakeApi(url),
    );
    renderWithProviders(<HomePage />);
    expect(
      await screen.findByRole("heading", { name: "Liberal", level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /same story/i }),
    ).not.toBeInTheDocument();
  });

  it("runs the search from the URL so results can be shared", async () => {
    renderWithProviders(<HomePage />, { route: "/?q=climate" });
    await screen.findByRole("heading", { name: "Liberal", level: 2 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/news\?q=climate$/),
      expect.anything(),
    );
    expect(screen.getByRole("searchbox")).toHaveValue("climate");
  });
});

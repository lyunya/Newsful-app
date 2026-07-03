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

describe("HomePage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(fakeNewsResponse),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads all three lanes without requiring a login", async () => {
    renderWithProviders(<HomePage />);

    expect(
      await screen.findByRole("heading", { name: "Liberal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Conservative" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Neutral" }),
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
    await screen.findByRole("heading", { name: "Liberal" });
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

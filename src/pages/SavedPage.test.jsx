import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import SavedPage from "./SavedPage";
import { renderWithProviders, sampleArticle } from "../test/test-utils";
import config from "../config";

describe("SavedPage", () => {
  it("shows an empty state for new visitors", () => {
    renderWithProviders(<SavedPage />);
    expect(screen.getByText(/nothing saved yet/i)).toBeInTheDocument();
  });

  it("shows guest bookmarks from localStorage", () => {
    window.localStorage.setItem(
      config.GUEST_SAVES_KEY,
      JSON.stringify([sampleArticle]),
    );
    renderWithProviders(<SavedPage />);
    expect(screen.getByText(sampleArticle.title)).toBeInTheDocument();
    expect(
      screen.getByText(/bookmarks are stored on this device/i),
    ).toBeInTheDocument();
  });

  it("groups saved bookmarks by political leaning and topic", () => {
    window.localStorage.setItem(
      config.GUEST_SAVES_KEY,
      JSON.stringify([
        {
          title: "Senate passes a new tax bill",
          url: "https://www.huffpost.com/entry/tax-bill",
          source: "HuffPost",
        },
        {
          title: "NFL record-holder reflects on playoff race",
          url: "https://www.foxnews.com/sports/playoff-race",
          source: "Fox News",
        },
        {
          title: "NASA launches new space telescope mission",
          url: "https://www.npr.org/space-telescope",
          source: "NPR",
        },
      ]),
    );

    renderWithProviders(<SavedPage />);

    expect(
      screen.getByRole("heading", { name: "Liberal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Conservative" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Neutral" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Politics" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sports" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Science & Tech" }),
    ).toBeInTheDocument();
  });
});

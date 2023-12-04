import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { TableView } from "../theme/TableView";
import { LIST_COUNTRIES } from "../query";

const mockCountries = [
  {
    code: "US",
    name: "United States",
  },
  {
    code: "CA",
    name: "Canada",
  },
];

const mockQuery = [
  {
    request: {
      query: LIST_COUNTRIES,
      variables: {
        page: 1,
        perPage: 10,
      },
    },
    result: {
      data: {
        countries: mockCountries,
      },
    },
  },
];

describe("TableView Component", () => {
  it("renders without error", async () => {
    render(
      <MockedProvider mocks={mockQuery} addTypename={false}>
        <TableView />
      </MockedProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await screen.findByTestId("table-view");

    expect(screen.getByTestId("table-view")).toBeInTheDocument();
  });

  it("renders error message on query error", async () => {
    const errorMock = [
      {
        request: {
          query: LIST_COUNTRIES,
          variables: {
            page: 1,
            perPage: 10,
          },
        },
        error: new Error("An error occurred"),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <TableView />
      </MockedProvider>
    );

    expect(
      await screen.findByText("Error: An error occurred")
    ).toBeInTheDocument();
  });

  it("displays table with correct data", async () => {
    render(
      <MockedProvider mocks={mockQuery} addTypename={false}>
        <TableView />
      </MockedProvider>
    );

    await screen.findByTestId("table-view");

    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("CA")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  it("applies filtering when input value changes", async () => {
    render(
      <MockedProvider mocks={mockQuery} addTypename={false}>
        <TableView />
      </MockedProvider>
    );

    await screen.findByTestId("table-view");

    fireEvent.change(screen.getByTestId("input-view"), {
      target: { value: "US" },
    });

    expect(screen.getByText("US")).toBeInTheDocument();
    expect(screen.queryByText("CA")).not.toBeInTheDocument();
  });

  it("toggles between table styles on button click", async () => {
    render(
      <MockedProvider mocks={mockQuery} addTypename={false}>
        <TableView />
      </MockedProvider>
    );

    await screen.findByTestId("table-view");

    expect(
      screen.getByTestId("table-view").classList.contains("custom-table")
    ).toBe(true);

    fireEvent.click(screen.getByTestId("button-view"));

    expect(
      screen.getByTestId("table-view").classList.contains("react-table")
    ).toBe(true);
  });
});

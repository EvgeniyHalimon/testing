import { screen, render, act } from "@testing-library/react";
import axios from "axios";
import AsyncApp from "./AsyncApp";
import userEvent from "@testing-library/user-event";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const hits = [
  { objectID: "1", title: "Angular" },
  { objectID: "2", title: "React" },
];

describe("App", () => {
  it("fetches news from an API", async () => {
    mockedAxios.get.mockImplementationOnce(() => Promise.resolve({ data: { hits } }));
    const { getByRole, findAllByRole } = render(<AsyncApp />);
    userEvent.click(getByRole("button"));
    const items = await findAllByRole("listitem");
    expect(items).toHaveLength(2);
    // Additional
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      "http://hn.algolia.com/api/v1/search?query=React"
    );
  });

  it("fetches news from an api and reject", async() => {
    mockedAxios.get.mockImplementationOnce(() => Promise.reject(new Error()))
    const {getByRole, findByText} = render(<AsyncApp/>)
    userEvent.click(getByRole('button'))
    const message = await findByText(/Something went wrong/)
    expect(message).toBeInTheDocument()
  })

  it("fetches news from an api", async () => {
    const promise = Promise.resolve({data: {hits}})
    mockedAxios.get.mockImplementationOnce(() => promise)
    const {getByRole, getAllByRole} = render(<AsyncApp/>)
    userEvent.click(getByRole('button'))
    await act(() => promise)
    expect(getAllByRole("listitem")).toHaveLength(2)
  })
})
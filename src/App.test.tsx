import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe("App", () => {
  it("renders App component", async () => {
    await act(async () => {
      render(<App/>)
    })
    screen.debug()
    expect(screen.getByText(/Search:/i)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('search text...')).toBeInTheDocument()
    expect(screen.getByAltText('search image')).toBeInTheDocument()
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })

  it("trying queries", async () => {
    await act(async () => {
      render(<App/>)
    })
    expect(screen.queryByText(/Searches for React/i)).toBeNull()
    screen.debug()
    expect(await screen.findByText(/Logged in as/i)).toBeInTheDocument()
    screen.debug()
    expect(screen.getByAltText(/search image/i)).toHaveClass('image')
    expect(screen.getByLabelText(/search/i)).toBeRequired()
    expect(screen.getByLabelText(/search/i)).toBeEmptyDOMElement()
    expect(screen.getByLabelText(/search/i)).toHaveAttribute('id')
    //expect(screen.getByLabelText(/search/i)).not.toBeRequired()
  })

  it("fire events", async () => {
    render(<App/>)
    await screen.findByText(/Logged in as/i)
    expect(screen.queryByText(/Searches for React/)).toBeNull()
    screen.debug()
    /* fireEvent.change(screen.getByRole('textbox'), {
      target: {value : 'React'}
    })  заменяем на юзерЕвент*/
    userEvent.type(screen.getByRole('textbox'), "React")
    screen.debug()
    expect(screen.getByText(/Searches for React/)).toBeInTheDocument()
  })
})

describe('events', () => {
  it("checkbox click", () => {
    const handleChange = jest.fn()
    const {container} = render(
      <input type='checkbox' onChange={handleChange}/>
    )
    const checkbox = container.querySelectorAll("input[type='checkbox']")[0] as HTMLInputElement;
    expect(checkbox).not.toBeChecked();
    //fireEvent.click(checkbox);
    userEvent.click(checkbox)
    // userEvent.click(checkbox, {ctrlKey: true, shiftKey: true})
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  })

  it('input focus', () => {
    const {getByTestId} = render(
      <input type='text' data-testid='simple-input'/>
    )
    const input = getByTestId('simple-input')
    expect(input).not.toHaveFocus()
    input.focus()
    expect(input).toHaveFocus()
  })

  it('double click', () => {
    const onChange = jest.fn()
    const {container} = render(<input type="checkbox" onChange={onChange}/>)
    const checkbox = container.querySelectorAll("input[type='checkbox']")[0] as HTMLInputElement
    expect(checkbox).not.toBeChecked()
    userEvent.dblClick(checkbox)
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).not.toHaveBeenCalledTimes(1)
  })

  it("focus by tab", () => {
    const { getAllByTestId } = render(
      <div>
        <input data-testid="element" type="checkbox" />
        <input data-testid="element" type="radio" />
        <input data-testid="element" type="number" />
      </div>
    )
    const [checkbox, radio, number] = getAllByTestId('element')
    userEvent.tab()
    expect(checkbox).toHaveFocus()
    userEvent.tab()
    expect(radio).toHaveFocus()
    userEvent.tab()
    expect(number).toHaveFocus()
  })

  /*
  fires red like HELL
  it("select option", () => {
    const {selectOptions, getByRole, getByText} = render(
      <select>
        <option value="1">A</option>
        <option value="2">B</option>
        <option value="3">C</option>
      </select>
    )
    userEvent.selectOptions(getByRole("combobox"), "1")
    expect(getByText("A").selected).toBeTruthy()
    expect(getByText("B").selected).toBeFalsy()
  }) */
})

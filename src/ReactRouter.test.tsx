import { MemoryRouter, Routes, useLocation } from "react-router";
import { BrowserRouter, Link, Route, Router, useParams } from "react-router-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const About = () => <div>You are on the about page</div>
const Home = () => <div>You are home</div>
const NoMatch = () => <div>No match</div>

export const LocationDisplay = () => {
  const location = useLocation()

  return <div data-testid="location-display">{location.pathname}</div>
}
  
export const App = () => (
  <div>
    <Link to="/">Home</Link>

    <Link to="/about">About</Link>

    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="*" element={<NoMatch />} />
    </Routes>

    <LocationDisplay />
  </div>
)

// test utils file
const renderWithRouter = (ui: any, {route = '/'} = {}) => {
    window.history.pushState({}, 'Home', route)
  
    return {
      user: userEvent.setup(),
      ...render(ui, {wrapper: BrowserRouter}),
    }
  }

describe("React-router", () => {

  it('full app rendering/navigating', async () => {
    const {user} = renderWithRouter(<App />)
    expect(screen.getByText(/you are home/i)).toBeInTheDocument()
  
    await user.click(screen.getByText(/about/i))
  
    expect(screen.getByText(/you are on the about page/i)).toBeInTheDocument()
  })
  
  it('landing on a bad page', () => {
    renderWithRouter(<App />, {route: '/something-that-does-not-match'})
  
    expect(screen.getByText(/no match/i)).toBeInTheDocument()
  })
  
  it('rendering a component that uses useLocation', () => {
    const route = '/some-route'
    renderWithRouter(<LocationDisplay />, {route})
  
    expect(screen.getByTestId('location-display')).toHaveTextContent(route)
  })

  /* it('full app rendering/navigatin', async () => {
    render(<App />, {wrapper: BrowserRouter})
    const user = userEvent.setup()
  
    // verify page content for default route
    expect(screen.getByText(/you are home/i)).toBeInTheDocument()
  
    // verify page content for expected route after navigating
    await user.click(screen.getByText(/about/i))
    expect(screen.getByText(/you are on the about page/i)).toBeInTheDocument()
  })
  
  it('landing on a bad pag', () => {
    const badRoute = '/some/bad/route'
  
    // use <MemoryRouter> when you want to manually control the history
    render(
      <MemoryRouter initialEntries={[badRoute]}> 
        <App />
      </MemoryRouter>,
    )
  
    // verify navigation to "no match" route
    expect(screen.getByText(/no match/i)).toBeInTheDocument()
  })
  
  it('rendering a component that uses useLocatio', () => {
    const route = '/some-route'
  
    // use <MemoryRouter> when you want to manually control the history
    render(
      <MemoryRouter initialEntries={[route]}>
        <LocationDisplay />
      </MemoryRouter>,
    )
  
    // verify location display is rendered
    expect(screen.getByTestId('location-display')).toHaveTextContent(route)
  }) */
})
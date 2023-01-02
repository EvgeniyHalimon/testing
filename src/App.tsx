import { FC, ReactNode, useState,useEffect } from "react";
import "./App.css";
import AsyncApp from "./AsyncApp/AsyncApp";

interface ISearch{
  value: string, 
  onChange(e: any): void, 
  children: ReactNode
}

const getUser = () => Promise.resolve({ id: 1, name: "Holiday in Cambodia" });

const Search:FC<ISearch> = ({ value, onChange, children }) => (
  <div>
    <label htmlFor="search">{children}</label>
    <input 
      id="search" 
      type="text" 
      value={value} 
      onChange={onChange} 
      placeholder="search text..."
      required
    />
  </div>
);

const App = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>([]);

  useEffect(() => {
    const loadUser = async () => {
      const userData: any = await getUser();
      setUser(userData);
    };

    loadUser();
  }, []);

  const handleChange = (e:any): void => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div>
        {user && <h2>Logged in as {user?.name}</h2>}
        <img className="image" src="" alt="search image"/>
        <Search value={search} onChange={handleChange}>
          Search:
        </Search>
        <p>Searches for {search ? search : "..."}</p>
      </div>
      <AsyncApp/>
    </>
  );
};

export default App;
//import './App.css';
import { useState } from "react";

function Logo() {
  return (
    <h1>🌴Far Away 👜</h1>
  )
}
function Form({onAddItems}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  

  
  function handleSubmit(e) {
    e.preventDefault();

    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now()};

    onAddItems(newItem);

    setQuantity(1);
    setDescription("");
  }

  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do you need for your trip?</h3>
      <select value={quantity} onChange={(e)=>setQuantity(+e.target.value)}>
        {Array.from({length:20},(_, index) => index+1).map
          (num=><option value={num} key={num}>{num}</option>)

        }
      </select>
      <input type="text" placeholder="items..." value={description}
        onChange={(e)=>setDescription( e.target.value)}/>
      <button>Add</button>
    </form>
  )
}

function Item({item, onRemoveItem, onPackedItem}) {
  return (
    <li>
      <span style={item.packed ? {textDecoration: 'line-through'} : {}}>
        <input type="checkbox" 
        onChange={() => onPackedItem(item.id)}
        value={item.packed}/> {item.quantity} - {item.description}
      </span>  
      <button onClick={() => onRemoveItem(item.id)}>❌</button>
    </li>
  )
}

function PackingList({items, onRemoveItem, onPackedItem, onClearList}) {
 
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description") {
    sortedItems = items.slice().sort((a,b) => a.description.localeCompare(b.description)); 
  }
  if (sortBy === "packed") {
    sortedItems = items.slice().sort((a,b) => Number(a.packed) - Number(b.packed)); 
  }

  function handleSort(e) {
    setSortBy(e.target.value);
  }
  
  return (
    <div className='list'>
      <ul>
        {sortedItems.map((item) => (
          <Item key={item.id} item={item} onRemoveItem={onRemoveItem}
          onPackedItem={onPackedItem}/>
        ))}
      </ul>
      <div className="actions">
          <select value={sortBy} onChange={handleSort}>
            <option value="input">Sort by input order</option>
            <option value="description">Sort by description</option>
            <option value="packed">Sort by packed</option>
          </select>
          <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  )
}

function Stats({items}) {
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = (numPacked / numItems * 100).toFixed(2);

  return (
    <footer className="stats">
      <em>👜  `You have {numItems} items on your list and you already packed {numPacked} ({numItems !== 0 ? percentage : ""}%)`</em>
    </footer>
  )
}


function App() {
  const [items, setItems] = useState([]);

 

  function handleAddItem(item) {
    setItems((items)=>[...items,item]);
   
  }

  function handleRemoveItem(id) {
    //const newItem = items.filter(c => c.id !==id);
    //setItems(newItem);

    setItems((items) => items.filter(i => i.id !== id));
  }

  function handleClearList() {
    setItems([]);
  }
  function handlePacked(id) {

    setItems((items) => 
      items.map((item) => 
        item.id === id ? {...item, packed: !item.packed} : item
        //if (item.id === id) {
        //  return {
        //    ...item, packed: !item.packed
        //  }
        //}
        //return item;
    ))
    
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItem}/>
      <PackingList items={items} onRemoveItem={handleRemoveItem}
        onPackedItem={handlePacked}
        onClearList={handleClearList}/>
      <Stats items={items}/>
    </div>
  );
}

export default App;

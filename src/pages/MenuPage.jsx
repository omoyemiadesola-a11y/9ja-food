import { useEffect, useMemo, useState } from 'react';
import FoodCard from '../components/FoodCard';
import { useCart } from '../contexts/CartContext';
import { fetchFoods } from '../services/api';

const categories = ['All', 'African', 'Chinese', 'Fast Food', 'Pizza', 'Bakery', 'Breakfast'];

export default function MenuPage() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchFoods();
        setFoods(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filteredFoods = useMemo(() =>
    foods.filter((food) => {
      const byCategory = activeCategory === 'All' || food.category === activeCategory;
      const bySearch = food.name.toLowerCase().includes(search.toLowerCase());
      return byCategory && bySearch;
    }),
  [foods, activeCategory, search]);

  if (loading) return <div className="container section">Loading menu...</div>;

  return (
    <div className="container section">
      <div className="row-between wrap gap-sm">
        <h1>Menu</h1>
        <input
          className="input"
          placeholder="Search meals"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="chip-row mt-sm">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {error && <p className="error mt-sm">{error}</p>}

      <section className="grid foods-grid mt-md">
        {filteredFoods.map((food) => (
          <FoodCard key={food.id} food={food} onAdd={addToCart} />
        ))}
      </section>
    </div>
  );
}

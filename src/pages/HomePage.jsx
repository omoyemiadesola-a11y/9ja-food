import { Link } from 'react-router-dom';

const categories = ['African Meals', 'Chinese Dishes', 'Fast Food', 'Pizza', 'Bakery', 'Breakfast'];

export default function HomePage() {
  return (
    <div className="container section">
      <section className="hero">
        <div>
          <span className="badge">Fast delivery • Freshly served</span>
          <h1>Order your favorite meals in minutes.</h1>
          <p>Discover top local dishes, secure checkout, and trusted branch pickup.</p>
          <div className="actions">
            <Link className="btn btn-primary" to="/menu">Order Now</Link>
            <Link className="btn btn-secondary" to="/menu">View Menu</Link>
          </div>
        </div>
        <img
          src="public/9JAFoodJollofRice.png"
          alt="Food hero"
        />
      </section>

      <section className="section">
        <h2>Featured Categories</h2>
        <div className="grid categories-grid">
          {categories.map((category) => (
            <article key={category} className="card">
              <h3>{category}</h3>
              <p>Explore delicious {category.toLowerCase()} prepared daily.</p>
              <Link to="/menu" className="text-link">Browse</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

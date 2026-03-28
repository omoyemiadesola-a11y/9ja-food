export default function FoodCard({ food, onAdd }) {
  return (
    <article className="card">
      <img src={food.image_url} alt={food.name} className="card-image" />
      <h3>{food.name}</h3>
      <p>{food.description}</p>
      <div className="row-between mt-sm">
        <strong className="price">₦{Number(food.price).toLocaleString()}</strong>
        {onAdd && (
          <button className="btn btn-primary" onClick={() => onAdd(food)} type="button">
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}

export default function FoodCard({ food, onAdd }) {
  const mediaUrl = food.image_url || '';
  const isPdf = /\.pdf($|\?)/i.test(mediaUrl);

  return (
    <article className="card">
      {!mediaUrl ? (
        <div className="pdf-preview">
          <p className="small">No media uploaded yet.</p>
        </div>
      ) : isPdf ? (
        <div className="pdf-preview">
          <p className="small">PDF menu file uploaded for this item.</p>
          <a href={mediaUrl} target="_blank" rel="noreferrer" className="text-link">
            Open PDF
          </a>
        </div>
      ) : (
        <img src={mediaUrl} alt={food.name} className="card-image" />
      )}
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

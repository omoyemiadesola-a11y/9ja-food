import { useEffect, useState } from 'react';
import {
  deleteFood,
  deleteFoodWithToken,
  deleteLocation,
  deleteLocationWithToken,
  fetchFoods,
  fetchLocations,
  uploadToBucket,
  upsertFood,
  upsertFoodWithToken,
  upsertLocation,
  upsertLocationWithToken,
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { LOCAL_ADMIN_TOKEN } from '../utils/supabase';

const initialFoodForm = {
  name: '',
  description: '',
  price: '',
  category: 'African',
  image_url: '',
};

const initialLocationForm = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  image_url: '',
};

export default function AdminDashboard() {
  const { isLocalAdmin } = useAuth();
  const [foods, setFoods] = useState([]);
  const [locations, setLocations] = useState([]);
  const [foodForm, setFoodForm] = useState(initialFoodForm);
  const [locationForm, setLocationForm] = useState(initialLocationForm);
  const [foodImage, setFoodImage] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
  const [status, setStatus] = useState('');

  const loadData = async () => {
    const [foodData, locationData] = await Promise.all([fetchFoods(), fetchLocations()]);
    setFoods(foodData);
    setLocations(locationData);
  };

  useEffect(() => {
    loadData();
    const foodsChannel = supabase
      .channel('admin-foods-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'foods' },
        () => {
          loadData();
        },
      )
      .subscribe();

    const locationsChannel = supabase
      .channel('admin-locations-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'locations' },
        () => {
          loadData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(foodsChannel);
      supabase.removeChannel(locationsChannel);
    };
  }, []);

  const submitFood = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      let imageUrl = foodForm.image_url;
      if (foodImage) {
        imageUrl = await uploadToBucket('food-images', foodImage);
      }

      const payload = {
        ...foodForm,
        price: Number(foodForm.price),
        image_url: imageUrl,
      };
      if (isLocalAdmin) {
        await upsertFoodWithToken({ token: LOCAL_ADMIN_TOKEN, payload });
      } else {
        await upsertFood(payload);
      }

      setFoodForm(initialFoodForm);
      setFoodImage(null);
      await loadData();
      setStatus('Food saved and synced successfully.');
    } catch (error) {
      setStatus(`Food save failed: ${error.message}`);
    }
  };

  const submitLocation = async (event) => {
    event.preventDefault();
    setStatus('');
    try {
      let imageUrl = locationForm.image_url;
      if (locationImage) {
        imageUrl = await uploadToBucket('location-images', locationImage);
      }

      const payload = {
        ...locationForm,
        latitude: Number(locationForm.latitude),
        longitude: Number(locationForm.longitude),
        image_url: imageUrl,
      };
      if (isLocalAdmin) {
        await upsertLocationWithToken({ token: LOCAL_ADMIN_TOKEN, payload });
      } else {
        await upsertLocation(payload);
      }

      setLocationForm(initialLocationForm);
      setLocationImage(null);
      await loadData();
      setStatus('Location saved and synced successfully.');
    } catch (error) {
      setStatus(`Location save failed: ${error.message}`);
    }
  };

  return (
    <div className="container section">
      <h1>Admin Dashboard</h1>
      <p>Manage foods and locations with full CRUD control.</p>
      {status && <p className="mt-sm">{status}</p>}

      <div className="split-layout mt-md">
        <section>
          <h2>Foods</h2>
          <form className="card form" onSubmit={submitFood}>
            <input className="input" placeholder="Name" value={foodForm.name} onChange={(e) => setFoodForm((p) => ({ ...p, name: e.target.value }))} required />
            <textarea className="input" placeholder="Description" value={foodForm.description} onChange={(e) => setFoodForm((p) => ({ ...p, description: e.target.value }))} required />
            <input className="input" type="number" placeholder="Price" value={foodForm.price} onChange={(e) => setFoodForm((p) => ({ ...p, price: e.target.value }))} required />
            <input className="input" placeholder="Category" value={foodForm.category} onChange={(e) => setFoodForm((p) => ({ ...p, category: e.target.value }))} required />
            <input className="input" placeholder="Image URL (optional)" value={foodForm.image_url} onChange={(e) => setFoodForm((p) => ({ ...p, image_url: e.target.value }))} />
            <input className="input" type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={(e) => setFoodImage(e.target.files?.[0] || null)} />
            <button className="btn btn-primary" type="submit">Save Food</button>
          </form>

          <div className="stack mt-sm">
            {foods.map((food) => (
              <article key={food.id} className="card row-between">
                <div>
                  <h3>{food.name}</h3>
                  <p>{food.category} • ₦{Number(food.price).toLocaleString()}</p>
                </div>
                <div className="actions">
                  <button className="btn btn-secondary" type="button" onClick={() => setFoodForm(food)}>Edit</button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={async () => {
                      if (isLocalAdmin) {
                        await deleteFoodWithToken({ token: LOCAL_ADMIN_TOKEN, id: food.id });
                      } else {
                        await deleteFood(food.id);
                      }
                      await loadData();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2>Locations</h2>
          <form className="card form" onSubmit={submitLocation}>
            <input className="input" placeholder="Name" value={locationForm.name} onChange={(e) => setLocationForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="input" placeholder="Address" value={locationForm.address} onChange={(e) => setLocationForm((p) => ({ ...p, address: e.target.value }))} required />
            <input className="input" type="number" step="any" placeholder="Latitude" value={locationForm.latitude} onChange={(e) => setLocationForm((p) => ({ ...p, latitude: e.target.value }))} required />
            <input className="input" type="number" step="any" placeholder="Longitude" value={locationForm.longitude} onChange={(e) => setLocationForm((p) => ({ ...p, longitude: e.target.value }))} required />
            <input className="input" placeholder="Image URL (optional)" value={locationForm.image_url} onChange={(e) => setLocationForm((p) => ({ ...p, image_url: e.target.value }))} />
            <input className="input" type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={(e) => setLocationImage(e.target.files?.[0] || null)} />
            <button className="btn btn-primary" type="submit">Save Location</button>
          </form>

          <div className="stack mt-sm">
            {locations.map((location) => (
              <article key={location.id} className="card row-between">
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                </div>
                <div className="actions">
                  <button className="btn btn-secondary" type="button" onClick={() => setLocationForm(location)}>Edit</button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={async () => {
                      if (isLocalAdmin) {
                        await deleteLocationWithToken({ token: LOCAL_ADMIN_TOKEN, id: location.id });
                      } else {
                        await deleteLocation(location.id);
                      }
                      await loadData();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

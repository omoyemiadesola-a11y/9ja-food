import { useEffect, useState } from 'react';
import {
  deleteFood,
  deleteLocation,
  fetchFoods,
  fetchLocations,
  uploadToBucket,
  upsertFood,
  upsertLocation,
} from '../services/api';
import { supabase } from '../utils/supabase';

const initialFoodForm = {
  id: null,
  name: '',
  description: '',
  price: '',
  category: 'African',
  image_url: '',
};

const initialLocationForm = {
  id: null,
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  image_url: '',
};

export default function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [locations, setLocations] = useState([]);
  const [foodForm, setFoodForm] = useState(initialFoodForm);
  const [locationForm, setLocationForm] = useState(initialLocationForm);
  const [foodImage, setFoodImage] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const resetFoodForm = () => {
    setFoodForm(initialFoodForm);
    setFoodImage(null);
  };

  const resetLocationForm = () => {
    setLocationForm(initialLocationForm);
    setLocationImage(null);
  };

  const checkAdminAccess = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    setCurrentUser(user || null);

    if (!user) {
      setIsAdmin(false);
      setAuthChecked(true);
      return false;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    const adminStatus = profile?.role === 'admin';
    setIsAdmin(adminStatus);
    setAuthChecked(true);

    return adminStatus;
  };

  const loadData = async () => {
    const [foodData, locationData] = await Promise.all([
      fetchFoods(),
      fetchLocations(),
    ]);

    setFoods(Array.isArray(foodData) ? foodData : []);
    setLocations(Array.isArray(locationData) ? locationData : []);
  };

  useEffect(() => {
    let mounted = true;
    let foodsChannel;
    let locationsChannel;

    const init = async () => {
      setLoading(true);
      setStatus('');

      try {
        const adminStatus = await checkAdminAccess();

        if (!mounted) return;

        if (!adminStatus) {
          setStatus('Access denied. You must be signed in as an admin.');
          setLoading(false);
          return;
        }

        await loadData();

        foodsChannel = supabase
          .channel('admin-foods-sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'foods' },
            async () => {
              await loadData();
            }
          )
          .subscribe();

        locationsChannel = supabase
          .channel('admin-locations-sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'locations' },
            async () => {
              await loadData();
            }
          )
          .subscribe();
      } catch (error) {
        if (mounted) {
          setStatus(`Admin setup failed: ${error.message}`);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (foodsChannel) supabase.removeChannel(foodsChannel);
      if (locationsChannel) supabase.removeChannel(locationsChannel);
    };
  }, []);

  const submitFood = async (event) => {
    event.preventDefault();
    setStatus('');

    try {
      const adminStatus = await checkAdminAccess();
      if (!adminStatus) {
        throw new Error('Only admin can save food.');
      }

      let imageUrl = foodForm.image_url;

      if (foodImage) {
        imageUrl = await uploadToBucket('food-images', foodImage);
      }

      const payload = {
        ...(foodForm.id ? { id: foodForm.id } : {}),
        name: foodForm.name.trim(),
        description: foodForm.description.trim(),
        price: Number(foodForm.price),
        category: foodForm.category.trim(),
        image_url: imageUrl || null,
      };

      if (!payload.name) throw new Error('Food name is required.');
      if (!payload.description) throw new Error('Food description is required.');
      if (!payload.category) throw new Error('Food category is required.');
      if (Number.isNaN(payload.price) || payload.price <= 0) {
        throw new Error('Food price must be a valid number greater than zero.');
      }

      await upsertFood(payload);
      await loadData();
      resetFoodForm();
      setStatus(foodForm.id ? 'Food updated successfully.' : 'Food saved successfully.');
    } catch (error) {
      setStatus(`Food save failed: ${error.message}`);
    }
  };

  const submitLocation = async (event) => {
    event.preventDefault();
    setStatus('');

    try {
      const adminStatus = await checkAdminAccess();
      if (!adminStatus) {
        throw new Error('Only admin can save location.');
      }

      let imageUrl = locationForm.image_url;

      if (locationImage) {
        imageUrl = await uploadToBucket('location-images', locationImage);
      }

      const payload = {
        ...(locationForm.id ? { id: locationForm.id } : {}),
        name: locationForm.name.trim(),
        address: locationForm.address.trim(),
        latitude: Number(locationForm.latitude),
        longitude: Number(locationForm.longitude),
        image_url: imageUrl || null,
      };

      if (!payload.name) throw new Error('Location name is required.');
      if (!payload.address) throw new Error('Location address is required.');
      if (Number.isNaN(payload.latitude)) throw new Error('Latitude must be a valid number.');
      if (Number.isNaN(payload.longitude)) throw new Error('Longitude must be a valid number.');

      await upsertLocation(payload);
      await loadData();
      resetLocationForm();
      setStatus(locationForm.id ? 'Location updated successfully.' : 'Location saved successfully.');
    } catch (error) {
      setStatus(`Location save failed: ${error.message}`);
    }
  };

  const handleEditFood = (food) => {
    setFoodForm({
      id: food.id ?? null,
      name: food.name ?? '',
      description: food.description ?? '',
      price: food.price ?? '',
      category: food.category ?? 'African',
      image_url: food.image_url ?? '',
    });
    setFoodImage(null);
    setStatus(`Editing "${food.name}".`);
  };

  const handleEditLocation = (location) => {
    setLocationForm({
      id: location.id ?? null,
      name: location.name ?? '',
      address: location.address ?? '',
      latitude: location.latitude ?? '',
      longitude: location.longitude ?? '',
      image_url: location.image_url ?? '',
    });
    setLocationImage(null);
    setStatus(`Editing "${location.name}".`);
  };

  const handleDeleteFood = async (foodId) => {
    setStatus('');

    try {
      const adminStatus = await checkAdminAccess();
      if (!adminStatus) {
        throw new Error('Only admin can delete food.');
      }

      await deleteFood(foodId);
      await loadData();

      if (foodForm.id === foodId) {
        resetFoodForm();
      }

      setStatus('Food deleted successfully.');
    } catch (error) {
      setStatus(`Food delete failed: ${error.message}`);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    setStatus('');

    try {
      const adminStatus = await checkAdminAccess();
      if (!adminStatus) {
        throw new Error('Only admin can delete location.');
      }

      await deleteLocation(locationId);
      await loadData();

      if (locationForm.id === locationId) {
        resetLocationForm();
      }

      setStatus('Location deleted successfully.');
    } catch (error) {
      setStatus(`Location delete failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container section">
        <h1>Admin Dashboard</h1>
        <p className="mt-sm">Loading admin dashboard...</p>
      </div>
    );
  }

  if (authChecked && !isAdmin) {
    return (
      <div className="container section">
        <h1>Admin Dashboard</h1>
        <p className="mt-sm">
          Access denied. Sign in with the admin account to manage foods and locations.
        </p>
        {currentUser?.email && (
          <p className="mt-sm">Current signed-in account: {currentUser.email}</p>
        )}
        {status && <p className="mt-sm">{status}</p>}
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Admin Dashboard</h1>

      {currentUser?.email && (
        <p className="mt-sm">Signed in as: {currentUser.email}</p>
      )}

      {status && <p className="mt-sm">{status}</p>}

      <div className="split-layout mt-md">
        <section>
          <h2>Foods</h2>

          <form className="card form" onSubmit={submitFood}>
            <input
              className="input"
              placeholder="Name"
              value={foodForm.name}
              onChange={(e) =>
                setFoodForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />

            <textarea
              className="input"
              placeholder="Description"
              value={foodForm.description}
              onChange={(e) =>
                setFoodForm((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />

            <input
              className="input"
              type="number"
              step="0.01"
              placeholder="Price"
              value={foodForm.price}
              onChange={(e) =>
                setFoodForm((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />

            <input
              className="input"
              placeholder="Category"
              value={foodForm.category}
              onChange={(e) =>
                setFoodForm((prev) => ({ ...prev, category: e.target.value }))
              }
              required
            />

            <input
              className="input"
              placeholder="Image URL (optional)"
              value={foodForm.image_url}
              onChange={(e) =>
                setFoodForm((prev) => ({ ...prev, image_url: e.target.value }))
              }
            />

            <input
              className="input"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.webp"
              onChange={(e) => setFoodImage(e.target.files?.[0] || null)}
            />

            <div className="actions">
              <button className="btn btn-primary" type="submit">
                {foodForm.id ? 'Update Food' : 'Save Food'}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetFoodForm}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="stack mt-sm">
            {foods.map((food) => (
              <article key={food.id} className="card row-between">
                <div>
                  <h3>{food.name}</h3>
                  <p>{food.category} • ₦{Number(food.price).toLocaleString()}</p>
                  {food.description && <p>{food.description}</p>}
                </div>

                <div className="actions">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleEditFood(food)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDeleteFood(food.id)}
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
            <input
              className="input"
              placeholder="Name"
              value={locationForm.name}
              onChange={(e) =>
                setLocationForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />

            <input
              className="input"
              placeholder="Address"
              value={locationForm.address}
              onChange={(e) =>
                setLocationForm((prev) => ({ ...prev, address: e.target.value }))
              }
              required
            />

            <input
              className="input"
              type="number"
              step="any"
              placeholder="Latitude"
              value={locationForm.latitude}
              onChange={(e) =>
                setLocationForm((prev) => ({ ...prev, latitude: e.target.value }))
              }
              required
            />

            <input
              className="input"
              type="number"
              step="any"
              placeholder="Longitude"
              value={locationForm.longitude}
              onChange={(e) =>
                setLocationForm((prev) => ({ ...prev, longitude: e.target.value }))
              }
              required
            />

            <input
              className="input"
              placeholder="Image URL (optional)"
              value={locationForm.image_url}
              onChange={(e) =>
                setLocationForm((prev) => ({ ...prev, image_url: e.target.value }))
              }
            />

            <input
              className="input"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.webp"
              onChange={(e) => setLocationImage(e.target.files?.[0] || null)}
            />

            <div className="actions">
              <button className="btn btn-primary" type="submit">
                {locationForm.id ? 'Update Location' : 'Save Location'}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetLocationForm}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="stack mt-sm">
            {locations.map((location) => (
              <article key={location.id} className="card row-between">
                <div>
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                  <p>
                    Lat: {location.latitude}, Lng: {location.longitude}
                  </p>
                </div>

                <div className="actions">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleEditLocation(location)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDeleteLocation(location.id)}
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
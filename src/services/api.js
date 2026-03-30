import { supabase } from '../utils/supabase';

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function ensureValidFoodPayload(payload) {
  const name = cleanText(payload.name);
  const description = cleanText(payload.description);
  const category = cleanText(payload.category);
  const price = Number(payload.price);

  if (!name) throw new Error('Food name is required.');
  if (!description) throw new Error('Food description is required.');
  if (!category) throw new Error('Food category is required.');
  if (Number.isNaN(price) || price <= 0) {
    throw new Error('Food price must be a valid number greater than zero.');
  }

  const cleanPayload = {
    name,
    description,
    category,
    price,
    image_url: cleanText(payload.image_url) || null,
  };

  if (payload.id) {
    cleanPayload.id = payload.id;
  }

  return cleanPayload;
}

function ensureValidLocationPayload(payload) {
  const name = cleanText(payload.name);
  const address = cleanText(payload.address);
  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);

  if (!name) throw new Error('Location name is required.');
  if (!address) throw new Error('Location address is required.');
  if (Number.isNaN(latitude)) throw new Error('Latitude must be a valid number.');
  if (Number.isNaN(longitude)) throw new Error('Longitude must be a valid number.');

  const cleanPayload = {
    name,
    address,
    latitude,
    longitude,
    image_url: cleanText(payload.image_url) || null,
  };

  if (payload.id) {
    cleanPayload.id = payload.id;
  }

  return cleanPayload;
}

export async function fetchFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch foods: ${error.message}`);
  }

  return data ?? [];
}

export async function fetchLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch locations: ${error.message}`);
  }

  return data ?? [];
}

export async function createOrder({ userId, items, total }) {
  if (!userId) {
    throw new Error('User ID is required to create an order.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order items are required.');
  }

  const parsedTotal = Number(total);
  if (Number.isNaN(parsedTotal) || parsedTotal <= 0) {
    throw new Error('Order total must be a valid number greater than zero.');
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      items,
      total: parsedTotal,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return data;
}

export async function fetchMyOrders(userId) {
  if (!userId) {
    throw new Error('User ID is required to fetch orders.');
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }

  return data ?? [];
}

export async function uploadToBucket(bucket, file) {
  if (!bucket) {
    throw new Error('Bucket name is required.');
  }

  if (!file) {
    throw new Error('No file selected.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowed = ['png', 'jpg', 'jpeg', 'pdf', 'webp'];

  if (!extension || !allowed.includes(extension)) {
    throw new Error('Only PNG, JPG, JPEG, PDF, or WEBP files are allowed.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${Date.now()}-${safeName}`;

  const contentType =
    file.type ||
    (extension === 'pdf'
      ? 'application/pdf'
      : extension === 'jpg'
      ? 'image/jpeg'
      : `image/${extension}`);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
      contentType,
    });

  if (uploadError) {
    throw new Error(`File upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error('Failed to get uploaded file URL.');
  }

  return data.publicUrl;
}

export async function upsertFood(payload) {
  const cleanPayload = ensureValidFoodPayload(payload);

  const { data, error } = await supabase
    .from('foods')
    .upsert(cleanPayload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save food: ${error.message}`);
  }

  return data;
}

export async function deleteFood(id) {
  if (!id) {
    throw new Error('Food ID is required.');
  }

  const { error } = await supabase
    .from('foods')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete food: ${error.message}`);
  }

  return true;
}

export async function upsertLocation(payload) {
  const cleanPayload = ensureValidLocationPayload(payload);

  const { data, error } = await supabase
    .from('locations')
    .upsert(cleanPayload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save location: ${error.message}`);
  }

  return data;
}

export async function deleteLocation(id) {
  if (!id) {
    throw new Error('Location ID is required.');
  }

  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete location: ${error.message}`);
  }

  return true;
}
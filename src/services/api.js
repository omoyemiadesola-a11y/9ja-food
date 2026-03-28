import { supabase } from '../utils/supabase';

export async function fetchFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchLocations() {
  const { data, error } = await supabase.from('locations').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createOrder({ userId, items, total }) {
  const { data, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, items, total, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMyOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function uploadToBucket(bucket, file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowed = ['png', 'jpg', 'jpeg', 'pdf'];
  if (!extension || !allowed.includes(extension)) {
    throw new Error('Only PNG, JPG, JPEG, or PDF files are allowed.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || (extension === 'pdf' ? 'application/pdf' : `image/${extension}`),
  });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function upsertFood(payload) {
  const { data, error } = await supabase.from('foods').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function upsertFoodWithToken({ token, payload }) {
  const { data, error } = await supabase
    .rpc('admin_upsert_food', {
      p_token: token,
      p_id: payload.id ?? null,
      p_name: payload.name,
      p_description: payload.description,
      p_price: payload.price,
      p_image_url: payload.image_url ?? null,
      p_category: payload.category,
    });
  if (error) throw error;
  return data;
}

export async function deleteFood(id) {
  const { error } = await supabase.from('foods').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteFoodWithToken({ token, id }) {
  const { error } = await supabase.rpc('admin_delete_food', {
    p_token: token,
    p_id: id,
  });
  if (error) throw error;
}

export async function upsertLocation(payload) {
  const { data, error } = await supabase.from('locations').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function upsertLocationWithToken({ token, payload }) {
  const { data, error } = await supabase
    .rpc('admin_upsert_location', {
      p_token: token,
      p_id: payload.id ?? null,
      p_name: payload.name,
      p_address: payload.address,
      p_latitude: payload.latitude,
      p_longitude: payload.longitude,
      p_image_url: payload.image_url ?? null,
    });
  if (error) throw error;
  return data;
}

export async function deleteLocation(id) {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteLocationWithToken({ token, id }) {
  const { error } = await supabase.rpc('admin_delete_location', {
    p_token: token,
    p_id: id,
  });
  if (error) throw error;
}

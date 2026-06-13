
DROP POLICY IF EXISTS "item_photos_public_read" ON storage.objects;
CREATE POLICY "item_photos_owner_select" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'item-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

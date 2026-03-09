insert into public.streams (name, key, stream_url, is_live, order_no)
values
  ('Seyr FM', 'seyr-fm', 'https://sslyayin.netyayin.net/8024', true, 1),
  ('Seyr Sohbet', 'seyr-sohbet', 'https://sslyayin.netyayin.net:10914/stream?type=http&nocache=20', false, 2)
on conflict (key) do nothing;

insert into public.pages (slug, title, content, seo_description)
values (
  'kurumsal',
  'Kurumsal',
  'SeyrDijital, tasavvuf ve kültür yayıncılığını dijital altyapı ile sunar.',
  'SeyrDijital kurumsal sayfası'
)
on conflict (slug) do nothing;

insert into public.contact_settings (id, phone, email, address)
values (
  '93fd3f66-e9fc-4f7d-95f7-88395afbf22b',
  '0 212 635 83 95',
  'seyriletisim@abymedya.com',
  'Dervişali Mah. Uçbey Sok. No:7 Fatih/İstanbul'
)
on conflict (id) do nothing;

-- After creating an auth user, grant panel access with a row like:
-- insert into public.admin_users (user_id, role, full_name)
-- values ('<auth-user-uuid>', 'ADMIN', 'Seyr Admin');

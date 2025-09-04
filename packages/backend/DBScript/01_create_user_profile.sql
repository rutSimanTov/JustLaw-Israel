create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
 user_id uuid not null references users(id) on delete cascade,
  full_name varchar(255) not null,
  role_description text not null,
  country_region varchar(100) not null,
  value_sentence text not null,
  keywords text[] not null,
  current_challenge text not null,
  connection_types text[] not null,
  engagement_types text[] not null,
  contact_info json,
  project_link varchar(255),
  other_connection_text text,
  is_visible boolean not null default true,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

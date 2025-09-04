create table if not exists profile_search_result (
  profiles json not null,
  total_count int not null,
  page int not null,
  page_size int not null
);

create table if not exists profile_search_filters (
  keyword varchar(255),
  country_region varchar(100),
  connection_types text[],
  engagement_types text[],
  keywords text[]
);

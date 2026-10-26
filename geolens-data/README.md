# GeoLens data you supply

Poultry farm and livestock market lists are not included in Dharini or its
Docker images. Put your own files in this folder to show these two map layers.
The file names and columns are in [DATA_SOURCES.md](../DATA_SOURCES.md).

1. Copy an example file, drop `.example` from its name (for example
   `cattle-market.csv`), and replace the rows with yours. Keep the header row.
   A file can also be gzipped, with `.gz` added to its name.
2. Recreate the backend, for example
   `docker compose --profile production up -d backend`.
3. Check the log: `docker compose logs backend | grep -i -E "poultry|cattle"`
   should show `Seeded <n> poultry farms.` or `Seeded <n> cattle markets.`

Notes:

- Each file is loaded once, when its table is empty. To replace data, empty the
  table first (for example `DELETE FROM bio_poultry_farms;`) and restart.
- Without Compose, mount this folder at `/app/geolens-data` and set
  `GEOLENS_DATA_DIR=/app/geolens-data`. Outside Docker, set `GEOLENS_DATA_DIR`
  to this folder in `.env`.
- When `NODE_ENV` is `development` the backend does not seed on startup. Run
  `npx ts-node src/seeder/seed-geolens.ts` from `backend/`.
- Your files here are not committed to git. Only this README and the
  `*.example.csv` files are tracked.

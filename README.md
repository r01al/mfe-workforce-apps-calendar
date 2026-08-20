# Workforce Calendar Remote

Independent weekly calendar micro-frontend. It exposes `./Calendar` from `calendarMfe` and consumes worker DTOs over the shared HTTP contract.

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm start
```

`npm run dev` runs Calendar as a standalone application with local development
data. Open `http://localhost:3004/calendar`; the shell and other remotes are not
required.

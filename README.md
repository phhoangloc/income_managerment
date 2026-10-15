# Income Management

## Backend (`/be`) — Express + Prisma + MySQL
```
cd be
# sửa DATABASE_URL trong .env
npm run db:push    # tạo bảng
npm run seed       # tạo admin (ADMIN_* trong .env)
npm run dev        # http://localhost:4000
```
- `POST /auth/login` (user), `POST /auth/admin/login` (admin)
- Admin: CRUD `/users`, xem/sửa/xóa mọi `/workplaces`, `/shifts` (`?userId=`)
- User: `/users/me`, `/workplaces`, `/shifts?month=YYYY-MM` (chỉ dữ liệu của mình)
- Ca làm đêm 22:00–05:00 được +25%; `TZ_OFFSET_MINUTES` (mặc định 420 = UTC+7) quyết định múi giờ.

## Frontend (`/home`) — Next.js + Tailwind
```
cd home
npm run dev        # http://localhost:3000
```
Routes: `/`, `/shift`, `/shift/new`, `/shift/[id]`, `/workplace`, `/login`.

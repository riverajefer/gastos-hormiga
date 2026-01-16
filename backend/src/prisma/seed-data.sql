-- SQLite database seed data
-- Converted from PostgreSQL backup

-- Insert Expense data
INSERT INTO Expense (id, concept, amount, category, date, isRecurring, createdAt, updatedAt) VALUES
('cmk1ul8310001qnrx2qomyn2q', 'Cerveza', 34000, 'bebidas', '2026-01-02 12:00:00', 0, '2026-01-06 00:25:01.738', '2026-01-06 00:25:01.738'),
('cmk1umdz70002qnrxxdj00358', 'Obleas', 8000, 'comida', '2026-01-03 12:00:00', 0, '2026-01-06 00:25:56.033', '2026-01-06 00:25:56.033'),
('cmk1unxmc0004qnrxppjtbjtg', 'Panela D1', 10000, 'comida', '2026-01-03 12:00:00', 0, '2026-01-06 00:27:08.149', '2026-01-06 00:27:36.71'),
('cmk1unexb0003qnrxmdnbpqjs', 'Compra D1 Fusa', 59300, 'otros', '2026-01-03 12:00:00', 0, '2026-01-06 00:26:43.761', '2026-01-06 00:27:51.21'),
('cmk1uqew60005qnrx8g99jz8w', 'Dinero a mamá', 50000, 'otros', '2026-01-04 12:00:00', 0, '2026-01-06 00:29:03.845', '2026-01-06 00:29:03.845'),
('cmk21kaad0000sfme2hw77owf', 'Almuerzo 04 Enero', 35000, 'comida', '2026-01-04 12:00:00', 0, '2026-01-06 03:40:15.234', '2026-01-06 03:40:15.234'),
('cmk4wpq2q00002ldyvryks2ob', 'Recarga tarjeta TransMilenio', 10000, 'transporte', '2026-01-08 12:00:00', 0, '2026-01-08 03:47:49.436', '2026-01-08 03:47:49.436'),
('cmk5lhxyu00003194iuzutj8o', 'Parque Salitre', 100000, 'entretenimiento', '2026-01-08 12:00:00', 0, '2026-01-08 15:21:36.821', '2026-01-08 15:21:36.821'),
('cmkag9ske0000gviwkuxhd06i', 'Pollo', 55000, 'comida', '2026-01-10 12:00:00', 0, '2026-01-12 00:54:09.36', '2026-01-12 00:54:09.36'),
('cmkagbepp0001gviwuvd6jnxn', 'leche', 22600, 'otros', '2026-01-12 12:00:00', 0, '2026-01-12 00:55:24.727', '2026-01-12 00:55:24.727'),
('cmkgwjmxj0000lzjrta2tkr21', 'Comida Carnitas', 60000, 'comida', '2026-01-10 12:00:00', 0, '2026-01-16 13:16:19.544', '2026-01-16 13:16:35.866'),
('cmkgwkwmh0001lzjrkpuhy6vv', 'Compra Dollar City.', 20000, 'otros', '2026-01-14 12:00:00', 0, '2026-01-16 13:17:18.76', '2026-01-16 13:17:18.76');

-- Insert MonthlyBudget data
INSERT INTO MonthlyBudget (id, month, year, "limit") VALUES
('cmk1pvdy100007vvdqjk0hzqr', 1, 2026, 400000);

-- Insert QuickExpense data
INSERT INTO QuickExpense (id, concept, amount, category, "order", usageCount, createdAt, updatedAt) VALUES
('cmk21l0kd0001sfmee5u8zqzc', 'Ensalada 🥗', 4000, 'comida', 0, 1, '2026-01-06 03:40:49.309', '2026-01-06 04:05:47.472');

-- Insert UserSettings data
INSERT INTO UserSettings (id, reminderEnabled, reminderTime, darkMode, currency) VALUES
('default', 1, '21:00', 1, 'COP');

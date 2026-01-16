--
-- PostgreSQL database dump
--

\restrict zadPSSu4byZAjetTPTL5UZ8eLCeOKOTagZ8TNMaych4pECScE34kHshj5Na1mXN

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg12+2)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: gastos_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO gastos_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Expense; Type: TABLE; Schema: public; Owner: gastos_user
--

CREATE TABLE public."Expense" (
    id text NOT NULL,
    concept text NOT NULL,
    amount integer NOT NULL,
    category text DEFAULT 'otros'::text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "isRecurring" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Expense" OWNER TO gastos_user;

--
-- Name: MonthlyBudget; Type: TABLE; Schema: public; Owner: gastos_user
--

CREATE TABLE public."MonthlyBudget" (
    id text NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "limit" integer
);


ALTER TABLE public."MonthlyBudget" OWNER TO gastos_user;

--
-- Name: QuickExpense; Type: TABLE; Schema: public; Owner: gastos_user
--

CREATE TABLE public."QuickExpense" (
    id text NOT NULL,
    concept text NOT NULL,
    amount integer NOT NULL,
    category text DEFAULT 'otros'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."QuickExpense" OWNER TO gastos_user;

--
-- Name: UserSettings; Type: TABLE; Schema: public; Owner: gastos_user
--

CREATE TABLE public."UserSettings" (
    id text DEFAULT 'default'::text NOT NULL,
    "reminderEnabled" boolean DEFAULT false NOT NULL,
    "reminderTime" text DEFAULT '21:00'::text,
    "darkMode" boolean DEFAULT true NOT NULL,
    currency text DEFAULT 'COP'::text NOT NULL
);


ALTER TABLE public."UserSettings" OWNER TO gastos_user;

--
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: gastos_user
--

INSERT INTO public."Expense" VALUES ('cmk1ul8310001qnrx2qomyn2q', 'Cerveza', 34000, 'bebidas', '2026-01-02 12:00:00', false, '2026-01-06 00:25:01.738', '2026-01-06 00:25:01.738');
INSERT INTO public."Expense" VALUES ('cmk1umdz70002qnrxxdj00358', 'Obleas', 8000, 'comida', '2026-01-03 12:00:00', false, '2026-01-06 00:25:56.033', '2026-01-06 00:25:56.033');
INSERT INTO public."Expense" VALUES ('cmk1unxmc0004qnrxppjtbjtg', 'Panela D1', 10000, 'comida', '2026-01-03 12:00:00', false, '2026-01-06 00:27:08.149', '2026-01-06 00:27:36.71');
INSERT INTO public."Expense" VALUES ('cmk1unexb0003qnrxmdnbpqjs', 'Compra D1 Fusa', 59300, 'otros', '2026-01-03 12:00:00', false, '2026-01-06 00:26:43.761', '2026-01-06 00:27:51.21');
INSERT INTO public."Expense" VALUES ('cmk1uqew60005qnrx8g99jz8w', 'Dinero a mamá', 50000, 'otros', '2026-01-04 12:00:00', false, '2026-01-06 00:29:03.845', '2026-01-06 00:29:03.845');
INSERT INTO public."Expense" VALUES ('cmk21kaad0000sfme2hw77owf', 'Almuerzo 04 Enero', 35000, 'comida', '2026-01-04 12:00:00', false, '2026-01-06 03:40:15.234', '2026-01-06 03:40:15.234');
INSERT INTO public."Expense" VALUES ('cmk4wpq2q00002ldyvryks2ob', 'Recarga tarjeta TransMilenio', 10000, 'transporte', '2026-01-08 12:00:00', false, '2026-01-08 03:47:49.436', '2026-01-08 03:47:49.436');
INSERT INTO public."Expense" VALUES ('cmk5lhxyu00003194iuzutj8o', 'Parque Salitre', 100000, 'entretenimiento', '2026-01-08 12:00:00', false, '2026-01-08 15:21:36.821', '2026-01-08 15:21:36.821');
INSERT INTO public."Expense" VALUES ('cmkag9ske0000gviwkuxhd06i', 'Pollo', 55000, 'comida', '2026-01-10 12:00:00', false, '2026-01-12 00:54:09.36', '2026-01-12 00:54:09.36');
INSERT INTO public."Expense" VALUES ('cmkagbepp0001gviwuvd6jnxn', 'leche', 22600, 'otros', '2026-01-12 12:00:00', false, '2026-01-12 00:55:24.727', '2026-01-12 00:55:24.727');
INSERT INTO public."Expense" VALUES ('cmkgwjmxj0000lzjrta2tkr21', 'Comida Carnitas', 60000, 'comida', '2026-01-10 12:00:00', false, '2026-01-16 13:16:19.544', '2026-01-16 13:16:35.866');
INSERT INTO public."Expense" VALUES ('cmkgwkwmh0001lzjrkpuhy6vv', 'Compra Dollar City.', 20000, 'otros', '2026-01-14 12:00:00', false, '2026-01-16 13:17:18.76', '2026-01-16 13:17:18.76');


--
-- Data for Name: MonthlyBudget; Type: TABLE DATA; Schema: public; Owner: gastos_user
--

INSERT INTO public."MonthlyBudget" VALUES ('cmk1pvdy100007vvdqjk0hzqr', 1, 2026, 400000);


--
-- Data for Name: QuickExpense; Type: TABLE DATA; Schema: public; Owner: gastos_user
--

INSERT INTO public."QuickExpense" VALUES ('cmk21l0kd0001sfmee5u8zqzc', 'Ensalada 🥗', 4000, 'comida', 0, 1, '2026-01-06 03:40:49.309', '2026-01-06 04:05:47.472');


--
-- Data for Name: UserSettings; Type: TABLE DATA; Schema: public; Owner: gastos_user
--

INSERT INTO public."UserSettings" VALUES ('default', true, '21:00', true, 'COP');


--
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: gastos_user
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- Name: MonthlyBudget MonthlyBudget_pkey; Type: CONSTRAINT; Schema: public; Owner: gastos_user
--

ALTER TABLE ONLY public."MonthlyBudget"
    ADD CONSTRAINT "MonthlyBudget_pkey" PRIMARY KEY (id);


--
-- Name: QuickExpense QuickExpense_pkey; Type: CONSTRAINT; Schema: public; Owner: gastos_user
--

ALTER TABLE ONLY public."QuickExpense"
    ADD CONSTRAINT "QuickExpense_pkey" PRIMARY KEY (id);


--
-- Name: UserSettings UserSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: gastos_user
--

ALTER TABLE ONLY public."UserSettings"
    ADD CONSTRAINT "UserSettings_pkey" PRIMARY KEY (id);


--
-- Name: Expense_category_idx; Type: INDEX; Schema: public; Owner: gastos_user
--

CREATE INDEX "Expense_category_idx" ON public."Expense" USING btree (category);


--
-- Name: Expense_concept_idx; Type: INDEX; Schema: public; Owner: gastos_user
--

CREATE INDEX "Expense_concept_idx" ON public."Expense" USING btree (concept);


--
-- Name: Expense_date_idx; Type: INDEX; Schema: public; Owner: gastos_user
--

CREATE INDEX "Expense_date_idx" ON public."Expense" USING btree (date);


--
-- Name: MonthlyBudget_month_year_key; Type: INDEX; Schema: public; Owner: gastos_user
--

CREATE UNIQUE INDEX "MonthlyBudget_month_year_key" ON public."MonthlyBudget" USING btree (month, year);


--
-- Name: QuickExpense_order_idx; Type: INDEX; Schema: public; Owner: gastos_user
--

CREATE INDEX "QuickExpense_order_idx" ON public."QuickExpense" USING btree ("order");


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO gastos_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO gastos_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO gastos_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO gastos_user;


--
-- PostgreSQL database dump complete
--

\unrestrict zadPSSu4byZAjetTPTL5UZ8eLCeOKOTagZ8TNMaych4pECScE34kHshj5Na1mXN


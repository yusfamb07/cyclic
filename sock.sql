-- Adminer 4.8.1 PostgreSQL 15.1 dump

\connect "sockEnergy";

DROP TABLE IF EXISTS "carts";
CREATE TABLE "public"."carts" (
    "cart_id" character varying(50) NOT NULL,
    "cart_qty" integer,
    "cart_prod_id" character varying(50),
    "cart_status" character varying(50),
    "cart_user_id" character varying(50),
    "created_at" timestamptz DEFAULT now(),
    CONSTRAINT "cart_id_pk" UNIQUE ("cart_id"),
    CONSTRAINT "carts_pkey" PRIMARY KEY ("cart_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "categories";
CREATE TABLE "public"."categories" (
    "cate_id" character varying(50) NOT NULL,
    "cate_name" character varying(100),
    "created_at" timestamptz DEFAULT now(),
    CONSTRAINT "cate_id_pk" PRIMARY KEY ("cate_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "form_payment";
CREATE TABLE "public"."form_payment" (
    "fopa_id" character varying(50) NOT NULL,
    "fopa_user_id" character varying(50),
    "fopa_ongkir" character varying(50),
    "fopa_payment" character varying(50),
    "fopa_created_at" timestamptz DEFAULT now(),
    "fopa_image_transaction" character varying(255),
    "fopa_rek" character varying(50),
    "fopa_start_date" timestamptz,
    "fopa_end_date" timestamptz,
    CONSTRAINT "fopa_id_pk" PRIMARY KEY ("fopa_id")
) WITH (oids = false);

INSERT INTO "form_payment" ("fopa_id", "fopa_user_id", "fopa_ongkir", "fopa_payment", "fopa_created_at", "fopa_image_transaction", "fopa_rek", "fopa_start_date", "fopa_end_date") VALUES
('0fd0b6d9-7514-49f6-810f-c66e09c2262c',	'e0697993-4c1c-4246-98f3-04a1159800ac',	'Ongkos Kirim Ekonomis',	'Transfer Bank',	'2023-08-15 00:43:05.753475+07',	NULL,	'123456789',	'2023-08-15 00:43:05+07',	'2023-08-16 07:43:05+07');

DROP TABLE IF EXISTS "payment_method";
CREATE TABLE "public"."payment_method" (
    "payment_id" character varying(50) NOT NULL,
    "payment_name" character varying(50),
    "created_at" timestamptz DEFAULT now(),
    CONSTRAINT "payment_id_pk" PRIMARY KEY ("payment_id")
) WITH (oids = false);

INSERT INTO "payment_method" ("payment_id", "payment_name", "created_at") VALUES
('57b2a359-51a0-40a9-8dc3-f1f039ea3450',	'Transfer Bank',	'2023-07-27 00:24:51.985069+07'),
('f726733d-a5a1-48bf-bb33-a126214e4de8',	'Cash on Delivery',	'2023-07-27 00:24:51.985069+07');

DROP TABLE IF EXISTS "products";
CREATE TABLE "public"."products" (
    "prod_id" character varying(50) NOT NULL,
    "prod_name" character varying(100),
    "prod_image" character varying(255),
    "prod_price" numeric(15,2),
    "prod_desc" character varying(255),
    "prod_cate_id" character varying(50),
    "created_at" timestamptz DEFAULT now(),
    CONSTRAINT "prod_id_pk" PRIMARY KEY ("prod_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "roles";
CREATE TABLE "public"."roles" (
    "role_id" character varying(50) NOT NULL,
    "role_name" character varying(50),
    "created_at" timestamptz DEFAULT now(),
    CONSTRAINT "role_id_pk" PRIMARY KEY ("role_id")
) WITH (oids = false);

INSERT INTO "roles" ("role_id", "role_name", "created_at") VALUES
('1d9bb9fd-0c75-4b6d-ad8f-bdb5c85b842c',	'customer',	'2023-07-27 00:25:38.927914+07'),
('3aae176d-8a56-4d92-9974-7fff6f3b684d',	'admin',	'2023-07-27 00:25:38.927914+07');

DROP TABLE IF EXISTS "users";
CREATE TABLE "public"."users" (
    "user_id" character varying(50) NOT NULL,
    "user_name" character varying(20),
    "user_email" character varying(55),
    "user_password" character varying(255),
    "user_handphone" character varying(15),
    "user_role_id" character varying(50),
    "user_address" character varying(255),
    "user_photo" character varying(255),
    "user_personal_name" character varying(100),
    "user_province" character varying(50),
    "user_city" character varying(50),
    "created_at" timestamptz DEFAULT now(),
    CONSTRAINT "user_id_pk" PRIMARY KEY ("user_id")
) WITH (oids = false);

INSERT INTO "users" ("user_id", "user_name", "user_email", "user_password", "user_handphone", "user_role_id", "user_address", "user_photo", "user_personal_name", "user_province", "user_city", "created_at") VALUES
('e0697993-4c1c-4246-98f3-04a1159800ac',	'jaktim',	'jaktim@gmail.com',	'$2b$10$g6TYihjGDKlAE44/aWPy6utFSIu2YCFN4P977B29ae.KBDU6iyRKu',	'0895346747092',	'1d9bb9fd-0c75-4b6d-ad8f-bdb5c85b842c',	'jalanan',	'Rectangle 2 2.png',	'jaktim',	'6',	'154',	'2023-07-27 00:26:02.242834+07'),
('f8bcc131-0928-4c0c-a671-5bc734ca87cb',	'admin',	'admin@gmail.com',	'$2b$10$yOnybErNKYPVwHs/Egx7OutnQaydCvGdU7dOjHMAVfs52oF9K5gj2',	'0895346747092',	'3aae176d-8a56-4d92-9974-7fff6f3b684d',	'jalanan',	'Rectangle 2 2.png',	'admin',	'9',	'115',	'2023-07-27 00:26:02.242834+07');

ALTER TABLE ONLY "public"."carts" ADD CONSTRAINT "cart_prod_id_fk" FOREIGN KEY (cart_prod_id) REFERENCES products(prod_id) ON UPDATE CASCADE ON DELETE SET NULL NOT DEFERRABLE;
ALTER TABLE ONLY "public"."carts" ADD CONSTRAINT "cart_user_id_fk" FOREIGN KEY (cart_user_id) REFERENCES users(user_id) NOT VALID NOT DEFERRABLE;

ALTER TABLE ONLY "public"."form_payment" ADD CONSTRAINT "fopa_user_id_fk" FOREIGN KEY (fopa_user_id) REFERENCES users(user_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."products" ADD CONSTRAINT "prod_cate_id_fk" FOREIGN KEY (prod_cate_id) REFERENCES categories(cate_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."users" ADD CONSTRAINT "user_role_id_fk" FOREIGN KEY (user_role_id) REFERENCES roles(role_id) NOT DEFERRABLE;

-- 2023-08-16 17:07:22.113657+07

CREATE table users (
	id SERIAL PRIMARY KEY,
	id_whatsapp VARCHAR(100) NOT NULL,
	number VARCHAR(20) NOT null,
	info_name VARCHAR(50) NOT NULL,
)
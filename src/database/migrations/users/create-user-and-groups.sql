CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	whatsapp_registry VARCHAR(100) NOT NULL,
	cellphone VARCHAR(20) NOT NULL,
	info_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    whatsapp_registry VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_in_chats(
    id_user INTEGER,
    id_chat INTEGER,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    PRIMARY KEY (id_user, id_chat),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_chat) REFERENCES chats(id)
);

CREATE TABLE users_details(
    id_user INTEGER,
    id_chat INTEGER,
    name VARCHAR(75),
    pronoun VARCHAR(20),
    age INTEGER,
    location VARCHAR(50),
    sign VARCHAR(50),
    sexual_orientation VARCHAR(50),
    relationship VARCHAR(50),
    madness_for_love VARCHAR(255),
    instagram VARCHAR(50),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_user, id_chat),
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (id_chat) REFERENCES chats(id)
);
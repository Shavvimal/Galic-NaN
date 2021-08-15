DROP TABLE IF EXISTS buys;

CREATE TABLE buys (
    buy_id serial PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    name VARCHAR(200),
    sector VARCHAR(100),
    fee double precision,
    buy_level double precision NOT NULL,
    num_shares double precision	NOT NULL,
    stored_price double precision NOT NULL,
    date_of_purchase TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id double precision NOT NULL
);

-- Load QuickTicket data
COPY quickticket_data(cardoffice_card_number, campus_id, ride_date, route, month_year)
FROM '/var/lib/postgresql/data/quickticket_data.csv'
WITH (FORMAT csv, HEADER true);

-- Load Historical Card Data
COPY historical_card_data(cardoffice_card_number, card_id_status, ride_date, month_year, hour, route, employee_or_student, campus_id)
FROM '/var/lib/postgresql/data/historical_card_data.csv'
WITH (FORMAT csv, HEADER true);

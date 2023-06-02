# Contact Registry Server
 
To create the table in a MySQL database:

    create table records (
        guid binary(16) DEFAULT (uuid_to_bin(uuid())) NOT null primary key,
        phone varchar(45) NOT null,
        datetime datetime(1) default (CURRENT_TIMESTAMP) NOT null,
        registrationtexts TINYINT,
        registrationcalls TINYINT,
        electiontexts TINYINT,
        electioncalls TINYINT
    );

Install the necessary modules with "npm i" from the Contact Registry Server folder.
Run with "npm start".
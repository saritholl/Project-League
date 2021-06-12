-- IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
-- DROP TABLE dbo.Users
-- GO
-- -- Create the table in the specified schema
-- CREATE TABLE dbo.Users
-- (
--     id INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
--     userPassword VARCHAR(255) NOT NULL,
--     userName VARCHAR(255),
--     userRole VARCHAR(255),
-- );
-- GO

SELECT *
FROM dbo.Users
GO

-- insert into dbo.Users (userPassword, userName, userRole) values ('password', 'Sarit', 'User')
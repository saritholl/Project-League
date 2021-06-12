--  IF OBJECT_ID('dbo.Login', 'U') IS NOT NULL
--  DROP TABLE dbo.Login
-- GO
-- Create the table in the specified schema
-- CREATE TABLE dbo.Login
-- (
--     id INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
--     UserName VARCHAR(255) NOT NULL UNIQUE,
--     PASSWORD VARCHAR(255) NOT NULL,
-- );
-- GO

SELECT *
FROM dbo.Login
GO

-- INSERT INTO dbo.Login (UserName,PASSWORD) values ('tester2020', '123456a')
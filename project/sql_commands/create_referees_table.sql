-- IF OBJECT_ID('dbo.Referees', 'U') IS NOT NULL
-- DROP TABLE dbo.Referees
-- GO
-- -- Create the table in the specified schema
-- CREATE TABLE dbo.Referees
-- (
--     id INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
--     RefereeName VARCHAR(255),
--     RefereeRole VARCHAR(255)
-- );
-- GO

SELECT *
FROM dbo.Referees
GO